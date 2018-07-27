import { render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import IndexRoute from "./IndexRoute";

import news from "../../../../server/mocks/news.json";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(news);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        news: {
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
        <IndexRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <Index />", () => {
  it("renders correctly with news results", () => {
    const { actual } = setup(render, {
      news: {
        hasAllItems: true,
        items: arrayToAssoc(mockData.items, "slug")
      }
    });

    expect(actual.find(".Home-news")).toHaveLength(1);
    expect(actual).toMatchSnapshot();
  });

  it("renders correctly with no news results", () => {
    const { actual } = setup(render, {
      news: {
        hasAllItems: true
      }
    });

    expect(actual.find(".Home-news")).toHaveLength(0);
    expect(actual).toMatchSnapshot();
  });

  describe("getInitialProps()", () => {
    const items = [mockData.items[0]];

    it("fetches latest news when rendering on the server", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchLatestNews: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await IndexRoute.getInitialProps({
        ctx: {
          isServer: true,
          store
        }
      });

      expect(selectors.getNewsArticlesAsArray(store.getState())).toEqual(items);
    });

    it("fetches latest news when store is empty", async () => {
      const { store } = setup(
        render,
        {},
        {
          fetchLatestNews: () => ({
            data: { items },
            ok: true
          })
        }
      );

      await IndexRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getNewsArticlesAsArray(store.getState())).toEqual(items);
    });

    it("doesn't fetch latest news when all news is in store", async () => {
      const { store } = setup(render, {
        news: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        }
      });

      await IndexRoute.getInitialProps({
        ctx: {
          isServer: false,
          store
        }
      });

      expect(selectors.getNewsArticlesAsArray(store.getState())).toEqual(items);
    });
  });
});
