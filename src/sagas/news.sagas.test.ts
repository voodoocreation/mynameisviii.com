import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] News", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchLatestNews.started)", () => {
    it("put(actions.fetchLatestNews.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchLatestNews: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchLatestNews.started({}));

      expect(filterAction(actions.fetchLatestNews.done)).toHaveLength(1);
      expect(assocToArray(store().news.items)).toEqual(items);
    });

    it("put(actions.fetchLatestNews.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchLatestNews: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchLatestNews.started({}));
      const failedActions = filterAction(actions.fetchLatestNews.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreLatestNews.started)", () => {
    it("put(actions.fetchMoreLatestNews.done)", async () => {
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
            fetchLatestNews: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreLatestNews.started({}));
      const trackEventActions = filterAction(actions.trackEvent);

      expect(filterAction(actions.fetchMoreLatestNews.done)).toHaveLength(1);
      expect(trackEventActions).toHaveLength(1);
      expect(trackEventActions[0].payload).toEqual({
        event: "news.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().news.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreLatestNews.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {
          news: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchLatestNews: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreLatestNews.started({}));
      const failedActions = filterAction(actions.fetchMoreLatestNews.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchNewsArticleBySlug.started)", () => {
    it("put(actions.fetchNewsArticleBySlug.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchNewsArticleBySlug: () => ({
              data: items[0],
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchNewsArticleBySlug.started("test"));

      expect(filterAction(actions.fetchNewsArticleBySlug.done)).toHaveLength(1);
      expect(assocToArray(store().news.items)).toEqual(items);
    });

    it("put(actions.fetchNewsArticleBySlug.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchNewsArticleBySlug: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchNewsArticleBySlug.started("test"));
      const failedActions = filterAction(actions.fetchNewsArticleBySlug.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });
});
