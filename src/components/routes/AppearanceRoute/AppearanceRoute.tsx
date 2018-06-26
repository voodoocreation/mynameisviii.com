import Head from "next/head";
import * as React from "react";
import { InjectedIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { ActionCreator } from "typescript-fsa";

import injectIntl from "../../../helpers/injectIntl";
import { absUrl } from "../../../transformers/transformData";
import ConnectedErrorPage from "../../containers/ConnectedErrorPage/ConnectedErrorPage";
import Appearance from "../../presentation/Appearance/Appearance";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";

interface IStoreProps {
  appearance?: IAppearance;
}

interface IDispatchProps {
  fetchAppearanceBySlug: ActionCreator<PLFetchAppearanceBySlugStarted>;
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

  public render() {
    const { appearance } = this.props;
    const { formatMessage } = this.props.intl;

    if (!appearance) {
      return <ConnectedErrorPage />;
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
          <meta property="og:type" content="website" />
          <meta property="og:image" content={appearance.ogImageUrl} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </Head>

        <Appearance
          {...appearance}
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
  appearance: selectors.getCurrentAppearance(state)
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchAppearanceBySlug: actions.fetchAppearanceBySlug.started,
      trackEvent: actions.trackEvent
    },
    dispatch
  );

export default injectIntl(
  connect<IStoreProps, IDispatchProps>(
    mapStateToProps,
    mapDispatchToProps
  )(AppearanceRoute)
);
