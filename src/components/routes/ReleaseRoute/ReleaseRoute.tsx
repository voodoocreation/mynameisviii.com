import Head from "next/head";
import * as React from "react";
import { InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import { absUrl } from "../../../domain/transformData";
import injectIntl from "../../../helpers/injectIntl";
import ConnectedErrorPage from "../../containers/ConnectedErrorPage/ConnectedErrorPage";
import Release from "../../presentation/Release/Release";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  release?: IRelease;
}

interface IDispatchProps {
  fetchReleaseBySlug: ActionCreator<PLFetchReleaseBySlugStarted>;
  trackEvent: ActionCreator<PLTrackEvent>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class ReleaseRoute extends React.Component<IProps> {
  public static async getInitialProps(props: any) {
    const { query, store } = props.ctx;

    store.dispatch(actions.setCurrentReleaseSlug(query.slug));

    const state = store.getState();

    if (!selectors.getCurrentRelease(state)) {
      store.dispatch(actions.fetchReleaseBySlug.started(query.slug));
    }
  }

  public render() {
    const { release } = this.props;
    const { formatMessage } = this.props.intl;

    if (!release) {
      return <ConnectedErrorPage />;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {release.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={release.description} name="description" />

          <meta property="og:title" content={release.title} />
          <meta property="og:description" content={release.description} />
          <meta
            property="og:url"
            content={absUrl(`/releases/${release.slug}`)}
          />
          <meta property="og:type" content="music.album" />
          <meta property="music:release_date" content={release.releasedOn} />
          <meta property="music:musician" content={release.artist.url} />
          {release.tracklist.map(this.renderTracklistAlbumMeta)}
          <meta property="og:image" content={release.images[0].imageUrl} />
          <meta property="og:image:width" content="640" />
          <meta property="og:image:height" content="640" />
        </Head>

        <Release
          {...release}
          onCarouselSlideChange={this.onCarouselSlideChange}
        />
      </React.Fragment>
    );
  }

  private renderTracklistAlbumMeta = (
    album: IReleaseTrack[],
    albumIndex: number
  ) => (
    <React.Fragment key={albumIndex}>
      {album.map((track, trackIndex) => (
        <React.Fragment key={trackIndex}>
          <meta property="music:song" content={track.url} />
          <meta property="music:disc" content={`${albumIndex + 1}`} />
          <meta property="music:track" content={`${trackIndex + 1}`} />
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  private onCarouselSlideChange = (index: number) => {
    this.props.trackEvent({
      event: "release.carousel.slideChange",
      index
    });
  };
}

const mapStateToProps = (state: any) => ({
  release: selectors.getCurrentRelease(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchReleaseBySlug: actions.fetchReleaseBySlug.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntl(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(ReleaseRoute)
);
