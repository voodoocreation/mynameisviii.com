import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Releases", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchReleases.started)", () => {
    it("put(actions.fetchReleases.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
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

      expect(filterAction(actions.fetchReleases.done)).toHaveLength(1);
      expect(assocToArray(store().releases.items)).toEqual(items);
    });

    it("put(actions.fetchReleases.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
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
      const failedActions = filterAction(actions.fetchReleases.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreReleases.started)", () => {
    it("put(actions.fetchMoreReleases.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
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
      const trackEventActions = filterAction(actions.trackEvent);

      expect(filterAction(actions.fetchMoreReleases.done)).toHaveLength(1);
      expect(trackEventActions).toHaveLength(1);
      expect(trackEventActions[0].payload).toEqual({
        event: "releases.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().releases.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreReleases.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
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
      const failedActions = filterAction(actions.fetchMoreReleases.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchReleaseBySlug.started)", () => {
    it("put(actions.fetchReleaseBySlug.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
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

      expect(filterAction(actions.fetchReleaseBySlug.done)).toHaveLength(1);
      expect(assocToArray(store().releases.items)).toEqual(items);
    });

    it("put(actions.fetchReleaseBySlug.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
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
      const failedActions = filterAction(actions.fetchReleaseBySlug.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });
});
