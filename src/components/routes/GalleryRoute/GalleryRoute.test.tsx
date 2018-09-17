import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import GalleryRoute from "./GalleryRoute";

import gallery from "../../../../server/mocks/gallery.json";

const mockData: any = camelizeKeys(gallery);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        galleries: {
          currentSlug: mockData.slug,
          items: {
            [mockData.slug]: {
              description: mockData.description,
              modifiedAt: mockData.modifiedAt,
              slug: mockData.slug,
              title: mockData.title
            }
          }
        }
      },
      fromTestStore
    ),
    {},
    fromTestApi
  );

  return {
    actual: fn(
      <Provider store={store}>
        <GalleryRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <GalleryRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders a loader when item is being fetched", () => {
    const { actual } = setup(render, {
      galleries: { isLoading: true }
    });

    expect(actual.hasClass("PageLoader")).toBe(true);
    expect(actual).toMatchSnapshot();
  });

  it("renders 404 error page when no gallery exists", () => {
    const { actual } = setup(mount, {
      galleries: {
        currentSlug: "test-1",
        error: {
          message: "Not found",
          status: 404
        }
      }
    });

    const ErrorPage = actual.find("ErrorPage");

    expect(ErrorPage).toHaveLength(1);
    expect(ErrorPage.prop("status")).toBe(404);
    expect(actual.render()).toMatchSnapshot();
  });

  it("renders 500 error page when slug isn't in the store", () => {
    const { actual } = setup(mount, {
      galleries: {
        currentSlug: null
      }
    });

    const ErrorPage = actual.find("ErrorPage");

    expect(ErrorPage).toHaveLength(1);
    expect(ErrorPage.prop("status")).toBe(500);
    expect(actual.render()).toMatchSnapshot();
  });

  describe("getInitialProps()", () => {
    it("sets `currentSlug` from URL", async () => {
      const { store } = setup(render);

      await GalleryRoute.getInitialProps({
        ctx: {
          query: { slug: "test-1" },
          store
        }
      });

      expect(selectors.getCurrentGallerySlug(store.getState())).toBe("test-1");
    });

    it("fetches gallery when it's not already in the store", async () => {
      const { store } = setup(
        render,
        {
          galleries: {
            items: {}
          }
        },
        {
          fetchGalleryBySlug: () => ({
            data: mockData,
            ok: true
          })
        }
      );

      await GalleryRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.slug },
          store
        }
      });

      expect(selectors.getCurrentGallery(store.getState())).toBeDefined();
      expect(selectors.getCurrentGalleryImages(store.getState())).toBeDefined();
    });

    it("fetches full gallery when only the listing data is in the store", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchGalleryBySlug: () => ({
            data: mockData,
            ok: true
          })
        }
      );

      expect(
        selectors.getCurrentGalleryImages(store.getState())
      ).toBeUndefined();

      await GalleryRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.slug },
          store
        }
      });

      expect(selectors.getCurrentGallery(store.getState())).toBeDefined();
      expect(selectors.getCurrentGalleryImages(store.getState())).toBeDefined();
    });

    it("doesn't fetch gallery when it's already in the store", async () => {
      const { store } = setup(render, {
        galleries: {
          items: {
            [mockData.slug]: mockData
          }
        }
      });

      const itemCountBeforeRender = selectors.getGalleriesCount(
        store.getState()
      );

      await GalleryRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.slug },
          store
        }
      });

      expect(selectors.getGalleriesCount(store.getState())).toBe(
        itemCountBeforeRender
      );
    });
  });
});
