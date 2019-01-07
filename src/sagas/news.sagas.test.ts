import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] News", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchLatestNews.started)", () => {
    describe("when fetching latest news, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchLatestNews: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchLatestNews.started", () => {
        dispatch(actions.fetchLatestNews.started({}));
      });

      it("dispatches actions.fetchLatestNews.done", () => {
        expect(filterAction(actions.fetchLatestNews.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getNewsArticlesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching latest news, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchLatestNews: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchLatestNews.started", () => {
        dispatch(actions.fetchLatestNews.started({}));
      });

      it("dispatches actions.fetchLatestNews.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchLatestNews.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreLatestNews.started)", () => {
    describe("when fetching more latest news, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {
          news: {
            items: arrayToAssoc(existingItems, "slug"),
            lastEvaluatedKey: {
              createdAt: "",
              isActive: "y",
              slug: ""
            }
          }
        },
        {
          api: {
            fetchLatestNews: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreLatestNews.started", () => {
        dispatch(actions.fetchMoreLatestNews.started({}));
      });

      it("dispatches actions.fetchMoreLatestNews.done", () => {
        expect(filterAction(actions.fetchMoreLatestNews.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);

        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "news.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getNewsArticlesAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more latest news, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          news: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchLatestNews: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreLatestNews.started", () => {
        dispatch(actions.fetchMoreLatestNews.started({}));
      });

      it("dispatches actions.fetchMoreLatestNews.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreLatestNews.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchNewsArticleBySlug.started)", () => {
    describe("when fetching a news article by slug, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchNewsArticleBySlug: g.mockWithData(items[0])
          }
        }
      );

      it("dispatches actions.fetchNewsArticleBySlug.started", () => {
        dispatch(actions.fetchNewsArticleBySlug.started("test"));
      });

      it("dispatches actions.fetchNewsArticleBySlug.done", () => {
        expect(filterAction(actions.fetchNewsArticleBySlug.done)).toHaveLength(
          1
        );
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getNewsArticlesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching a news article by slug, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchNewsArticleBySlug: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchNewsArticleBySlug.started", () => {
        dispatch(actions.fetchNewsArticleBySlug.started("test"));
      });

      it("dispatches actions.fetchNewsArticleBySlug.failed with expected error", () => {
        const failedActions = filterAction(
          actions.fetchNewsArticleBySlug.failed
        );

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
