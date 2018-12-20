import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] Releases", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchReleases.started)", () => {
    describe("when fetching releases, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchReleases: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchReleases.started", () => {
        dispatch(actions.fetchReleases.started({}));
      });

      it("dispatches actions.fetchReleases.done", () => {
        expect(filterAction(actions.fetchReleases.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getReleasesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching releases, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchReleases: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchReleases.started", () => {
        dispatch(actions.fetchReleases.started({}));
      });

      it("dispatches actions.fetchReleases.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchReleases.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreReleases.started)", () => {
    describe("when fetching more releases, with a successful response", () => {
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
            fetchReleases: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreReleases.started", () => {
        dispatch(actions.fetchMoreReleases.started({}));
      });

      it("dispatches actions.fetchMoreReleases.done", () => {
        expect(filterAction(actions.fetchMoreReleases.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);

        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "releases.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getReleasesAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more releases, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          releases: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchReleases: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreReleases.started", () => {
        dispatch(actions.fetchMoreReleases.started({}));
      });

      it("dispatches actions.fetchMoreReleases.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreReleases.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchReleaseBySlug.started)", () => {
    describe("when fetching a release by slug, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchReleaseBySlug: g.mockWithData(items[0])
          }
        }
      );

      it("dispatches actions.fetchReleaseBySlug.started", () => {
        dispatch(actions.fetchReleaseBySlug.started("test"));
      });

      it("dispatches actions.fetchReleaseBySlug.done", () => {
        expect(filterAction(actions.fetchReleaseBySlug.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getReleasesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching a release by slug, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchReleaseBySlug: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchReleaseBySlug.started", () => {
        dispatch(actions.fetchReleaseBySlug.started("test"));
      });

      it("dispatches actions.fetchReleaseBySlug.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchReleaseBySlug.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
