import { mount } from "enzyme";
import merge from "lodash.merge";
import * as React from "react";

import App from "./App";

jest.mock("serviceworker-webpack-plugin/lib/runtime", () => ({
  register: jest.fn(() => new Promise(resolve => resolve()))
}));

jest.mock("../../../../next.routes", () => ({
  Router: {
    route: ""
  }
}));

import routes from "../../../../next.routes";

const setup = async (fn: any, fromTestProps?: any) => {
  const Component = () => <div className="PageComponent" />;
  const appProps = merge(
    {
      Component,
      asPath: "",
      ctx: {
        isServer: false,
        pathname: "",
        query: {},
        req: {
          intlMessages: {},
          locale: "en-NZ"
        },
        res: {}
      },
      router: {
        pathname: ""
      }
    },
    fromTestProps
  );
  const initialProps = await App.getInitialProps(appProps);
  const props = {
    ...appProps,
    ...initialProps
  };

  return {
    actual: fn(<App {...props} />),
    props
  };
};

const g: any = global;
const actualServiceWorker = navigator.serviceWorker;

describe("[containers] <App />", () => {
  beforeEach(() => {
    g.isServer = false;
    g.__NEXT_DATA__ = {
      props: {
        initialProps: {
          intlProps: {}
        }
      }
    };
  });

  afterEach(() => {
    g.__NEXT_DATA__ = undefined;
  });

  it("mounts application correctly on the server", async () => {
    g.isServer = true;
    let isPassing = true;

    try {
      const { actual } = await setup(mount, {
        ctx: { isServer: g.isServer }
      });

      expect(actual.render()).toMatchSnapshot();
      actual.unmount();
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  it("mounts application correctly on the client", async () => {
    let isPassing = true;

    try {
      const { actual } = await setup(mount);

      expect(actual.render()).toMatchSnapshot();
      actual.unmount();
    } catch (error) {
      isPassing = false;
    }

    expect(isPassing).toBe(true);
  });

  it("gets `initialProps` from component correctly", async () => {
    const test = "Test";
    const Component: any = () => <div className="PageComponent" />;
    Component.getInitialProps = async () => ({ test });
    const { props } = await setup(mount, { Component });

    expect(props.initialProps.pageProps).toEqual({ test });
  });

  describe("router events", async () => {
    it("onRouteChangeStart is handled correctly", async () => {
      const { props } = await setup(mount);

      routes.Router.onRouteChangeStart("/");

      expect(props.store.getState().page.transitioningTo).toBe("/");
    });

    it("onRouteChangeComplete is handled correctly", async () => {
      const { props } = await setup(mount);

      routes.Router.onRouteChangeComplete("/");

      expect(props.store.getState().page.transitioningTo).toBeUndefined();
      expect(props.store.getState().page.currentRoute).toBe("/");
    });

    it("onRouteChangeStart is handled correctly", async () => {
      const { props } = await setup(mount);

      routes.Router.onRouteChangeError(new Error("Server error"), "/");

      expect(props.store.getState().page.transitioningTo).toBeUndefined();
      expect(props.store.getState().page.error).toEqual({
        message: "Error: Server error",
        status: 500
      });
    });
  });

  describe("service worker", () => {
    const addEventListener = g.addEventListener;
    const removeEventListener = g.removeEventListener;

    beforeAll(() => {
      g.addEventListener = jest.fn((...args) => addEventListener(...args));
      g.removeEventListener = jest.fn((...args) =>
        removeEventListener(...args)
      );

      Object.defineProperty(navigator, "serviceWorker", {
        value: {
          controller: {
            postMessage: jest.fn(),
            state: "activated"
          }
        },
        writable: true
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    afterAll(() => {
      g.addEventListener = addEventListener;
      g.removeEventListener = removeEventListener;

      Object.defineProperty(navigator, "serviceWorker", {
        value: actualServiceWorker,
        writable: true
      });
    });

    it("registers when browser support exists", async () => {
      const { actual } = await setup(mount);
      const { serviceWorkerContainer } = actual.find("App").instance();

      expect(serviceWorkerContainer).toBeDefined();
      expect(serviceWorkerContainer.register).toHaveBeenCalledWith({
        scope: "/"
      });

      actual.unmount();
    });

    it("updates online status correctly", async () => {
      const { actual, props } = await setup(mount);

      expect(g.findMockCall(g.addEventListener, "offline")).toBeDefined();
      expect(g.findMockCall(g.addEventListener, "online")).toBeDefined();

      g.dispatchEvent(new Event("offline"));
      expect(props.store.getState().page.isOnline).toBe(false);

      g.dispatchEvent(new Event("online"));
      expect(props.store.getState().page.isOnline).toBe(true);

      actual.unmount();
      expect(g.findMockCall(g.removeEventListener, "offline")).toBeDefined();
      expect(g.findMockCall(g.removeEventListener, "online")).toBeDefined();

      window.dispatchEvent(new Event("offline"));
      expect(props.store.getState().page.isOnline).toBe(true);
    });
  });
});
