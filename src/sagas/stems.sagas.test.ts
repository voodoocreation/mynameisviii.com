import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] Stems", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchStems.started)", () => {
    describe("when fetching stems, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchStems: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchStems.started", () => {
        dispatch(actions.fetchStems.started({}));
      });

      it("dispatches actions.fetchStems.done", () => {
        expect(filterAction(actions.fetchStems.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getStemsAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching stems, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchStems: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchStems.started", () => {
        dispatch(actions.fetchStems.started({}));
      });

      it("dispatches actions.fetchStems.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchStems.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreStems.started)", () => {
    describe("when fetching more stems, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
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
            fetchStems: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreStems.started", () => {
        dispatch(actions.fetchMoreStems.started({}));
      });

      it("dispatches actions.fetchMoreStems.done", () => {
        expect(filterAction(actions.fetchMoreStems.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);

        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "stems.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getStemsAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more stems, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          stems: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchStems: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreStems.started", () => {
        dispatch(actions.fetchMoreStems.started({}));
      });

      it("dispatches actions.fetchMoreStems.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreStems.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });
});
