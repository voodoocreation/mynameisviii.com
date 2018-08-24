import { camelizeKeys } from "humps";

import appearances from "../../server/mocks/appearances.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./appearances.reducers";

import * as actions from "../actions/root.actions";

const mockData: any = camelizeKeys(appearances);

describe("[reducers] Appearances", () => {
  describe("actions.fetchAppearances", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchAppearances.started({}));

      expect(state.isLoading).toBe(true);
      expect(Object.keys(state.items)).toHaveLength(0);
    });

    it("done is handled", () => {
      const result = {
        ...mockData,
        items: arrayToAssoc(mockData.items, "slug")
      };
      const state = reducer(
        model,
        actions.fetchAppearances.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchAppearances.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreAppearances", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockData.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(
        initialState,
        actions.fetchMoreAppearances.started({})
      );

      expect(state.isLoading).toBe(true);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("done is handled", () => {
      const result = {
        ...mockData,
        items: arrayToAssoc(mockData.items, "slug")
      };
      const state = reducer(
        model,
        actions.fetchMoreAppearances.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreAppearances.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchAppearanceBySlug", () => {
    const params = "test-1";

    it("started is handled", () => {
      const state = reducer(
        model,
        actions.fetchAppearanceBySlug.started(params)
      );

      expect(state.isLoading).toBe(true);
    });

    it("done is handled", () => {
      const result = mockData.items[0];
      const state = reducer(
        model,
        actions.fetchAppearanceBySlug.done({ result, params })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("failed is handled", () => {
      const error = { message: "Not found", status: 404 };
      const state = reducer(
        model,
        actions.fetchAppearanceBySlug.failed({ error, params })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  it("actions.setCurrentAppearanceSlug is handled", () => {
    const state = reducer(model, actions.setCurrentAppearanceSlug("test-1"));

    expect(state.currentSlug).toEqual("test-1");
  });
});
