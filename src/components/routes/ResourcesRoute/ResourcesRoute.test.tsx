import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import ResourcesRoute from "./ResourcesRoute";

import resources from "../../../../server/mocks/resources.json";
import * as dom from "../../../helpers/dom";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(resources);

Object.defineProperty(dom, "isAlmostInViewport", {
  value: jest.fn(() => false)
});

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        resources: {
          items: {}
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
        <ResourcesRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <ResourcesRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render, {
      resources: {
        hasAllItems: true,
        items: arrayToAssoc(mockData.items, "slug")
      }
    });

    expect(actual).toMatchSnapshot();
  });

  it("renders no results correctly", () => {
    const { actual } = setup(render, {
      resources: {
        hasAllItems: true
      }
    });

    expect(actual.find(".NoResults")).toHaveLength(1);
  });

  it("renders with an error correctly", () => {
    const { actual } = setup(render, {
      resources: {
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
      resources: {
        hasAllItems: false
      }
    });

    expect(actual.find(".LoadButton")).toHaveLength(1);
  });

  it("renders without 'load more' button when hasAllItems=true", () => {
    const { actual } = setup(render, {
      resources: {
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
        fetchResources: () => ({
          data: {
            items: [mockData.items[0]]
          },
          ok: true
        })
      }
    );

    expect(actual.find("ResourceListing")).toHaveLength(0);
    actual.find("LoadButton").simulate("click");
    expect(actual.find("ResourceListing")).toHaveLength(1);
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { actual } = setup(mount, {
      resources: {
        items: { "test-1": mockData.items[0] }
      }
    });

    actual.find("ResourceListing img").simulate("load");

    expect(actual.find(".hasLoadedAllListings")).toHaveLength(1);
  });

  describe("getInitialProps()", () => {
    const items = [mockData.items[0]];

    it("fetches items when rendering on the server", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchResources: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await ResourcesRoute.getInitialProps({
        ctx: {
          isServer: true,
          store
        }
      });

      expect(selectors.getResourcesAsArray(store.getState())).toEqual(items);
    });

    it("fetches items when the store is empty", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchResources: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await ResourcesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getResourcesAsArray(store.getState())).toEqual(items);
    });

    it("fetches more items when there are more to fetch", async () => {
      const { store } = setup(
        render,
        {
          resources: {
            items: {
              "test-1": items[0]
            }
          }
        },
        {
          fetchResources: () => ({
            data: {
              items: [{ slug: "test-2" }]
            },
            ok: true
          })
        }
      );

      expect(selectors.getResourcesCount(store.getState())).toBe(1);

      await ResourcesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getResourcesCount(store.getState())).toBe(2);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      const { store } = setup(render, {
        resources: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        }
      });

      await ResourcesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getResourcesAsArray(store.getState())).toEqual(items);
    });
  });
});
