import reducer, { initialState as model } from "./page.reducers";

import * as actions from "../actions/root.actions";

describe("[reducers] Page", () => {
  describe("actions.changeRoute", () => {
    it("started is handled", () => {
      const params = "/";

      const state = reducer(model, actions.changeRoute.started(params));

      expect(state.isLoading).toBe(true);
      expect(state.transitioningTo).toEqual(params);
    });

    it("done is handled", () => {
      const params = "/";

      const state = reducer(model, actions.changeRoute.done({ params }));

      expect(state.isLoading).toBe(false);
      expect(state.transitioningTo).toBeUndefined();
    });

    it("failed is handled", () => {
      const params = "/";
      const error = { message: "Error", status: 500 };

      const state = reducer(
        model,
        actions.changeRoute.failed({ error, params })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
      expect(state.transitioningTo).toBeUndefined();
    });
  });

  it("actions.toggleNavigation is handled", () => {
    const state1 = reducer(model, actions.toggleNavigation({}));
    const state2 = reducer(state1, actions.toggleNavigation({}));

    expect(state1.isNavOpen).toBe(true);
    expect(state2.isNavOpen).toEqual(false);
  });

  it("actions.fetchNewsArticleBySlug.failed is handled", () => {
    const params = "test-1";
    const error = { message: "Error", status: 500 };

    const state = reducer(
      model,
      actions.fetchNewsArticleBySlug.failed({ error, params })
    );

    expect(state.error).toEqual(error);
  });
});
