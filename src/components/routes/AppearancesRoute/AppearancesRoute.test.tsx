import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import AppearancesRoute from "./AppearancesRoute";

import appearances from "../../../../server/mocks/appearances.json";
import * as dom from "../../../helpers/dom";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(appearances);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(fromTestStore, {}, fromTestApi);

  return {
    actual: fn(
      <Provider store={store}>
        <AppearancesRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <AppearancesRoute />", () => {
  beforeAll(() => {
    Object.defineProperty(dom, "isAlmostInViewport", {
      value: jest.fn(() => false)
    });
  });

  it("renders correctly", () => {
    const { actual } = setup(render, {
      appearances: {
        hasAllItems: true,
        items: arrayToAssoc(mockData.items, "slug")
      }
    });

    expect(actual).toMatchSnapshot();
  });

  it("renders upcoming appearances correctly", () => {
    const { actual } = setup(render, {
      appearances: {
        hasAllItems: true,
        items: {
          "test-1": {
            ...mockData.items[0],
            finishingAt: "2020-01-01T00:00:00"
          }
        }
      }
    });

    expect(actual.find(".AppearanceListings-upcoming")).toHaveLength(1);
  });

  it("renders past appearances correctly", () => {
    const { actual } = setup(render, {
      appearances: {
        hasAllItems: true,
        items: {
          "test-1": {
            ...mockData.items[0],
            finishingAt: "2000-01-01T00:00:00"
          }
        }
      }
    });

    expect(actual.find(".AppearanceListings-past")).toHaveLength(1);
  });

  it("renders no results correctly", () => {
    const { actual } = setup(render, {
      appearances: {
        hasAllItems: true
      }
    });

    expect(actual.find(".NoResults")).toHaveLength(1);
  });

  it("renders with an error correctly", () => {
    const { actual } = setup(render, {
      appearances: {
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
      appearances: {
        hasAllItems: false
      }
    });

    expect(actual.find(".LoadButton")).toHaveLength(1);
  });

  it("renders without 'load more' button when hasAllItems=true", () => {
    const { actual } = setup(render, {
      appearances: {
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
        fetchAppearances: () => ({
          data: {
            items: [mockData.items[0]]
          },
          ok: true
        })
      }
    );

    expect(actual.find("AppearanceListing")).toHaveLength(0);
    actual.find("LoadButton").simulate("click");
    expect(actual.find("AppearanceListing")).toHaveLength(1);
  });

  it("updates `loadedListings` state after a listing has loaded", () => {
    const { actual } = setup(mount, {
      appearances: {
        items: { "test-1": mockData.items[0] }
      }
    });

    actual.find("AppearanceListing img").simulate("load");

    expect(actual.find(".hasLoadedAllListings")).toHaveLength(1);
  });

  describe("getInitialProps()", () => {
    const items = [mockData.items[0]];

    it("fetches items when rendering on the server", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchAppearances: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await AppearancesRoute.getInitialProps({
        ctx: {
          isServer: true,
          store
        }
      });

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });

    it("fetches items when the store is empty", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchAppearances: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await AppearancesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });

    it("fetches more items when there are more to fetch", async () => {
      const { store } = setup(
        render,
        {
          appearances: {
            items: {
              "test-1": items[0]
            }
          }
        },
        {
          fetchAppearances: () => ({
            data: {
              items: [{ slug: "test-2" }]
            },
            ok: true
          })
        }
      );

      expect(selectors.getAppearancesCount(store.getState())).toBe(1);

      await AppearancesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getAppearancesCount(store.getState())).toBe(2);
    });

    it("doesn't fetch anything when all items are in the store", async () => {
      const { store } = setup(render, {
        appearances: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        }
      });

      await AppearancesRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });
  });
});
