import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] Galleries", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchGalleries.started)", () => {
    describe("when fetching galleries, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchGalleries: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchGalleries.started", () => {
        dispatch(actions.fetchGalleries.started({}));
      });

      it("dispatches actions.fetchGalleries.done", () => {
        expect(filterAction(actions.fetchGalleries.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getGalleriesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching galleries, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchGalleries: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchGalleries.started", () => {
        dispatch(actions.fetchGalleries.started({}));
      });

      it("dispatches actions.fetchGalleries.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchGalleries.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreGalleries.started)", () => {
    describe("when fetching more galleries, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {
          galleries: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchGalleries: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreGalleries.started", () => {
        dispatch(actions.fetchMoreGalleries.started({}));
      });

      it("dispatches actions.fetchMoreGalleries.done", () => {
        expect(filterAction(actions.fetchMoreGalleries.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);

        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "galleries.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getGalleriesAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more galleries, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          galleries: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchGalleries: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreGalleries.started", () => {
        dispatch(actions.fetchMoreGalleries.started({}));
      });

      it("dispatches actions.fetchMoreGalleries.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreGalleries.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchGalleryBySlug.started)", () => {
    describe("when fetching a gallery by slug, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchGalleryBySlug: g.mockWithData(items[0])
          }
        }
      );

      it("dispatches actions.fetchGalleryBySlug.started", () => {
        dispatch(actions.fetchGalleryBySlug.started("test"));
      });

      it("dispatches actions.fetchGalleryBySlug.done", () => {
        expect(filterAction(actions.fetchGalleryBySlug.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getGalleriesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching a gallery by slug, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchGalleryBySlug: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchGalleryBySlug.started", () => {
        dispatch(actions.fetchGalleryBySlug.started("test"));
      });

      it("dispatches actions.fetchGalleryBySlug.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchGalleryBySlug.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
