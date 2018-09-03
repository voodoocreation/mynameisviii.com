import Head from "next/head";
import * as React from "react";
import { InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntlIntoPage from "../../../helpers/injectIntlIntoPage";
import { absUrl } from "../../../transformers/transformData";
import Appearance from "../../presentation/Appearance/Appearance";
import ErrorPage from "../../presentation/ErrorPage/ErrorPage";
import Loader from "../../presentation/Loader/Loader";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  appearance?: IAppearance;
  currentLocation?: ILatLng;
  error?: IError;
  isLoading: boolean;
}

interface IDispatchProps {
  fetchAppearanceBySlug: ActionCreator<PLFetchAppearanceBySlugStarted>;
  geocodeCurrentAppearanceAddress: ActionCreator<{}>;
  trackEvent: ActionCreator<PLTrackEvent>;
}

interface IProps extends IStoreProps, IDispatchProps {
  intl: InjectedIntl;
}

class AppearanceRoute extends React.Component<IProps> {
  public static async getInitialProps(props: any) {
    const { query, store } = props.ctx;

    store.dispatch(actions.setCurrentAppearanceSlug(query.slug));

    if (!selectors.getCurrentAppearance(store.getState())) {
      store.dispatch(actions.fetchAppearanceBySlug.started(query.slug));
    }
  }

  public componentWillMount() {
    if (this.props.appearance && !this.props.currentLocation) {
      this.props.geocodeCurrentAppearanceAddress({});
    }
  }

  public render() {
    const { appearance, currentLocation, error, isLoading } = this.props;
    const { formatMessage } = this.props.intl;

    if (isLoading) {
      return <Loader className="PageLoader" />;
    }

    if (!appearance) {
      return <ErrorPage {...error} />;
    }

    return (
      <React.Fragment>
        <Head>
          <title>
            {appearance.title}
            {" · "}
            {formatMessage({ id: "BRAND_NAME" })}
          </title>

          <meta content={appearance.description} name="description" />

          <meta property="og:title" content={appearance.title} />
          <meta property="og:description" content={appearance.description} />
          <meta
            property="og:url"
            content={absUrl(`/appearances/${appearance.slug}`)}
          />
          <meta property="og:image" content={appearance.ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <Appearance
          {...appearance}
          locationLatLng={currentLocation}
          onGalleryInteraction={this.onGalleryInteraction}
        />
      </React.Fragment>
    );
  }

  private onGalleryInteraction = (type: string, index?: number) => {
    this.props.trackEvent({
      event: `appearance.gallery.${type}`,
      index
    });
  };
}

const mapStateToProps = (state: any) => ({
  appearance: selectors.getCurrentAppearance(state),
  currentLocation: selectors.getCurrentAppearanceLocation(state),
  error: selectors.getAppearancesError(state),
  isLoading: selectors.getAppearancesIsLoading(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearanceBySlug: actions.fetchAppearanceBySlug.started,
      geocodeCurrentAppearanceAddress:
        actions.geocodeCurrentAppearanceAddress.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntlIntoPage(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(AppearanceRoute)
);
