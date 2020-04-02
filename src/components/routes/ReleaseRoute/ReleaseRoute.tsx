import Head from "next/head";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";
import stripTags from "striptags";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IRelease, IReleaseTrack } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import Loader from "../../presentation/Loader/Loader";
import Release from "../../presentation/Release/Release";

interface IProps extends WrappedComponentProps {
  fetchReleaseBySlug: typeof actions.fetchReleaseBySlug.started;
  isLoading: boolean;
  release?: IRelease;
  trackEvent: typeof actions.trackEvent;
}

class ReleaseRoute extends React.Component<IProps> {
  public static getInitialProps = async (context: IPageContext) => {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentReleaseSlug(slug));

    const state = store.getState();

    if (!selectors.getCurrentRelease(state)) {
      store.dispatch(actions.fetchReleaseBySlug.started(slug));
    }
  };

  public render() {
    const { isLoading, release } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!release) {
      return null;
    }

    return (
      <>
        <Head>
          <title>
            {release.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta
            content={stripTags(release.description).replace(/\n/g, "")}
            name="description"
          />

          <meta content={release.title} property="og:title" />
          <meta
            content={stripTags(release.description).replace(/\n/g, "")}
            property="og:description"
          />
          <meta
            content={absoluteUrl(`/releases/${release.slug}`)}
            property="og:url"
          />
          <meta content="music.album" property="og:type" />
          <meta content={release.releasedOn} property="music:release_date" />
          <meta content={release.artist.url} property="music:musician" />
          {release.tracklist.map(this.renderTracklistAlbumMeta)}
          <meta content={release.images[0].imageUrl} property="og:image" />
          <meta content="640" property="og:image:width" />
          <meta content="640" property="og:image:height" />
        </Head>

        <Release
          {...release}
          onCarouselSlideChange={this.onCarouselSlideChange}
        />
      </>
    );
  }

  private renderTracklistAlbumMeta = (
    disc: IReleaseTrack[],
    discIndex: number
  ) => (
    <React.Fragment key={discIndex}>
      {disc.map((track, trackIndex) => (
        <React.Fragment key={track.url}>
          <meta content={track.url} property="music:song" />
          <meta content={`${discIndex + 1}`} property="music:disc" />
          <meta content={`${trackIndex + 1}`} property="music:track" />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  private onCarouselSlideChange = (index: number) => {
    this.props.trackEvent({
      event: "release.carousel.slideChange",
      index,
    });
  };
}

const mapState = (state: TStoreState) => ({
  isLoading: selectors.getReleasesIsLoading(state),
  release: selectors.getCurrentRelease(state),
});

const mapActions = {
  fetchReleaseBySlug: actions.fetchReleaseBySlug.started,
  trackEvent: actions.trackEvent,
};

export default injectIntlIntoPage(connect(mapState, mapActions)(ReleaseRoute));
