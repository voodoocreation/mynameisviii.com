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

describe("[connected] <App />", () => {
  const addEventListener = g.addEventListener;
  const removeEventListener = g.removeEventListener;

  beforeAll(() => {
    g.addEventListener = jest.fn((...args) => addEventListener(...args));
    g.removeEventListener = jest.fn((...args) => removeEventListener(...args));
  });

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
    jest.clearAllMocks();
  });

  afterAll(() => {
    g.addEventListener = addEventListener;
    g.removeEventListener = removeEventListener;
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
    const { actual, props } = await setup(mount, { Component });

    expect(props.initialProps.pageProps).toEqual({ test });

    actual.unmount();
  });

  describe("feature events", () => {
    it("handles single feature correctly", async () => {
      const { actual, props } = await setup(mount);

      window.dispatchEvent(
        new CustomEvent("feature", { detail: "has-test-feature" })
      );

      expect(props.store.getState().features.items).toContain(
        "has-test-feature"
      );

      actual.unmount();
    });

    it("handles multiple features correctly", async () => {
      const { actual, props } = await setup(mount);

      window.dispatchEvent(
        new CustomEvent("feature", {
          detail: ["has-test-feature-1", "has-test-feature-2"]
        })
      );

      expect(props.store.getState().features.items).toContain(
        "has-test-feature-1"
      );
      expect(props.store.getState().features.items).toContain(
        "has-test-feature-2"
      );

      actual.unmount();
    });
  });

  describe("router events", () => {
    it("onRouteChangeStart is handled correctly", async () => {
      const { actual, props } = await setup(mount);

      routes.Router.onRouteChangeStart("/");

      expect(props.store.getState().page.transitioningTo).toBe("/");

      actual.unmount();
    });

    it("onRouteChangeComplete is handled correctly", async () => {
      const { actual, props } = await setup(mount);

      routes.Router.onRouteChangeComplete("/");

      expect(props.store.getState().page.transitioningTo).toBeUndefined();
      expect(props.store.getState().page.currentRoute).toBe("/");

      actual.unmount();
    });

    it("onRouteChangeStart is handled correctly", async () => {
      const { actual, props } = await setup(mount);

      routes.Router.onRouteChangeError(new Error("Server error"), "/");

      expect(props.store.getState().page.transitioningTo).toBeUndefined();
      expect(props.store.getState().page.error).toEqual({
        message: "Error: Server error",
        status: 500
      });

      actual.unmount();
    });
  });

  describe("beforeinstallprompt event", () => {
    it("handles dismissed outcome correctly", async () => {
      let isPassing = true;

      try {
        const { actual } = await setup(mount);

        const event: any = new Event("beforeinstallprompt");
        event.userChoice = new Promise(resolve =>
          resolve({ outcome: "dismissed" })
        );
        await window.dispatchEvent(event);

        actual.unmount();
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
    });

    it("handles accepted outcome correctly", async () => {
      let isPassing = true;

      try {
        const { actual } = await setup(mount);

        const event: any = new Event("beforeinstallprompt");
        event.userChoice = new Promise(resolve =>
          resolve({ outcome: "accepted" })
        );
        await window.dispatchEvent(event);

        actual.unmount();
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
    });
  });

  describe("service worker", () => {
    it("registers when browser support exists", async () => {
      const { actual } = await setup(mount);
      const { serviceWorkerContainer } = actual
        .childAt(0)
        .childAt(0)
        .instance();

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

    it("receives messages from service worker correctly", async () => {
      const { actual, props } = await setup(mount);

      expect(
        g.findMockCall(navigator.serviceWorker.addEventListener, "message")
      ).toBeDefined();

      const event = new MessageEvent("message", {
        data: { type: "serviceWorker.activate" }
      });
      navigator.serviceWorker.dispatchEvent(event);
      expect(props.store.getState().page.hasNewVersion).toBe(true);

      actual.unmount();
      expect(
        g.findMockCall(navigator.serviceWorker.removeEventListener, "message")
      ).toBeDefined();

      navigator.serviceWorker.dispatchEvent(event);
      expect(props.store.getState().page.hasNewVersion).toBe(true);
    });
  });
});
