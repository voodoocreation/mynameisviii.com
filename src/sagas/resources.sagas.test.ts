import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Resources", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchResources.started)", () => {
    it("put(actions.fetchResources.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchResources.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().resources.items)).toEqual(items);
    });

    it("put(actions.fetchResources.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchResources.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreResources.started)", () => {
    it("put(actions.fetchMoreResources.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchMoreResources.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "resources.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().resources.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreResources.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchMoreResources.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
