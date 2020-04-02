import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl, s3ThemeUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IRelease } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import ReleaseListing from "../../presentation/ReleaseListing/ReleaseListing";

import "./ReleasesRoute.scss";

interface IProps extends WrappedComponentProps {
  fetchMoreReleases: typeof actions.fetchMoreReleases.started;
  fetchReleases: typeof actions.fetchReleases.started;
  hasAllReleases: boolean;
  hasError: boolean;
  isLoading: boolean;
  releases: Record<string, IRelease[]>;
  releasesCount: number;
}

interface IState {
  loadedListings: Record<string, boolean>;
}

class ReleasesRoute extends React.Component<IProps, IState> {
  public readonly state: IState = {
    loadedListings: {},
  };

  public static getInitialProps = async (context: IPageContext) => {
    const { isServer, store } = context;

    const state = store.getState();

    if (isServer || selectors.getReleasesCount(state) === 0) {
      store.dispatch(actions.fetchReleases.started({}));
    } else if (!selectors.getHasAllReleases(state)) {
      store.dispatch(actions.fetchMoreReleases.started({}));
    }
  };

  public render() {
    const { hasAllReleases, hasError, releases, releasesCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      releasesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const pageTitle = formatMessage({ id: "RELEASES_TITLE" });
    const pageDescription = formatMessage({ id: "RELEASES_DESCRIPTION" });

    return (
      <article className={cn("ReleasesRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {pageTitle}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={pageDescription} name="description" />
          <meta content={pageTitle} property="og:title" />
          <meta content={pageDescription} property="og:description" />
          <meta content="website" property="og:type" />
          <meta content={s3ThemeUrl("/og/releases.jpg")} property="og:image" />
          <meta content={absoluteUrl("/releases")} property="og:url" />
        </Head>

        <PageHeader>
          <FormattedMessage id="RELEASES_TITLE" />
        </PageHeader>

        {hasError ? <OfflineNotice /> : null}

        {releasesCount > 0
          ? Object.keys(releases).map(this.renderListingsForType)
          : null}

        {hasAllReleases && releasesCount === 0 ? (
          <NoResults entityIntlId="RELEASE" />
        ) : null}

        <ButtonBar>
          {!hasAllReleases ? (
            <LoadButton
              hasError={hasError}
              isLoading={isLoading}
              onLoad={this.onLoadMore}
            />
          ) : null}
        </ButtonBar>
      </article>
    );
  }

  private renderListingsForType = (type: string) =>
    this.props.releases[type] ? (
      <section
        className={cn(
          "ReleasesRoute--listings",
          `ReleasesRoute--listings-${type}`
        )}
        key={type}
      >
        <h2>
          <FormattedMessage id={type.toUpperCase()} values={{ count: 2 }} />
        </h2>

        <div className="ReleasesRoute--listings--items">
          {this.props.releases[type].map((release: IRelease) => (
            <ReleaseListing
              {...release}
              key={release.slug}
              onLoad={this.onListingLoad(release)}
            />
          ))}
        </div>
      </section>
    ) : null;

  private onListingLoad = (release: IRelease) => () => {
    this.setState((state) => ({
      loadedListings: {
        ...state.loadedListings,
        [release.slug]: true,
      },
    }));
  };

  private onLoadMore = () => {
    this.props.fetchMoreReleases({});
  };
}

const mapState = (state: TStoreState) => ({
  hasAllReleases: selectors.getHasAllReleases(state),
  hasError: selectors.hasReleasesError(state),
  isLoading: selectors.getReleasesIsLoading(state),
  releases: selectors.getSortedReleasesByType(state),
  releasesCount: selectors.getReleasesCount(state),
});

const mapActions = {
  fetchMoreReleases: actions.fetchMoreReleases.started,
  fetchReleases: actions.fetchReleases.started,
};

export default injectIntlIntoPage(connect(mapState, mapActions)(ReleasesRoute));
