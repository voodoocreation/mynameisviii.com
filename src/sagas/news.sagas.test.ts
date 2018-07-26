import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] News", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchLatestNews.started)", () => {
    it("put(actions.fetchLatestNews.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchLatestNews.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().news.items)).toEqual(items);
    });

    it("put(actions.fetchLatestNews.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchLatestNews.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreLatestNews.started)", () => {
    it("put(actions.fetchMoreLatestNews.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchMoreLatestNews.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "news.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().news.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreLatestNews.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchMoreLatestNews.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchNewsArticleBySlug.started)", () => {
    it("put(actions.fetchNewsArticleBySlug.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchNewsArticleBySlug.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().news.items)).toEqual(items);
    });

    it("put(actions.fetchNewsArticleBySlug.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchNewsArticleBySlug.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
