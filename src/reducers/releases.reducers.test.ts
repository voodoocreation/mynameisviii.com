import { camelizeKeys } from "humps";

import releases from "../../server/mocks/releases.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./releases.reducers";

import * as actions from "../actions/root.actions";

const mockData: any = camelizeKeys(releases);

describe("[reducers] Releases", () => {
  describe("actions.fetchReleases", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchReleases.started({}));

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
        actions.fetchReleases.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchReleases.failed({ error, params: {} })
      );

      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreReleases", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockData.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(
        initialState,
        actions.fetchMoreReleases.started({})
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
        actions.fetchMoreReleases.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreReleases.failed({ error, params: {} })
      );

      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchReleaseBySlug", () => {
    const params = "test-1";

    it("started is handled", () => {
      const state = reducer(model, actions.fetchReleaseBySlug.started(params));

      expect(state.isLoading).toBe(true);
    });

    it("done is handled", () => {
      const result = mockData.items[0];
      const state = reducer(
        model,
        actions.fetchReleaseBySlug.done({ result, params })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("failed is handled", () => {
      const error = { message: "Not found", status: 404 };
      const state = reducer(
        model,
        actions.fetchReleaseBySlug.failed({ error, params })
      );

      expect(state.isLoading).toBe(false);
    });
  });

  it("actions.setCurrentReleaseSlug is handled", () => {
    const state = reducer(model, actions.setCurrentReleaseSlug("test-1"));

    expect(state.currentSlug).toEqual("test-1");
  });
});
