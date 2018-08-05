import { mount, render } from "enzyme";
import { camelizeKeys } from "humps";
import merge from "lodash.merge";
import * as React from "react";
import { Provider } from "react-redux";

import * as selectors from "../../../selectors/root.selectors";
import createStore from "../../../store/root.store";
import ReleaseRoute from "./ReleaseRoute";

import releases from "../../../../server/mocks/releases.json";
import { arrayToAssoc } from "../../../transformers/transformData";

const mockData: any = camelizeKeys(releases);

const setup = (fn: any, fromTestStore = {}, fromTestApi?: {}) => {
  const store = createStore(
    merge(
      {
        releases: {
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
        <ReleaseRoute />
      </Provider>
    ),
    store
  };
};

describe("[routes] <ReleaseRoute />", () => {
  it("renders correctly", () => {
    const { actual } = setup(render);

    expect(actual).toMatchSnapshot();
  });

  it("renders a loader when item is being fetched", () => {
    const { actual } = setup(render, {
      releases: { isLoading: true }
    });

    expect(actual.hasClass("PageLoader")).toBe(true);
    expect(actual).toMatchSnapshot();
  });

  it("renders 404 error page when no release exists", () => {
    const { actual } = setup(mount, {
      page: {
        error: {
          message: "Not found",
          status: 404
        }
      },
      releases: {
        currentSlug: "test-1"
      }
    });

    const ErrorPage = actual.find("ErrorPage");

    expect(ErrorPage).toHaveLength(1);
    expect(ErrorPage.prop("status")).toBe(404);
    expect(actual.render()).toMatchSnapshot();
  });

  it("renders 500 error page when slug isn't in the store", () => {
    const { actual } = setup(mount, {
      releases: {
        currentSlug: null
      }
    });

    const ErrorPage = actual.find("ErrorPage");

    expect(ErrorPage).toHaveLength(1);
    expect(ErrorPage.prop("status")).toBe(500);
    expect(actual.render()).toMatchSnapshot();
  });

  it("tracks carousel interactions correctly", () => {
    const { actual } = setup(mount);

    actual
      .find(".Carousel-page")
      .last()
      .simulate("click");

    expect(window.dataLayer[0].event).toBe("release.carousel.slideChange");
    expect(window.dataLayer[0].index).toBe(1);
  });

  describe("getInitialProps()", () => {
    it("sets `currentSlug` from URL", async () => {
      const { store } = setup(render);

      await ReleaseRoute.getInitialProps({
        ctx: {
          query: { slug: "test-1" },
          store
        }
      });

      expect(selectors.getCurrentReleaseSlug(store.getState())).toBe("test-1");
    });

    it("fetches release when it's not already in the store", async () => {
      const { store } = setup(
        render,
        {
          releases: {
            items: {}
          }
        },
        {
          fetchReleaseBySlug: (slug: string) =>
            mockData.find((item: any) => item.slug === slug)
        }
      );

      await ReleaseRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getCurrentRelease(store.getState())).toBeDefined();
    });

    it("doesn't fetch release when it's already in the store", async () => {
      const { store } = setup(render);

      const itemCountBeforeRender = selectors.getReleasesCount(
        store.getState()
      );

      await ReleaseRoute.getInitialProps({
        ctx: {
          query: { slug: mockData.items[0].slug },
          store
        }
      });

      expect(selectors.getReleasesCount(store.getState())).toBe(
        itemCountBeforeRender
      );
    });
  });
});
