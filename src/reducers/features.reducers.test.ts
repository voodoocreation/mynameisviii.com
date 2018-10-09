import reducer, { initialState as model } from "./features.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Features", () => {
  it("actions.addFeature is handled", () => {
    const feature = "has-test-feature";
    const state = reducer(model, actions.addFeature(feature));

    expect(state.items).toContain(feature);
    expect(state.items).toHaveLength(1);

    const state2 = reducer(state, actions.addFeature(feature));
    expect(state2.items).toHaveLength(1);
  });

  it("actions.addFeatures is handled", () => {
    const features = ["has-test-feature-1", "has-test-feature-2"];
    const state = reducer(model, actions.addFeatures(features));

    expect(state.items).toEqual(features);

    const state2 = reducer(state, actions.addFeatures(features));
    expect(state2.items).toEqual(features);
  });

  it("actions.removeFeature is handled", () => {
    const feature = "has-test-feature";
    const state = reducer({ items: [feature] }, actions.removeFeature(feature));

    expect(state.items).toHaveLength(0);
  });

  it("actions.removeFeatures is handled", () => {
    const features = ["has-test-feature-1", "has-test-feature-2"];
    const state = reducer(
      { items: features },
      actions.removeFeatures(features)
    );

    expect(state.items).toHaveLength(0);
  });
});
