import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc, assocToArray } from "../transformers/transformData";

import * as actions from "../actions/root.actions";

const g: any = global;

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
            items: arrayToAssoc(existingItems, "slug"),
            lastEvaluatedKey: {
              isActive: "y",
              slug: "",
              startingAt: ""
            }
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

  describe("takeLatest(actions.geocodeCurrentAppearanceAddress.started", () => {
    it("put(actions.geocodeCurrentAppearanceAddress.done) with stored `latLng`", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {
          appearances: {
            currentSlug: "test-1",
            items: {
              "test-1": {
                location: {
                  address: "address",
                  latLng: { lat: 0, lng: 0 },
                  name: "name"
                },
                slug: "test-1"
              }
            }
          }
        },
        {}
      );

      dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      const doneAction = findAction(
        actions.geocodeCurrentAppearanceAddress.done
      );

      expect(g.google.maps.Geocoder).not.toHaveBeenCalled();
      expect(doneAction).toBeDefined();
      expect(store().appearances.currentLocation).toEqual({ lat: 0, lng: 0 });
    });

    it("put(actions.geocodeCurrentAppearanceAddress.done) with geocoded address", async () => {
      const { dispatch, findAction, store } = setupSagas(
        {
          appearances: {
            currentSlug: "test-1",
            items: {
              "test-1": {
                location: {
                  address: "address",
                  name: "name"
                },
                slug: "test-1"
              }
            }
          }
        },
        {}
      );

      await dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      const doneAction = findAction(
        actions.geocodeCurrentAppearanceAddress.done
      );

      expect(g.google.maps.Geocoder).toHaveBeenCalled();
      expect(doneAction).toBeDefined();
      expect(store().appearances.currentLocation).toEqual({
        lat: 51.54057,
        lng: -0.14334
      });
    });

    it("put(actions.geocodeCurrentAppearanceAddress.failed) with geocoder error", async () => {
      g.google.maps.Geocoder = jest.fn(() => ({
        geocode: jest.fn((_, callback) => callback([], "REQUEST_DENIED"))
      }));

      const { dispatch, findAction } = setupSagas(
        {
          appearances: {
            currentSlug: "test-1",
            items: {
              "test-1": {
                location: {
                  address: "address",
                  name: "name"
                },
                slug: "test-1"
              }
            }
          }
        },
        {}
      );

      await dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      const failedAction = findAction(
        actions.geocodeCurrentAppearanceAddress.failed
      );

      expect(g.google.maps.Geocoder).toHaveBeenCalled();
      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error.message).toBe(
        "Geocoder error: REQUEST_DENIED"
      );
    });

    it("put(actions.geocodeCurrentAppearanceAddress.failed) with rejected geocoder promise", async () => {
      g.google.maps.Geocoder = jest.fn(() => ({
        geocode: jest.fn(() => {
          throw new Error("Failed promise");
        })
      }));

      const { dispatch, findAction } = setupSagas(
        {
          appearances: {
            currentSlug: "test-1",
            items: {
              "test-1": {
                location: {
                  address: "address",
                  name: "name"
                },
                slug: "test-1"
              }
            }
          }
        },
        {}
      );

      await dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      const failedAction = findAction(
        actions.geocodeCurrentAppearanceAddress.failed
      );

      expect(g.google.maps.Geocoder).toHaveBeenCalled();
      expect(failedAction).toBeDefined();
      expect(failedAction.payload.error.message).toBe("Failed promise");
    });
  });
});
