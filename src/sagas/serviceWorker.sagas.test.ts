import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";

describe("[sagas] Service worker", () => {
  describe("takeLatest(actions.changeRoute.done)", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("call(serviceWorker.postMessage) when service worker is available", async () => {
      const serviceWorker = navigator.serviceWorker.controller as ServiceWorker;
      const newRoute = "/test";

      const { dispatch } = setupSagas();

      dispatch(actions.changeRoute.done({ params: newRoute }));

      expect(serviceWorker.postMessage).toHaveBeenCalledWith({
        payload: newRoute,
        type: "changeRoute"
      });
    });

    it("doesn't attempt to call(serviceWorker.postMessage) when service worker isn't ready", async () => {
      const newRoute = "/test";
      const serviceWorker = navigator.serviceWorker.controller as ServiceWorker;

      // @ts-ignore-next-line
      serviceWorker.state = "installing";

      const { dispatch } = setupSagas();

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
      // @ts-ignore-next-line
      navigator.serviceWorker = undefined;

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
