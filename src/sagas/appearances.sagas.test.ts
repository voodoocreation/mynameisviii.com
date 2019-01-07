import setupSagas from "../helpers/setupSagas";
import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const g: any = global;

describe("[sagas] Appearances", () => {
  const existingItems = [{ slug: "existing-test" }];
  const items = [{ slug: "test" }];

  describe("takeLatest(actions.fetchAppearances.started)", () => {
    describe("when fetching appearances, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchAppearances: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchAppearances.started", () => {
        dispatch(actions.fetchAppearances.started({}));
      });

      it("dispatches actions.fetchAppearances.done", () => {
        expect(filterAction(actions.fetchAppearances.done)).toHaveLength(1);
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getAppearancesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching appearances, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchAppearances: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchAppearances.started", () => {
        dispatch(actions.fetchAppearances.started({}));
      });

      it("dispatches actions.fetchAppearances.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchAppearances.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchMoreAppearances.started)", () => {
    describe("when fetching more appearances, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
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
            fetchAppearances: g.mockWithData({ items })
          }
        }
      );

      it("dispatches actions.fetchMoreAppearances.started", () => {
        dispatch(actions.fetchMoreAppearances.started({}));
      });

      it("dispatches actions.fetchMoreAppearances.done", () => {
        expect(filterAction(actions.fetchMoreAppearances.done)).toHaveLength(1);
      });

      it("dispatches actions.trackEvent with expected payload", () => {
        const trackEventActions = filterAction(actions.trackEvent);
        expect(trackEventActions).toHaveLength(1);
        expect(trackEventActions[0].payload).toEqual({
          event: "appearances.fetchedMore",
          itemCount: 2
        });
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getAppearancesAsArray(store())).toEqual([
          ...existingItems,
          ...items
        ]);
      });
    });

    describe("when fetching more appearances, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {
          appearances: {
            items: arrayToAssoc(existingItems, "slug")
          }
        },
        {
          api: {
            fetchAppearances: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchMoreAppearances.started", () => {
        dispatch(actions.fetchMoreAppearances.started({}));
      });

      it("dispatches actions.fetchMoreAppearances.failed with expected error", () => {
        const failedActions = filterAction(actions.fetchMoreAppearances.failed);

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.fetchAppearanceBySlug.started)", () => {
    describe("when fetching an appearance by slug, with a successful response", () => {
      const { dispatch, filterAction, store } = setupSagas(
        {},
        {
          api: {
            fetchAppearanceBySlug: g.mockWithData(items[0])
          }
        }
      );

      it("dispatches actions.fetchAppearanceBySlug.started", () => {
        dispatch(actions.fetchAppearanceBySlug.started("test"));
      });

      it("dispatches actions.fetchAppearanceBySlug.done", () => {
        expect(filterAction(actions.fetchAppearanceBySlug.done)).toHaveLength(
          1
        );
      });

      it("has the data from the response in the store", () => {
        expect(selectors.getAppearancesAsArray(store())).toEqual(items);
      });
    });

    describe("when fetching an appearance by slug, with a failed response", () => {
      const { dispatch, filterAction } = setupSagas(
        {},
        {
          api: {
            fetchAppearanceBySlug: g.mockWithError("Bad request")
          }
        }
      );

      it("dispatches actions.fetchAppearanceBySlug.started", () => {
        dispatch(actions.fetchAppearanceBySlug.started("test"));
      });

      it("dispatches actions.fetchAppearanceBySlug.failed with expected error", () => {
        const failedActions = filterAction(
          actions.fetchAppearanceBySlug.failed
        );

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error).toBe("Bad request");
      });
    });
  });

  describe("takeLatest(actions.geocodeCurrentAppearanceAddress.started", () => {
    describe("when geocoding the current appearance's address, when its location.latLng is defined", () => {
      const latLng = { lat: 0, lng: 0 };
      const { dispatch, filterAction, ports, store } = setupSagas(
        {
          appearances: {
            currentSlug: "test-1",
            items: {
              "test-1": {
                location: {
                  address: "address",
                  latLng,
                  name: "name"
                },
                slug: "test-1"
              }
            }
          }
        },
        {}
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("doesn't make a request to the geocoder API", () => {
        expect(ports.maps.Geocoder).not.toHaveBeenCalled();
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.done", () => {
        expect(
          filterAction(actions.geocodeCurrentAppearanceAddress.done)
        ).toHaveLength(1);
      });

      it("current location in the store matches the appearance's location latLng", () => {
        expect(selectors.getCurrentAppearanceLocation(store())).toEqual(latLng);
      });
    });

    describe("when geocoding the current appearance's address, when its location.latLng isn't defined", () => {
      const { dispatch, filterAction, ports, store } = setupSagas(
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

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a request to the geocoder API", () => {
        expect(ports.maps.Geocoder).toHaveBeenCalled();
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.done", () => {
        expect(
          filterAction(actions.geocodeCurrentAppearanceAddress.done)
        ).toHaveLength(1);
      });

      it("current location in the store matches the geocoder API response", () => {
        expect(selectors.getCurrentAppearanceLocation(store())).toEqual({
          lat: 51.54057,
          lng: -0.14334
        });
      });
    });

    describe("when geocoding the current appearance's address, with a geocoder error", () => {
      const { dispatch, filterAction, ports } = setupSagas(
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
        {
          maps: {
            Geocoder: jest.fn(() => ({
              geocode: (_: any, callback: any) => callback([], "REQUEST_DENIED")
            }))
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a request to the geocoder API", () => {
        expect(ports.maps.Geocoder).toHaveBeenCalled();
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.failed with expected error", () => {
        const failedActions = filterAction(
          actions.geocodeCurrentAppearanceAddress.failed
        );

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error.message).toBe(
          "Geocoder error: REQUEST_DENIED"
        );
      });
    });

    describe("when geocoding the current appearance's address, with a rejected geocoder promise", () => {
      const { dispatch, filterAction, ports } = setupSagas(
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
        {
          maps: {
            Geocoder: jest.fn(() => ({
              geocode: () => {
                throw new Error("Failed promise");
              }
            }))
          }
        }
      );

      it("dispatches actions.geocodeCurrentAppearanceAddress.started", () => {
        dispatch(actions.geocodeCurrentAppearanceAddress.started({}));
      });

      it("makes a request to the geocoder API", () => {
        expect(ports.maps.Geocoder).toHaveBeenCalled();
      });

      it("dispatches actions.geocodeCurrentAppearanceAddress.failed with expected error", () => {
        const failedActions = filterAction(
          actions.geocodeCurrentAppearanceAddress.failed
        );

        expect(failedActions).toHaveLength(1);
        expect(failedActions[0].payload.error.message).toBe("Failed promise");
      });
    });
  });
});
