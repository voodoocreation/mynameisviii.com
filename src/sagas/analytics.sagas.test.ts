import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";

describe("[sagas] Analytics", () => {
  describe("takeLatest(actions.trackEvent)", () => {
    describe("when tracking custom events", () => {
      const event = { event: "test.event", value: "test" };
      const dataLayer: any = [];

      dataLayer.push = jest.fn();
      const { dispatch } = setupSagas({}, { dataLayer });

      it("dispatches actions.trackEvent", () => {
        dispatch(actions.trackEvent(event));
      });

      it("pushes event payload to dataLayer", () => {
        expect(dataLayer.push).toBeCalled();
        expect(dataLayer.push.mock.calls[0][0]).toEqual(event);
      });
    });
  });
});
