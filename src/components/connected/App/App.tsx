// tslint:disable:no-submodule-imports
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import App, { AppComponentProps, Container } from "next/app";
import { NextDocumentContext as Context } from "next/document";
import * as React from "react";
import { addLocaleData, IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { Store } from "redux";

import routes from "../../../../next.routes";
import * as actions from "../../../actions/root.actions";
import { isServer } from "../../../helpers/dom";
import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";

import Shell from "../Shell/Shell";

import en from "react-intl/locale-data/en";
// tslint:enable:no-submodule-imports

addLocaleData([...en]);

type NextPageComponent = React.ComponentType<any> & {
  getInitialProps: (props: any) => any;
};

interface IProps extends AppComponentProps {
  Component: NextPageComponent;
  ctx: Context & { store: any };
  intlProps: {
    locale: string;
    intlMessages: {};
    initialNow: Date;
  };
  pageProps: {};
  store: Store<any>;
}

const getIntlProps = (ctx: Context) => {
  const requestProps = isServer()
    ? ctx.req
    : window.__NEXT_DATA__.props.initialProps.intlProps;
  const { locale, intlMessages } = requestProps;

  return {
    initialNow: Date.now(),
    intlMessages: intlMessages || {},
    locale: locale || "en-NZ"
  };
};

class Application extends App {
  public static async getInitialProps({ ctx, Component }: IProps) {
    let pageProps = {};

    const unsubscribe = ctx.store.subscribe(() => {
      const state = ctx.store.getState();
      const pageError = selectors.getPageError(state);

      if (pageError && ctx.res) {
        ctx.res.statusCode = pageError.status;
        unsubscribe();
      }
    });

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }

    const intlProps = getIntlProps(ctx);

    return { pageProps, intlProps };
  }

  private serviceWorkerContainer: any = undefined;

  public componentWillMount() {
    if (
      !isServer() &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost")
    ) {
      // tslint:disable-next-line
      this.serviceWorkerContainer = require("serviceworker-webpack-plugin/lib/runtime");
    }

    routes.Router.onRouteChangeStart = this.onRouteChangeStart;
    routes.Router.onRouteChangeComplete = this.onRouteChangeComplete;
    routes.Router.onRouteChangeError = this.onRouteChangeError;
  }

  public componentDidMount() {
    const { store } = this.props as IProps;

    store.dispatch(actions.updateOnlineStatus(navigator.onLine));
    store.dispatch(actions.setCurrentRoute(routes.Router.route));

    if (this.serviceWorkerContainer) {
      navigator.serviceWorker.addEventListener(
        "message",
        this.onReceiveServiceWorkerPostMessage
      );

      window.addEventListener(
        "beforeinstallprompt",
        this.onBeforeInstallPrompt
      );

      this.serviceWorkerContainer.register({ scope: "/" }).then(() => {
        window.addEventListener("offline", this.onOnlineStatusChange);
        window.addEventListener("online", this.onOnlineStatusChange);
      });
    }
  }

  public componentWillUnmount() {
    if (this.serviceWorkerContainer) {
      navigator.serviceWorker.removeEventListener(
        "message",
        this.onReceiveServiceWorkerPostMessage
      );

      window.removeEventListener(
        "beforeinstallprompt",
        this.onBeforeInstallPrompt
      );

      window.removeEventListener("offline", this.onOnlineStatusChange);
      window.removeEventListener("online", this.onOnlineStatusChange);
    }
  }

  public render() {
    const { Component, intlProps, pageProps, store } = this.props as IProps;

    return (
      <Container>
        <Provider store={store}>
          <IntlProvider
            initialNow={intlProps.initialNow}
            messages={intlProps.intlMessages}
            locale={intlProps.locale}
          >
            <Shell>
              <Component {...pageProps} />
            </Shell>
          </IntlProvider>
        </Provider>
      </Container>
    );
  }

  private onReceiveServiceWorkerPostMessage = (event: any) => {
    const { store } = this.props as IProps;

    store.dispatch(actions.receiveServiceWorkerMessage(event.data));
  };

  private onBeforeInstallPrompt = async (event: any) => {
    const { store } = this.props as IProps;

    store.dispatch(
      actions.trackEvent({
        event: "addToHomeScreen.prompted"
      })
    );

    const { outcome } = await event.userChoice;

    store.dispatch(
      actions.trackEvent({
        event: "addToHomeScreen.outcome",
        outcome
      })
    );
  };

  private onOnlineStatusChange = (event: Event) => {
    const { store } = this.props as IProps;

    store.dispatch(actions.updateOnlineStatus(event.type === "online"));
  };

  private onRouteChangeStart = (path: string) => {
    const { store } = this.props as IProps;

    store.dispatch(actions.changeRoute.started(path));
  };

  private onRouteChangeComplete = (path: string) => {
    const { store } = this.props as IProps;

    store.dispatch(actions.changeRoute.done({ params: path }));
  };

  private onRouteChangeError = (error: Error, path: string) => {
    const { store } = this.props as IProps;

    store.dispatch(
      actions.changeRoute.failed({
        error: {
          message: error.toString(),
          status: 500
        },
        params: path
      })
    );
  };
}

export default withRedux(createStore)(
  withReduxSaga({ async: true })(Application)
);
