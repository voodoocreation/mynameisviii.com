import { camelizeKeys } from "humps";

import news from "../../server/mocks/news.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./news.reducers";

import * as actions from "../actions/root.actions";

const mockData: any = camelizeKeys(news);

describe("[reducers] News", () => {
  describe("actions.fetchLatestNews", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchLatestNews.started({}));

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
        actions.fetchLatestNews.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchLatestNews.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreLatestNews", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockData.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(
        initialState,
        actions.fetchMoreLatestNews.started({})
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
        actions.fetchMoreLatestNews.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockData.count);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreLatestNews.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchNewsArticleBySlug", () => {
    const params = "test-1";

    it("started is handled", () => {
      const state = reducer(
        model,
        actions.fetchNewsArticleBySlug.started(params)
      );

      expect(state.isLoading).toBe(true);
    });

    it("done is handled", () => {
      const result = mockData.items[0];
      const state = reducer(
        model,
        actions.fetchNewsArticleBySlug.done({ result, params })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("failed is handled", () => {
      const error = { message: "Not found", status: 404 };
      const state = reducer(
        model,
        actions.fetchNewsArticleBySlug.failed({ error, params })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  it("actions.setCurrentNewsArticleSlug is handled", () => {
    const state = reducer(model, actions.setCurrentNewsArticleSlug("test-1"));

    expect(state.currentSlug).toEqual("test-1");
  });
});
