import { camelizeKeys } from "humps";

import stems from "../../server/mocks/stems.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./stems.reducers";

import * as actions from "../actions/root.actions";

const mockData: any = camelizeKeys(stems);

describe("[reducers] Stems", () => {
  describe("actions.fetchStems", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchStems.started({}));

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
        actions.fetchStems.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchStems.failed({ error, params: {} })
      );

      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreStems", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockData.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(initialState, actions.fetchMoreStems.started({}));

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
        actions.fetchMoreStems.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreStems.failed({ error, params: {} })
      );

      expect(state.isLoading).toBe(false);
    });
  });
});
