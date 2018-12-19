import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Galleries", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchGalleries.started)", () => {
    it("put(actions.fetchGalleries.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchGalleries: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchGalleries.started({}));

      expect(filterAction(actions.fetchGalleries.done)).toHaveLength(1);
      expect(assocToArray(store().galleries.items)).toEqual(items);
    });

    it("put(actions.fetchGalleries.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchGalleries: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchGalleries.started({}));
      const failedActions = filterAction(actions.fetchGalleries.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreGalleries.started)", () => {
    it("put(actions.fetchMoreGalleries.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {
          galleries: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchGalleries: () => ({
              data: { items },
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchMoreGalleries.started({}));
      const trackEventActions = filterAction(actions.trackEvent);

      expect(filterAction(actions.fetchMoreGalleries.done)).toHaveLength(1);
      expect(trackEventActions).toHaveLength(1);
      expect(trackEventActions[0].payload).toEqual({
        event: "galleries.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().galleries.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreGalleries.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {
          galleries: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchGalleries: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchMoreGalleries.started({}));
      const failedActions = filterAction(actions.fetchMoreGalleries.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchGalleryBySlug.started)", () => {
    it("put(actions.fetchGalleryBySlug.done)", async () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchGalleryBySlug: () => ({
              data: items[0],
              ok: true
            })
          }
        }
      );

      dispatch(actions.fetchGalleryBySlug.started("test"));

      expect(filterAction(actions.fetchGalleryBySlug.done)).toHaveLength(1);
      expect(assocToArray(store().galleries.items)).toEqual(items);
    });

    it("put(actions.fetchGalleryBySlug.failed)", async () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchGalleryBySlug: () => ({
              message: "Bad request",
              ok: false
            })
          }
        }
      );

      dispatch(actions.fetchGalleryBySlug.started("test"));
      const failedActions = filterAction(actions.fetchGalleryBySlug.failed);

      expect(failedActions).toHaveLength(1);
      expect(failedActions[0].payload.error).toBe("Bad request");
    });
  });
});
