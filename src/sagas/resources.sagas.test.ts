import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Resources", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchResources.started)", () => {
    it("put(actions.fetchResources.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchResources: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchResources.started({}));

      expect(filterAction(actions.fetchResources.done)).toHaveLength(1);
      expect(assocToArray(store().resources.items)).toEqual(items);
    });

    it("put(actions.fetchResources.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchResources: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchResources.started({}));
      const failedActions = filterAction(actions.fetchResources.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreResources.started)", () => {
    it("put(actions.fetchMoreResources.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {
          resources: {
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
            fetchResources: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreResources.started({}));
      const trackEventActions = filterAction(actions.trackEvent);

      expect(filterAction(actions.fetchMoreResources.done)).toHaveLength(1);
      expect(trackEventActions).toHaveLength(1);
      expect(trackEventActions[0].payload).toEqual({
        event: "resources.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().resources.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreResources.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {
          resources: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchResources: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreResources.started({}));
      const failedActions = filterAction(actions.fetchMoreResources.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });
});
