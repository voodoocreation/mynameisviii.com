import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";

describe("[sagas] Analytics", () => {
  describe("takeLatest(actions.trackEvent)", () => {
    it("call(dataLayer.push)", async () => {
      const event = { event: "test.event", value: "test" };
      const dataLayer: any = [];
      dataLayer.push = jest.fn();
      const { dispatch } = setupSagas({}, { dataLayer });

      dispatch(actions.trackEvent(event));

      expect(dataLayer.push).toBeCalled();
      expect(dataLayer.push.mock.calls[0][0]).toEqual(event);
    });
  });
});
