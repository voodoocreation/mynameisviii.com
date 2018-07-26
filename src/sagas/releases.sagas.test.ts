import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Releases", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchReleases.started)", () => {
    it("put(actions.fetchReleases.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {},
        {
          api: {
            fetchReleases: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchReleases.started({}));
      const doneAction = findAction(actions.fetchReleases.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().releases.items)).toEqual(items);
    });

    it("put(actions.fetchReleases.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {},
        {
          api: {
            fetchReleases: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchReleases.started({}));
      const failedAction = findAction(actions.fetchReleases.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreReleases.started)", () => {
    it("put(actions.fetchMoreReleases.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {
          releases: {
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
            fetchReleases: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreReleases.started({}));
      const doneAction = findAction(actions.fetchMoreReleases.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "releases.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().releases.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreReleases.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {
          releases: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchReleases: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreReleases.started({}));
      const failedAction = findAction(actions.fetchMoreReleases.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchReleaseBySlug.started)", () => {
    it("put(actions.fetchReleaseBySlug.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {},
        {
          api: {
            fetchReleaseBySlug: () => ({
              data: items[0],
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchReleaseBySlug.started("test"));
      const doneAction = findAction(actions.fetchReleaseBySlug.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().releases.items)).toEqual(items);
    });

    it("put(actions.fetchReleaseBySlug.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
        {},
        {
          api: {
            fetchReleaseBySlug: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchReleaseBySlug.started("test"));
      const failedAction = findAction(actions.fetchReleaseBySlug.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
