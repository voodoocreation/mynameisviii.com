import { camelizeKeys } from "humps";

import galleries from "../../server/mocks/galleries.json";
import gallery from "../../server/mocks/gallery.json";
import { arrayToAssoc } from "../transformers/transformData";
import reducer, { initialState as model } from "./galleries.reducers";

import * as actions from "../actions/root.actions";

const mockGalleries: any = camelizeKeys(galleries);
const mockGallery: any = camelizeKeys(gallery);

describe("[reducers] Galleries", () => {
  describe("actions.fetchGalleries", () => {
    it("started is handled", () => {
      const state = reducer(model, actions.fetchGalleries.started({}));

      expect(state.isLoading).toBe(true);
      expect(Object.keys(state.items)).toHaveLength(0);
    });

    it("done is handled", () => {
      const result = {
        ...mockGalleries,
        items: arrayToAssoc(mockGalleries.items, "slug")
      };
      const state = reducer(
        model,
        actions.fetchGalleries.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockGalleries.items.length);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchGalleries.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchMoreGalleries", () => {
    const initialState = {
      ...model,
      items: {
        "test-1": mockGalleries.items[0]
      }
    };

    it("started is handled", () => {
      const state = reducer(
        initialState,
        actions.fetchMoreGalleries.started({})
      );

      expect(state.isLoading).toBe(true);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("done is handled", () => {
      const result = {
        ...mockGalleries,
        items: arrayToAssoc(mockGalleries.items, "slug")
      };
      const state = reducer(
        model,
        actions.fetchMoreGalleries.done({ result, params: {} })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(mockGalleries.items.length);
    });

    it("failed is handled", () => {
      const error = { message: "Error", status: 500 };
      const state = reducer(
        model,
        actions.fetchMoreGalleries.failed({ error, params: {} })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  describe("actions.fetchGalleryBySlug", () => {
    const params = "test-1";

    it("started is handled", () => {
      const state = reducer(model, actions.fetchGalleryBySlug.started(params));

      expect(state.isLoading).toBe(true);
    });

    it("done is handled", () => {
      const state = reducer(
        model,
        actions.fetchGalleryBySlug.done({ result: mockGallery, params })
      );

      expect(state.isLoading).toBe(false);
      expect(Object.keys(state.items)).toHaveLength(1);
    });

    it("failed is handled", () => {
      const error = { message: "Not found", status: 404 };
      const state = reducer(
        model,
        actions.fetchGalleryBySlug.failed({ error, params })
      );

      expect(state.error).toEqual(error);
      expect(state.isLoading).toBe(false);
    });
  });

  it("actions.setCurrentGallerySlug is handled", () => {
    const state = reducer(model, actions.setCurrentGallerySlug("test-1"));

    expect(state.currentSlug).toEqual("test-1");
  });
});
