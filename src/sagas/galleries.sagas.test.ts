import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

describe("[sagas] Galleries", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchGalleries.started)", () => {
    it("put(actions.fetchGalleries.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchGalleries.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().galleries.items)).toEqual(items);
    });

    it("put(actions.fetchGalleries.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchGalleries.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchMoreGalleries.started)", () => {
    it("put(actions.fetchMoreGalleries.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchMoreGalleries.done);
      const trackEventAction = findAction(actions.trackEvent);

      expect(doneAction).toBeDefined();
      expect(trackEventAction).toBeDefined();
      expect(trackEventAction.payload).toEqual({
        event: "galleries.fetchedMore",
        itemCount: 2
      });
      expect(assocToArray(store().galleries.items)).toEqual([
        ...existingItems,
        ...items
      ]);
    });

    it("put(actions.fetchMoreGalleries.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchMoreGalleries.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });

  describe("takeLatest(actions.fetchGalleryBySlug.started)", () => {
    it("put(actions.fetchGalleryBySlug.done)", async () => {
      const { dispatch, findAction, store } = setupSagas(
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
      const doneAction = findAction(actions.fetchGalleryBySlug.done);

      expect(doneAction).toBeDefined();
      expect(assocToArray(store().galleries.items)).toEqual(items);
    });

    it("put(actions.fetchGalleryBySlug.failed)", async () => {
      const { dispatch, findAction } = setupSagas(
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
      const failedAction = findAction(actions.fetchGalleryBySlug.failed);

      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error).toBe("Bad request");
    });
  });
});
