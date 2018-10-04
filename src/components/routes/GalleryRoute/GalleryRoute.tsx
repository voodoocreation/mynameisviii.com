import Head from "next/head";
import * as React from "react";
import { InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import ErrorPage from "../../presentation/ErrorPage/ErrorPage";
import Gallery from "../../presentation/Gallery/Gallery";
import Loader from "../../presentation/Loader/Loader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  gallery?: IGallery;
  error?: IError;
  isLoading: boolean;
}

interface IDispatchProps {
  fetchGalleryBySlug: ActionCreator<PLFetchGalleryBySlugStarted>;
  trackEvent: ActionCreator<PLTrackEvent>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class GalleryRoute extends React.Component<IProps> {
  public static async getInitialProps(props: any) {
    const { query, store } = props.ctx;

    store.dispatch(actions.setCurrentGallerySlug(query.slug));

    const state = store.getState();
    const currentGallery = selectors.getCurrentGallery(state);

    if (!currentGallery || !currentGallery.images) {
      store.dispatch(actions.fetchGalleryBySlug.started(query.slug));
    }
  }

  public render() {
    const { gallery, error, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!gallery) {
      return <ErrorPage {...error} />;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {gallery.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={gallery.description} name="description" />

          <meta property="og:title" content={gallery.title} />
          <meta property="og:description" content={gallery.description} />
          <meta
            property="og:url"
            content={absUrl(`/galleries/${gallery.slug}`)}
          />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={gallery.imageUrl} />
        </Head>

        <Gallery
          {...gallery}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </React.Fragment>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `gallery.gallery.${type}`,
      index
    });
  };
}

const mapStateToProps = (state: any) => ({
  error: selectors.getGalleriesError(state),
  gallery: selectors.getCurrentGallery(state),
  isLoading: selectors.getGalleriesIsLoading(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchGalleryBySlug: actions.fetchGalleryBySlug.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(GalleryRoute)
);
