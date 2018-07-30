import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

const geocode = (geocoder: any, params: any) =>
  new Promise((resolve, reject) => {
    try {
      geocoder.geocode(
        params,
        (response: IGeocoderResult[], status: string) => {
          resolve({ results: response, status });
        }
      );
    } catch (error) {
      reject(error);
    }
  });

export const fetchAppearancesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchAppearances.started, function*() {
      const response = yield call(ports.api.fetchAppearances);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchAppearances.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchAppearances.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchMoreAppearancesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreAppearances.started, function*() {
      const lastEvaluatedKey = yield select(
        selectors.getAppearancesLastEvaluatedKeyAsString
      );
      const response = yield call(
        ports.api.fetchAppearances,
        undefined,
        lastEvaluatedKey
      );

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchMoreAppearances.done({ result, params: {} }));

        const itemCount = yield select(selectors.getAppearancesCount);
        yield put(
          actions.trackEvent({
            event: "appearances.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreAppearances.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchAppearanceBySlugSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchAppearanceBySlug.started, function*({
      payload
    }: {
      payload: PLFetchAppearanceBySlugStarted;
      type: string;
    }) {
      const response = yield call(ports.api.fetchAppearanceBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchAppearanceBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchAppearanceBySlug.failed({
            error: tryParseJson(response.message),
            params: payload
          })
        );
      }
    });
  };

export const geocodeCurrentAppearanceAddressSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(
      actions.geocodeCurrentAppearanceAddress.started,
      function*() {
        const currentAppearance = yield select(selectors.getCurrentAppearance);
        const { address, latLng, name } = currentAppearance.location;

        if (latLng) {
          yield put(
            actions.geocodeCurrentAppearanceAddress.done({
              params: {},
              result: latLng
            })
          );
        } else {
          try {
            const { results, status } = yield call(
              geocode,
              new ports.maps.Geocoder(),
              { address: `${name}, ${address}` }
            );

            if (status === ports.maps.GeocoderStatus.OK && results.length > 0) {
              const { location } = results[0].geometry;

              yield put(
                actions.geocodeCurrentAppearanceAddress.done({
                  params: {},
                  result: {
                    lat: location.lat(),
                    lng: location.lng()
                  }
                })
              );
            } else {
              yield put(
                actions.geocodeCurrentAppearanceAddress.failed({
                  error: { status: 500, message: `Geocoder error: ${status}` },
                  params: {}
                })
              );
            }
          } catch (error) {
            yield put(
              actions.geocodeCurrentAppearanceAddress.failed({
                error,
                params: {}
              })
            );
          }
        }
      }
    );
  };
