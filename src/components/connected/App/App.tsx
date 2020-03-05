import "../../../../polyfills";

import { NextPageContext } from "next";
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import NextApp, { AppContext, AppProps } from "next/app";
import * as React from "react";
import { IntlProvider } from "react-intl-redux";
import { Provider } from "react-redux";

import routes from "../../../../next.routes";
import * as actions from "../../../actions/root.actions";
import { isServer } from "../../../helpers/dom";
import * as selectors from "../../../selectors/root.selectors";
import { createStore, TStore } from "../../../store/root.store";
import Page from "../Page/Page";

import "../../../scss/index.scss";

export interface IPageContext extends NextPageContext {
  store: TStore;
  isServer: boolean;
}

export interface IAppContext extends AppContext {
  store: TStore;
  ctx: IPageContext;
}

interface IProps extends AppProps {
  intlProps: {
    locale: string;
  };
  store: TStore;
}

const getIntlProps = (ctx: NextPageContext) => {
  const requestProps = isServer()
    ? ctx.req
    : window.__NEXT_DATA__.props.initialProps.intlProps;
  const { locale } = requestProps;

  return {
    locale
  };
};

// @ts-ignore-next-line
export class App extends NextApp<IProps> {
  private readonly serviceWorkerContainer: any = undefined;

  constructor(props: IProps) {
    super(props);

    if (
      !isServer() &&
      "serviceWorker" in navigator &&
      (window.location.protocol === "https:" ||
        window.location.hostname === "localhost")
    ) {
      // eslint-disable-next-line
      this.serviceWorkerContainer = require("serviceworker-webpack-plugin/lib/runtime");
    }

    routes.Router.onRouteChangeStart = this.onRouteChangeStart;
    routes.Router.onRouteChangeComplete = this.onRouteChangeComplete;
    routes.Router.onRouteChangeError = this.onRouteChangeError;
  }

  public static getInitialProps = async ({ ctx, Component }: IAppContext) => {
    let pageProps = {};

    const unsubscribe = ctx.store.subscribe(() => {
      const error = selectors.getAppError(ctx.store.getState());

      if (error && ctx.res) {
        ctx.res.statusCode = error.status;
        unsubscribe();
      }
    });

    const intlProps = getIntlProps(ctx);

    ctx.store.dispatch(
      actions.initApp.started({
        locale: intlProps.locale
      })
    );

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { intlProps, pageProps };
  };

  public componentDidMount() {
    const { store } = this.props as IProps;

    store.dispatch(actions.setOnlineStatus(navigator.onLine));
    store.dispatch(actions.setCurrentRoute(routes.Router.route));

    if (!isServer()) {
      window.addEventListener("feature", this.onReceiveFeature);
      store.dispatch(actions.trackEvent({ event: "optimize.activate" }));
    }

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
    window.removeEventListener("feature", this.onReceiveFeature);

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
    const { Component, intlProps, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <IntlProvider defaultLocale="en-NZ" locale={intlProps.locale}>
          <Page>
            <Component {...pageProps} />
          </Page>
        </IntlProvider>
      </Provider>
    );
  }

  private onReceiveFeature = (event: any) => {
    const { store } = this.props;

    store.dispatch(actions.addFeatures(event.detail));
  };

  private onReceiveServiceWorkerPostMessage = (event: any) => {
    const { store } = this.props;

    store.dispatch(actions.receiveServiceWorkerMessage(event.data));
  };

  private onBeforeInstallPrompt = async (event: any) => {
    const { store } = this.props;

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
    const { store } = this.props;

    store.dispatch(actions.setOnlineStatus(event.type === "online"));
  };

  private onRouteChangeStart = (path: string) => {
    const { store } = this.props;

    store.dispatch(actions.changeRoute.started(path));
  };

  private onRouteChangeComplete = (path: string) => {
    const { store } = this.props;

    store.dispatch(actions.changeRoute.done({ params: path, result: {} }));
  };

  private onRouteChangeError = (error: Error, path: string) => {
    const { store } = this.props;

    store.dispatch(
      actions.changeRoute.failed({
        error: error.message,
        params: path
      })
    );
  };
}

export default withRedux(createStore)(withReduxSaga(App));
