import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";

describe("[sagas] Features", () => {
  describe("takeLatest(actions.addFeature)", () => {
    it("call(window.features.push)", async () => {
      const feature = "test-feature-1";
      window.features = [];
      const { dispatch } = setupSagas({
        features: {
          items: []
        }
      });

      dispatch(actions.addFeature(feature));
      expect(window.features).toEqual([feature]);

      dispatch(actions.addFeature(feature));
      expect(window.features).toEqual([feature]);
    });
  });

  describe("takeLatest(actions.addFeatures)", () => {
    it("call(window.features.push)", async () => {
      const features = ["test-feature-1", "test-feature-2"];
      window.features = [];
      const { dispatch } = setupSagas({
        features: {
          items: []
        }
      });

      dispatch(actions.addFeatures(features));
      expect(window.features).toEqual(features);

      dispatch(actions.addFeatures(features));
      expect(window.features).toEqual(features);
    });
  });

  describe("takeLatest(actions.removeFeature)", () => {
    it("call(window.features.splice)", async () => {
      const feature = "test-feature-1";
      window.features = ["test-feature-1", "test-feature-2"];
      const { dispatch } = setupSagas({
        features: {
          items: []
        }
      });

      dispatch(actions.removeFeature(feature));
      expect(window.features).toEqual(["test-feature-2"]);
    });
  });

  describe("takeLatest(actions.removeFeatures)", () => {
    it("call(window.features.splice)", async () => {
      const features = ["test-feature-1", "test-feature-2"];
      window.features = ["test-feature-1", "test-feature-2", "test-feature-3"];
      const { dispatch } = setupSagas({
        features: {
          items: []
        }
      });

      dispatch(actions.removeFeatures(features));
      expect(window.features).toEqual(["test-feature-3"]);
    });
  });
});
