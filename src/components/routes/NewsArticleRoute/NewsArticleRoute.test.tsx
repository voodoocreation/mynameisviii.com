import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import NewsArticleRoute from "./NewsArticleRoute";

import news from "../../../../server/mocks/news.json";
import { arrayToAssoc } from "../../../transformers/transformData";
import AppearanceRoute from "../AppearanceRoute/AppearanceRoute";

const mockData: any = camelizeKeys(news);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        news: {
          currentSlug: mockData.items[0].slug,
          items: arrayToAssoc(mockData.items, "slug")
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
        <NewsArticleRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <NewsArticleRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders 404 error page when no news article exists", () => {
    const { actual } = setup(mount, {
      news: {
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
      news: {
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

      await NewsArticleRoute.getInitialProps({
        ctx: {
          query: { slug: "test-1" },
          store
        }
      });

      expect(selectors.getCurrentNewsArticleSlug(store.getState())).toBe(
        "test-1"
      );
    });

    it("fetches news article when it's not already in the store", async () => {
      const { store } = setup(
        render,
        {
          news: {
            items: {}
          }
        },
        {
          fetchNewsArticleBySlug: (slug: string) =>
            mockData.find((item: any) => item.slug === slug)
        }
      );

      await NewsArticleRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getCurrentNewsArticle(store.getState())).toBeDefined();
    });

    it("doesn't fetch news article when it's already in the store", async () => {
      const { store } = setup(render);

      const itemCountBeforeRender = selectors.getNewsArticlesCount(
        store.getState()
      );

      await AppearanceRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getNewsArticlesCount(store.getState())).toBe(
        itemCountBeforeRender
      );
    });
  });
});
