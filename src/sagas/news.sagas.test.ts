import setupSagas from "../helpers/setupSagas";

import * as actions from "../actions/root.actions";
import { assocToArray } from "../transformers/transformData";

describe("[sagas] News", () => {
  describe("actions.fetchLatestNews.started", () => {
    it("with actions.fetchLatestNews.done", async () => {
      const testData = [{ slug: "test" }];

      const { dispatch, store } = setupSagas(
        {
          news: {
            items: []
          }
        },
        {
          fetchLatestNews: () => ({
            data: {
              items: testData
            },
            ok: true
          })
        }
      );

      dispatch(actions.fetchLatestNews.started({}));
      const storeResult = store().news.items;

      expect(assocToArray(storeResult)).toEqual(testData);
    });

    it("with actions.fetchLatestNews.failed", async () => {
      const { dispatch, findAction } = setupSagas(
        {
          news: {
            items: []
          }
        },
        {
          fetchLatestNews: () => ({
            message: "Bad Request",
            ok: false
          })
        }
      );

      dispatch(actions.fetchLatestNews.started({}));

      const failureAction = findAction(actions.fetchLatestNews.failed);

      expect(failureAction.payload.error).toBe("Bad Request");
    });
  });
});
