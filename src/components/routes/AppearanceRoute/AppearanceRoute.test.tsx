import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import AppearanceRoute from "./AppearanceRoute";

import appearances from "../../../../server/mocks/appearances.json";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(appearances);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        appearances: {
          currentSlug: mockData.items[0].slug,
          items: arrayToAssoc(mockData.items, "slug")
        }
      },
      fromTestStore
    ),
    fromTestApi
  );

  return {
    actual: fn(
      <Provider store={store}>
        <AppearanceRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <AppearanceRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders 404 error page when no appearance exists", () => {
    const { actual } = setup(mount, {
      appearances: {
        currentSlug: "test-1"
      },
      page: {
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
      appearances: {
        currentSlug: null
      }
    });

    const ErrorPage = actual.find("ErrorPage");

    expect(ErrorPage).toHaveLength(1);
    expect(ErrorPage.prop("status")).toBe(500);
    expect(actual.render()).toMatchSnapshot();
  });

  it("tracks gallery interactions correctly", () => {
    const { actual } = setup(mount);

    actual
      .find("Gallery Image")
      .last()
      .simulate("click");

    expect(window.dataLayer[0].event).toBe("appearance.gallery.itemClick");
    expect(window.dataLayer[0].index).toBe(3);
  });

  describe("getInitialProps()", () => {
    it("sets `currentSlug` from URL", async () => {
      const { store } = setup(render);

      await AppearanceRoute.getInitialProps({
        ctx: {
          query: { slug: "test-1" },
          store
        }
      });

      expect(selectors.getCurrentAppearanceSlug(store.getState())).toBe(
        "test-1"
      );
    });

    it("fetches appearance when it's not already in the store", async () => {
      const { store } = setup(
        render,
        {
          appearances: {
            items: {}
          }
        },
        {
          fetchAppearanceBySlug: (slug: string) =>
            mockData.find((item: any) => item.slug === slug)
        }
      );

      await AppearanceRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getCurrentAppearance(store.getState())).toBeDefined();
    });

    it("doesn't fetch appearance when it's already in the store", async () => {
      const { store } = setup(render);

      const itemCountBeforeRender = selectors.getAppearancesCount(
        store.getState()
      );

      await AppearanceRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getAppearancesCount(store.getState())).toBe(
        itemCountBeforeRender
      );
    });
  });
});
