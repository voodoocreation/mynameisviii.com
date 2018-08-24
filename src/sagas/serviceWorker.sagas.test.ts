import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";

const actualServiceWorker = navigator.serviceWorker;

describe("[sagas] Service worker", () => {
  describe("takeLatest(actions.changeRoute.done)", () => {
    afterAll(() => {
      Object.defineProperty(navigator, "serviceWorker", {
        value: actualServiceWorker,
        writable: true
      });
    });

    it("call(serviceWorker.postMessage) when service worker is available", async () => {
      const newRoute = "/test";
      Object.defineProperty(navigator, "serviceWorker", {
        value: {
          controller: {
            postMessage: jest.fn(),
            state: "activated"
          }
        },
        writable: true
      });
      const { dispatch } = setupSagas();
      const serviceWorker = navigator.serviceWorker.controller as ServiceWorker;

      dispatch(actions.changeRoute.done({ params: newRoute }));

      expect(serviceWorker.postMessage).toHaveBeenCalledWith({
        payload: newRoute,
        type: "changeRoute"
      });
    });

    it("doesn't attempt to call(serviceWorker.postMessage) when service worker isn't ready", async () => {
      const newRoute = "/test";
      Object.defineProperty(navigator, "serviceWorker", {
        value: {
          controller: {
            postMessage: jest.fn(),
            state: "installing"
          }
        },
        writable: true
      });
      const { dispatch } = setupSagas();
      const serviceWorker = navigator.serviceWorker.controller as ServiceWorker;

      let isPassing = true;
      try {
        dispatch(actions.changeRoute.done({ params: newRoute }));
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
      expect(serviceWorker.postMessage).not.toHaveBeenCalled();
    });

    it("doesn't throw an error when service worker doesn't exist", async () => {
      Object.defineProperty(navigator, "serviceWorker", {
        value: {
          controller: null
        },
        writable: true
      });
      const { dispatch } = setupSagas();

      let isPassing = true;
      try {
        dispatch(actions.changeRoute.done({ params: "/test" }));
      } catch (error) {
        isPassing = false;
      }

      expect(isPassing).toBe(true);
    });
  });
});
