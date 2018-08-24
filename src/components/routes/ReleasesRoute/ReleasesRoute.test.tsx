import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import ReleasesRoute from "./ReleasesRoute";

import releases from "../../../../server/mocks/releases.json";
import * as dom from "../../../helpers/dom";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(releases);

Object.defineProperty(dom, "isAlmostInViewport", {
  value: jest.fn(() => false)
});

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        releases: {
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
        <ReleasesRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <ReleasesRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render, {
      releases: {
        hasAllItems: true,
        items: arrayToAssoc(mockData.items, "slug")
      }
    });

    expect(actual).toMatchSnapshot();
  });

  it("renders no results correctly", () => {
    const { actual } = setup(render, {
      releases: {
        hasAllItems: true
      }
    });

    expect(actual.find(".NoResults")).toHaveLength(1);
  });

  it("renders with an error correctly", () => {
    const { actual } = setup(render, {
      releases: {
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
      releases: {
        hasAllItems: false
      }
    });

    expect(actual.find(".LoadButton")).toHaveLength(1);
  });

  it("renders without 'load more' button when hasAllItems=true", () => {
    const { actual } = setup(render, {
      releases: {
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
        fetchReleases: () => ({
          data: {
            items: [mockData.items[0]]
          },
          ok: true
        })
      }
    );

    expect(actual.find("ReleaseListing")).toHaveLength(0);
    actual.find("LoadButton").simulate("click");
    expect(actual.find("ReleaseListing")).toHaveLength(1);
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { actual } = setup(mount, {
      releases: {
        items: { "test-1": mockData.items[0] }
      }
    });

    actual.find("ReleaseListing img").simulate("load");

    expect(actual.find(".hasLoadedAllListings")).toHaveLength(1);
  });

  describe("getInitialProps()", () => {
    const items = [mockData.items[0]];

    it("fetches items when rendering on the server", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchReleases: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await ReleasesRoute.getInitialProps({
        ctx: {
          isServer: true,
          store
        }
      });

      expect(selectors.getReleasesAsArray(store.getState())).toEqual(items);
    });

    it("fetches items when the store is empty", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchReleases: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await ReleasesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getReleasesAsArray(store.getState())).toEqual(items);
    });

    it("fetches more items when there are more to fetch", async () => {
      const { store } = setup(
        render,
        {
          releases: {
            items: {
              "test-1": items[0]
            }
          }
        },
        {
          fetchReleases: () => ({
            data: {
              items: [{ slug: "test-2" }]
            },
            ok: true
          })
        }
      );

      expect(selectors.getReleasesCount(store.getState())).toBe(1);

      await ReleasesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getReleasesCount(store.getState())).toBe(2);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      const { store } = setup(render, {
        releases: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        }
      });

      await ReleasesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getReleasesAsArray(store.getState())).toEqual(items);
    });
  });
});
