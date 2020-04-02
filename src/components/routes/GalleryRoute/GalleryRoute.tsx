import Head from "next/head";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IGallery } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import Gallery from "../../presentation/Gallery/Gallery";
import Loader from "../../presentation/Loader/Loader";

interface IProps extends WrappedComponentProps {
  fetchGalleryBySlug: typeof actions.fetchGalleryBySlug.started;
  gallery?: IGallery;
  isLoading: boolean;
  trackEvent: typeof actions.trackEvent;
}

class GalleryRoute extends React.Component<IProps> {
  public static getInitialProps = async (context: IPageContext) => {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentGallerySlug(slug));

    const state = store.getState();
    const currentGallery = selectors.getCurrentGallery(state);

    if (!currentGallery || !currentGallery.images) {
      store.dispatch(actions.fetchGalleryBySlug.started(slug));
    }
  };

  public render() {
    const { gallery, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!gallery) {
      return null;
    }

    return (
      <>
        <Head>
          <title>
            {gallery.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={gallery.description} name="description" />

          <meta content={gallery.title} property="og:title" />
          <meta content={gallery.description} property="og:description" />
          <meta
            content={absoluteUrl(`/galleries/${gallery.slug}`)}
            property="og:url"
          />
          <meta content="website" property="og:type" />
          <meta content={gallery.imageUrl} property="og:image" />
        </Head>

        <Gallery
          {...gallery}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `gallery.gallery.${type}`,
      index,
    });
  };
}

const mapState = (state: TStoreState) => ({
  gallery: selectors.getCurrentGallery(state),
  isLoading: selectors.getGalleriesIsLoading(state),
});

const mapActions = {
  fetchGalleryBySlug: actions.fetchGalleryBySlug.started,
  trackEvent: actions.trackEvent,
};

export default injectIntlIntoPage(connect(mapState, mapActions)(GalleryRoute));
