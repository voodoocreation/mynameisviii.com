import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as actions from "../../../actions/root.actions";
import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import IndexRoute from "./IndexRoute";

import appearances from "../../../../server/mocks/appearances.json";
import news from "../../../../server/mocks/news.json";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockAppearancesData: any = camelizeKeys(appearances);
const mockNewsData: any = camelizeKeys(news);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        appearances: {
          items: {}
        },
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

describe("[routes] <IndexRoute />", () => {
  describe("news section", () => {
    const items = [mockNewsData.items[0]];

    it("renders correctly with news results", () => {
      const { actual } = setup(render, {
        news: {
          hasAllItems: true,
          items: arrayToAssoc(mockNewsData.items, "slug")
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

    it("fetches latest news when the store is empty", async () => {
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

  describe("appearances section", () => {
    const items = [mockAppearancesData.items[0]];

    it("renders correctly with appearances", () => {
      const { actual } = setup(render, {
        appearances: {
          hasAllItems: true,
          items: arrayToAssoc(mockAppearancesData.items, "slug")
        },
        features: {
          items: ["has-appearances-section"]
        }
      });

      expect(actual.find(".Home-appearances")).toHaveLength(1);
      expect(actual).toMatchSnapshot();
    });

    it("renders correctly with no appearances", () => {
      const { actual } = setup(render, {
        appearances: {
          hasAllItems: true
        },
        features: {
          items: ["has-appearances-section"]
        }
      });

      expect(actual.find(".Home-appearances")).toHaveLength(0);
      expect(actual).toMatchSnapshot();
    });

    it("fetches appearances when the user has the feature and the store is empty", () => {
      const { store } = setup(
        mount,
        {
          appearances: {
            hasAllItems: false,
            items: {}
          },
          features: {
            items: ["has-appearances-section"]
          }
        },
        {
          fetchAppearances: () => ({
            data: { items },
            ok: true
          })
        }
      );

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });

    it("fetches appearances when the feature is enabled after initial mount and the store is empty", () => {
      const { store } = setup(
        mount,
        {
          appearances: {
            hasAllItems: false,
            items: {}
          },
          features: {
            items: []
          }
        },
        {
          fetchAppearances: () => ({
            data: { items },
            ok: true
          })
        }
      );

      store.dispatch(actions.addFeature("has-appearances-section"));

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });

    it("doesn't fetch appearances when the user has the feature and all appearances are in the store", () => {
      const { store } = setup(mount, {
        appearances: {
          hasAllItems: true,
          items: {
            "test-1": items[0]
          }
        },
        features: {
          items: ["has-appearances-section"]
        }
      });

      expect(selectors.getAppearancesAsArray(store.getState())).toEqual(items);
    });
  });
});
