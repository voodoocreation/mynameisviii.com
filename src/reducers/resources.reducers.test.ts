import { camelizeKeys } from "humps";

import resources from "../../server/mocks/resources.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./resources.reducers";

import * as actions from "../actions/root.actions";

const mockData: any = camelizeKeys(resources);

describe("[reducers] Resources", () => {
  describe("actions.fetchResources", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchResources.started({}));

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
        actions.fetchResources.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchResources.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreResources", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockData.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(
        initialState,
        actions.fetchMoreResources.started({})
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
        actions.fetchMoreResources.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreResources.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });
});
