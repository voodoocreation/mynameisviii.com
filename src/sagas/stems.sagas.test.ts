import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Stems", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchStems.started)", () => {
    it("put(actions.fetchStems.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchStems: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchStems.started({}));

      expect(filterAction(actions.fetchStems.done)).toHaveLength(1);
      expect(assocToArray(store().stems.items)).toEqual(items);
    });

    it("put(actions.fetchStems.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchStems: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchStems.started({}));
      const failedActions = filterAction(actions.fetchStems.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreStems.started)", () => {
    it("put(actions.fetchMoreStems.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {
          stems: {
            items: arrayToAssoc(existingItems, "slug"),
            lastEvaluatedKey: {
              isActive: "y",
              releasedOn: "",
              slug: ""
            }
          }
        },
        {
          api: {
            fetchStems: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreStems.started({}));
      const trackEventActions = filterAction(actions.trackEvent);

      expect(filterAction(actions.fetchMoreStems.done)).toHaveLength(1);
      expect(trackEventActions).toHaveLength(1);
      expect(trackEventActions[0].payload).toEqual({
        event: "stems.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().stems.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreStems.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {
          stems: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchStems: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreStems.started({}));
      const failedActions = filterAction(actions.fetchMoreStems.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });
});
