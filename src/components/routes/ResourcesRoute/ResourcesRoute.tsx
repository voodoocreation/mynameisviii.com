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
import ResourceListing from "../../presentation/ResourceListing/ResourceListing";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  error?: IError;
  hasAllResources: boolean;
  isLoading: boolean;
  resources: {
    [index: string]: IResource[];
  };
  resourcesCount: number;
}

interface IDispatchProps {
  fetchMoreResources: ActionCreator<{}>;
  fetchResources: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class ResourcesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getResourcesCount(state) === 0) {
      store.dispatch(actions.fetchResources.started({}));
    } else if (!selectors.getHasAllResources(state)) {
      store.dispatch(actions.fetchMoreResources.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const { error, hasAllResources, resources, resourcesCount } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      resourcesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllResources ? null : (
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

    const pageTitle = formatMessage({ id: "RESOURCES_TITLE" });
    const pageDescription = formatMessage({ id: "RESOURCES_DESCRIPTION" });

    return (
      <article className={cn("ResourcesRoute", { hasLoadedAllListings })}>
        <Head>
          <title>{pageTitle}</title>

          <meta content={pageDescription} name="description" />

          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:url" content={absUrl("/resources")} />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="https://s3.amazonaws.com/mynameisviii-static/resources-og.jpg"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <PageHeader>
          <FormattedMessage id="RESOURCES_TITLE" />
        </PageHeader>

        {error ? <OfflineNotice /> : null}

        {resourcesCount > 0
          ? Object.keys(resources).map(this.renderListingsForType)
          : null}

        {hasAllResources && resourcesCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_RESOURCES" />
            </p>
          </NoResults>
        ) : null}

        <ButtonBar>{loadMoreButton}</ButtonBar>
      </article>
    );
  }

  private renderListingsForType = (type: string) => (
    <section
      className={cn("ResourceListings", `ResourceListings-${type}`)}
      key={type}
    >
      <h2>
        <FormattedMessage id={type.toUpperCase()} />
      </h2>

      <p>
        <FormattedMessage id={`RESOURCES_${type.toUpperCase()}_DESCRIPTION`} />
      </p>

      <div className="ResourceListings-items">
        {this.props.resources[type].map((resource: IResource) => (
          <ResourceListing
            {...resource}
            key={resource.slug}
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
    this.props.fetchMoreResources({});
  };
}

const mapStateToProps = (state: any) => ({
  error: selectors.getResourcesError(state),
  hasAllResources: selectors.getHasAllResources(state),
  isLoading: selectors.getResourcesIsLoading(state),
  resources: selectors.getResourcesByType(state),
  resourcesCount: selectors.getResourcesCount(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchMoreResources: actions.fetchMoreResources.started,
      fetchResources: actions.fetchResources.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(ResourcesRoute)
);
