import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import OfflineNotice from "../../connected/OfflineNotice/OfflineNotice";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import ReleaseListing from "../../presentation/ReleaseListing/ReleaseListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  error?: IError;
  hasAllReleases: boolean;
  isLoading: boolean;
  releases: {
    [index: string]: IRelease[];
  };
  releasesCount: number;
}

interface IDispatchProps {
  fetchMoreReleases: ActionCreator<{}>;
  fetchReleases: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class ReleasesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getReleasesCount(state) === 0) {
      store.dispatch(actions.fetchReleases.started({}));
    } else if (!selectors.getHasAllReleases(state)) {
      store.dispatch(actions.fetchMoreReleases.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const { error, hasAllReleases, releases, releasesCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      releasesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllReleases ? null : (
      <LoadButton
        isLoading={isLoading}
        isScrollLoadEnabled={!error}
        onLoad={this.onLoadMore}
      >
        {!error ? (
          <FormattedMessage id="LOAD_MORE" />
        ) : (
          <FormattedMessage id="TRY_AGAIN" />
        )}
      </LoadButton>
    );

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
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/theme/heart/og/releases.jpg"
          />
          <meta property="og:url" content={absUrl("/releases")} />
        </Head>

        <PageHeader>
          <FormattedMessage id="RELEASES_TITLE" />
        </PageHeader>

        {error ? <OfflineNotice /> : null}

        {releasesCount > 0
          ? Object.keys(releases).map(this.renderListingsForType)
          : null}

        {hasAllReleases && releasesCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_RELEASES" />
            </p>
          </NoResults>
        ) : null}

        <ButtonBar>{loadMoreButton}</ButtonBar>
      </article>
    );
  }

  private renderListingsForType = (type: string) => this.props.releases[type] ? (
    <section
      className={cn("ReleaseListings", `ReleaseListings-${type}`)}
      key={type}
    >
      <h2>
        <FormattedMessage id={`${type.toUpperCase()}S`} />
      </h2>

      <div className="ReleaseListings-items">
        {this.props.releases[type].map((release: IRelease) => (
          <ReleaseListing
            {...release}
            key={release.slug}
            onLoad={this.onListingLoad}
          />
        ))}
      </div>
    </section>
  ) : null;

  private onListingLoad = (slug: string) => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreReleases({});
  };
}

const mapStateToProps = (state: any) => ({
  error: selectors.getReleasesError(state),
  hasAllReleases: selectors.getHasAllReleases(state),
  isLoading: selectors.getReleasesIsLoading(state),
  releases: selectors.getSortedReleasesByType(state),
  releasesCount: selectors.getReleasesCount(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMoreReleases: actions.fetchMoreReleases.started,
      fetchReleases: actions.fetchReleases.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(ReleasesRoute)
);
