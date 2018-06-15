import cn from "classnames";
import Head from "next/head";
import * as React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntl from "../../../helpers/injectIntl";
import ButtonBar from "../../presentation/ButtonBar/ButtonBar";
import LoadButton from "../../presentation/LoadButton/LoadButton";
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

    const isLoading =
      this.props.isLoading ||
      releasesCount !== Object.keys(this.state.loadedListings).length;

    const loadMoreButton = hasAllReleases ? null : (
      <LoadButton isLoading={isLoading} onLoad={this.onLoadMore}>
        <FormattedMessage id="LOAD_MORE" />
      </LoadButton>
    );

    return (
      <React.Fragment>
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
        </Head>

        <PageHeader>
          <FormattedMessage id="RELEASES_TITLE" />
        </PageHeader>

        {Object.keys(releases).map(this.renderListingsForType)}

        <ButtonBar>{loadMoreButton}</ButtonBar>
      </React.Fragment>
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

export default injectIntl(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(ReleasesRoute)
);
