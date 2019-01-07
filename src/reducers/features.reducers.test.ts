import reducer, { initialState as model } from "./features.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Features", () => {
  it("actions.addFeatures is handled", () => {
    const feature1 = "test-feature-1";
    const feature2 = "test-feature-2";
    const feature3 = "test-feature-3";

    const state = reducer(model, actions.addFeatures(feature1));
    expect(state.items).toEqual([feature1]);

    const state2 = reducer(state, actions.addFeatures(feature1));
    expect(state2.items).toEqual([feature1]);

    const state3 = reducer(state, actions.addFeatures([feature2, feature3]));
    expect(state3.items).toEqual([feature1, feature2, feature3]);
  });

  it("actions.removeFeatures is handled", () => {
    const feature1 = "test-feature-1";
    const feature2 = "test-feature-2";
    const feature3 = "test-feature-3";

    const state = reducer(
      { items: [feature1, feature2, feature3] },
      actions.removeFeatures(feature1)
    );
    expect(state.items).toEqual([feature2, feature3]);

    const state2 = reducer(state, actions.removeFeatures(feature1));
    expect(state2.items).toEqual([feature2, feature3]);

    const state3 = reducer(
      state2,
      actions.removeFeatures([feature2, feature3])
    );
    expect(state3.items).toEqual([]);
  });
});
