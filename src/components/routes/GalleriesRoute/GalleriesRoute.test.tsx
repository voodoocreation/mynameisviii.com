import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import GalleriesRoute from "./GalleriesRoute";

import galleries from "../../../../server/mocks/galleries.json";
import * as dom from "../../../helpers/dom";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(galleries);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(fromTestStore, {}, fromTestApi);

  return {
    actual: fn(
      <Provider store={store}>
        <GalleriesRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <GalleriesRoute />", () => {
  beforeAll(() => {
    Object.defineProperty(dom, "isAlmostInViewport", {
      value: jest.fn(() => false)
    });
  });

  it("renders correctly", () => {
    const { actual } = setup(render, {
      galleries: {
        hasAllItems: true,
        items: arrayToAssoc(mockData.items, "slug")
      }
    });

    expect(actual).toMatchSnapshot();
  });

  it("renders no results correctly", () => {
    const { actual } = setup(render, {
      galleries: {
        hasAllItems: true
      }
    });

    expect(actual.find(".NoResults")).toHaveLength(1);
  });

  it("renders with an error correctly", () => {
    const { actual } = setup(render, {
      galleries: {
        error: {
          message: "Server error",
          status: 500
        }
      }
    });

    expect(actual.find(".LoadButton").text()).toBe("Try again");
    expect(actual).toMatchSnapshot();
  });

  it("renders with 'load more' button when hasAllItems=false", () => {
    const { actual } = setup(render, {
      galleries: {
        hasAllItems: false
      }
    });

    expect(actual.find(".LoadButton")).toHaveLength(1);
  });

  it("renders without 'load more' button when hasAllItems=true", () => {
    const { actual } = setup(render, {
      galleries: {
        hasAllItems: true
      }
    });

    expect(actual.find(".LoadButton")).toHaveLength(0);
  });

  it("loads more listings when 'load more' button is activated", () => {
    const { actual } = setup(
      mount,
      {},
      {
        fetchGalleries: () => ({
          data: {
            items: [mockData.items[0]]
          },
          ok: true
        })
      }
    );

    expect(actual.find("GalleryListing")).toHaveLength(0);
    actual.find("LoadButton").simulate("click");
    expect(actual.find("GalleryListing")).toHaveLength(1);
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { actual } = setup(mount, {
      galleries: {
        items: { "test-1": mockData.items[0] }
      }
    });

    actual.find("GalleryListing img").simulate("load");

    expect(actual.find(".hasLoadedAllListings")).toHaveLength(1);
  });

  describe("getInitialProps()", () => {
    const items = [mockData.items[0]];

    it("fetches items when rendering on the server", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchGalleries: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await GalleriesRoute.getInitialProps({
        ctx: {
          isServer: true,
          store
        }
      });

      expect(selectors.getGalleriesAsArray(store.getState())).toEqual(items);
    });

    it("fetches items when the store is empty", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchGalleries: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await GalleriesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getGalleriesAsArray(store.getState())).toEqual(items);
    });

    it("fetches more items when there are more to fetch", async () => {
      const { store } = setup(
        render,
        {
          galleries: {
            items: {
              "test-1": items[0]
            }
          }
        },
        {
          fetchGalleries: () => ({
            data: {
              items: [{ slug: "test-2" }]
            },
            ok: true
          })
        }
      );

      expect(selectors.getGalleriesCount(store.getState())).toBe(1);

      await GalleriesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getGalleriesCount(store.getState())).toBe(2);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      const { store } = setup(render, {
        galleries: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        }
      });

      await GalleriesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getGalleriesAsArray(store.getState())).toEqual(items);
    });
  });
});
