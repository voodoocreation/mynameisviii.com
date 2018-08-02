import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Stems", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchStems.started)", () => {
    it("put(actions.fetchStems.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchStems.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().stems.items)).toEqual(items);
    });

    it("put(actions.fetchStems.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchStems.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreStems.started)", () => {
    it("put(actions.fetchMoreStems.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchMoreStems.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "stems.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().stems.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreStems.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchMoreStems.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
