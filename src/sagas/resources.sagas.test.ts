import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] Resources", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchResources.started)", () => {
    describe("when fetching resources, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchResources: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchResources.started", () => {
        dispatch(actions.fetchResources.started({}));
      });

      it("dispatches actions.fetchResources.done", () => {
        expect(filterAction(actions.fetchResources.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getResourcesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching resources, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchResources: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchResources.started", () => {
        dispatch(actions.fetchResources.started({}));
      });

      it("dispatches actions.fetchResources.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchResources.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreResources.started)", () => {
    describe("when fetching more resources, with a successful response", () => {
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
            fetchResources: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreResources.started", () => {
        dispatch(actions.fetchMoreResources.started({}));
      });

      it("dispatches actions.fetchMoreResources.done", () => {
        expect(filterAction(actions.fetchMoreResources.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);

        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "resources.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getResourcesAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more resources, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          resources: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchResources: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreResources.started", () => {
        dispatch(actions.fetchMoreResources.started({}));
      });

      it("dispatches actions.fetchMoreResources.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreResources.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
