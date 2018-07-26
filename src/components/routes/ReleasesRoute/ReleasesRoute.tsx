import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";
import ReleaseListing from "../../presentation/ReleaseListing/ReleaseListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
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
    const { hasAllReleases, releases, releasesCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings = releasesCount === Object.keys(this.state.loadedListings).length;

    const isLoading =
      this.props.isLoading ||
      !hasLoadedAllListings;

    const loadMoreButton = hasAllReleases ? null : (
      <LoadButton isLoading={isLoading} onLoad={this.onLoadMore}>
        <FormattedMessage id="LOAD_MORE" />
      </LoadButton>
    );

    return (
      <article className={cn("ReleasesRoute", { hasLoadedAllListings })}>
        <Head>
          <title>
            {formatMessage({ id: "RELEASES_TITLE" })}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta
            content={formatMessage({ id: "RELEASES_DESCRIPTION" })}
            name="description"
          />
          <meta
            property="og:title"
            content={formatMessage({ id: "RELEASES_TITLE" })}
          />
          <meta
            property="og:description"
            content={formatMessage({ id: "RELEASES_DESCRIPTION" })}
          />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/homepage-og.jpg"
          />
          <meta property="og:url" content={absUrl("/releases")} />
          <meta property="og:type" content="website" />
        </Head>

        <PageHeader>
          <FormattedMessage id="RELEASES_TITLE" />
        </PageHeader>

        {Object.keys(releases).length > 0
          ? Object.keys(releases).map(this.renderListingsForType)
          : null}

        {hasAllReleases && Object.keys(releases).length === 0 ? (
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

  private renderListingsForType = (type: string) => (
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
  );

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
  hasAllReleases: selectors.getHasAllReleases(state),
  isLoading: selectors.getReleasesIsLoading(state),
  releases: selectors.getReleasesByType(state),
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
