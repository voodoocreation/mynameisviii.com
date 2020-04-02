import Head from "next/head";
import * as React from "react";
import { WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

import * as actions from "../../../actions/root.actions";
import { absoluteUrl } from "../../../helpers/dataTransformers";
import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { IAppearance, ILatLng } from "../../../models/root.models";
import { TStoreState } from "../../../reducers/root.reducers";
import * as selectors from "../../../selectors/root.selectors";
import { IPageContext } from "../../connected/App/App";
import Appearance from "../../presentation/Appearance/Appearance";
import Loader from "../../presentation/Loader/Loader";

interface IProps extends WrappedComponentProps {
  appearance?: IAppearance;
  currentLocation?: ILatLng;
  fetchAppearanceBySlug: typeof actions.fetchAppearanceBySlug.started;
  geocodeCurrentAppearanceAddress: typeof actions.geocodeCurrentAppearanceAddress.started;
  isLoading: boolean;
  trackEvent: typeof actions.trackEvent;
}

class AppearanceRoute extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);

    if (props.appearance && !props.currentLocation) {
      props.geocodeCurrentAppearanceAddress({});
    }
  }

  public static getInitialProps = async (context: IPageContext) => {
    const { query, store } = context;
    const slug = query.slug as string;

    store.dispatch(actions.setCurrentAppearanceSlug(slug));

    if (!selectors.getCurrentAppearance(store.getState())) {
      store.dispatch(actions.fetchAppearanceBySlug.started(slug));
    }
  };

  public render() {
    const { appearance, currentLocation, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!appearance) {
      return null;
    }

    return (
      <>
        <Head>
          <title>
            {appearance.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={appearance.description} name="description" />

          <meta content={appearance.title} property="og:title" />
          <meta content={appearance.description} property="og:description" />
          <meta
            content={absoluteUrl(`/appearances/${appearance.slug}`)}
            property="og:url"
          />
          <meta content="website" property="og:type" />
          <meta content={appearance.ogImageUrl} property="og:image" />
          <meta content="1200" property="og:image:width" />
          <meta content="630" property="og:image:height" />
        </Head>

        <Appearance
          {...appearance}
          locationLatLng={currentLocation}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `appearance.gallery.${type}`,
      index,
    });
  };
}

const mapState = (state: TStoreState) => ({
  appearance: selectors.getCurrentAppearance(state),
  currentLocation: selectors.getCurrentAppearanceLocation(state),
  isLoading: selectors.getAppearancesIsLoading(state),
});

const mapActions = {
  fetchAppearanceBySlug: actions.fetchAppearanceBySlug.started,
  geocodeCurrentAppearanceAddress:
    actions.geocodeCurrentAppearanceAddress.started,
  trackEvent: actions.trackEvent,
};

export default injectIntlIntoPage(
  connect(mapState, mapActions)(AppearanceRoute)
);
