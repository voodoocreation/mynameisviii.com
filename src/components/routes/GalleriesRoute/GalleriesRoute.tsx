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
import GalleryListing from "../../presentation/GalleryListing/GalleryListing";
import LoadButton from "../../presentation/LoadButton/LoadButton";
import NoResults from "../../presentation/NoResults/NoResults";
import PageHeader from "../../presentation/PageHeader/PageHeader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  error?: IError;
  galleries: IGallery[];
  galleriesCount: number;
  hasAllGalleries: boolean;
  isLoading: boolean;
}

interface IDispatchProps {
  fetchGalleries: ActionCreator<{}>;
  fetchMoreGalleries: ActionCreator<{}>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

interface IState {
  loadedListings: {
    [index: string]: boolean;
  };
}

class GalleriesRoute extends React.Component<IProps, IState> {
  public static async getInitialProps(props: any) {
    const { isServer, store } = props.ctx;

    const state = store.getState();

    if (isServer || selectors.getGalleriesCount(state) === 0) {
      store.dispatch(actions.fetchGalleries.started({}));
    } else if (!selectors.getHasAllGalleries(state)) {
      store.dispatch(actions.fetchMoreGalleries.started({}));
    }
  }

  public readonly state = {
    loadedListings: {}
  };

  public render() {
    const { galleries, galleriesCount, error, hasAllGalleries } = this.props;
    const { formatMessage } = this.props.intl;

    const hasLoadedAllListings =
      galleriesCount === Object.keys(this.state.loadedListings).length;

    const isLoading = this.props.isLoading || !hasLoadedAllListings;

    const loadMoreButton = hasAllGalleries ? null : (
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

    const pageTitle = formatMessage({ id: "GALLERIES_TITLE" });
    const pageDescription = formatMessage({ id: "GALLERIES_DESCRIPTION" });

    return (
      <article className={cn("GalleriesRoute", { hasLoadedAllListings })}>
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
            content="https://s3.amazonaws.com/mynameisviii-static/galleries-og.jpg"
          />
          <meta property="og:url" content={absUrl("/galleries")} />
        </Head>

        <PageHeader>
          <FormattedMessage id="GALLERIES_TITLE" />
        </PageHeader>

        {error ? <OfflineNotice /> : null}

        {galleriesCount > 0 ? (
          <section className="GalleryListings">
            {galleries.map(gallery => (
              <GalleryListing
                {...gallery}
                key={gallery.slug}
                onLoad={this.onListingLoad}
              />
            ))}
          </section>
        ) : null}

        {hasAllGalleries && galleriesCount === 0 ? (
          <NoResults>
            <p>
              <FormattedMessage id="NO_GALLERIES" />
            </p>
          </NoResults>
        ) : null}

        <ButtonBar>{loadMoreButton}</ButtonBar>
      </article>
    );
  }

  private onListingLoad = (slug: string) => {
    this.setState({
      loadedListings: {
        ...this.state.loadedListings,
        [slug]: true
      }
    });
  };

  private onLoadMore = () => {
    this.props.fetchMoreGalleries({});
  };
}

const mapStateToProps = (state: any) => ({
  error: selectors.getGalleriesError(state),
  galleries: selectors.getGalleriesAsArray(state),
  galleriesCount: selectors.getGalleriesCount(state),
  hasAllGalleries: selectors.getHasAllGalleries(state),
  isLoading: selectors.getGalleriesIsLoading(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchGalleries: actions.fetchGalleries.started,
      fetchMoreGalleries: actions.fetchMoreGalleries.started
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(GalleriesRoute)
);
