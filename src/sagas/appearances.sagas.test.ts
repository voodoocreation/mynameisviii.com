import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Appearances", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchAppearances.started)", () => {
    it("put(actions.fetchAppearances.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {},
        {
          api: {
            fetchAppearances: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchAppearances.started({}));
      const doneAction = findAction(actions.fetchAppearances.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().appearances.items)).toEqual(items);
    });

    it("put(actions.fetchAppearances.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {},
        {
          api: {
            fetchAppearances: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchAppearances.started({}));
      const failedAction = findAction(actions.fetchAppearances.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreAppearances.started)", () => {
    it("put(actions.fetchMoreAppearances.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {
          appearances: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchAppearances: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreAppearances.started({}));
      const doneAction = findAction(actions.fetchMoreAppearances.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "appearances.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().appearances.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreAppearances.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {
          appearances: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchAppearances: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreAppearances.started({}));
      const failedAction = findAction(actions.fetchMoreAppearances.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchAppearanceBySlug.started)", () => {
    it("put(actions.fetchAppearanceBySlug.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {},
        {
          api: {
            fetchAppearanceBySlug: () => ({
              data: items[0],
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchAppearanceBySlug.started("test"));
      const doneAction = findAction(actions.fetchAppearanceBySlug.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().appearances.items)).toEqual(items);
    });

    it("put(actions.fetchAppearanceBySlug.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {},
        {
          api: {
            fetchAppearanceBySlug: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchAppearanceBySlug.started("test"));
      const failedAction = findAction(actions.fetchAppearanceBySlug.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
