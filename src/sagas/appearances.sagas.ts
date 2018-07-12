import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchAppearancesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchAppearances.started, function*() {
      const res = yield call(ports.api.fetchAppearances);

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
        };
        yield put(actions.fetchAppearances.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchAppearances.failed({ error: res.message, params: {} })
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
      const res = yield call(
        ports.api.fetchAppearances,
        undefined,
        lastEvaluatedKey
      );

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
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
            error: res.message,
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
      const res = yield call(ports.api.fetchAppearanceBySlug, payload);

      if (res.ok) {
        yield put(
          actions.fetchAppearanceBySlug.done({
            params: payload,
            result: res.data
          })
        );
      } else {
        yield put(
          actions.fetchAppearanceBySlug.failed({
            error: tryParseJson(res.message),
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
          const geocoder = new ports.maps.Geocoder();

          const geocode = (params: any) =>
            new Promise((resolve, reject) => {
              try {
                geocoder.geocode(
                  params,
                  (res: IGeocoderResult[], stat: string) => {
                    resolve({ results: res, status: stat });
                  }
                );
              } catch (error) {
                reject(error);
              }
            });

          try {
            const { results, status } = yield call(geocode, {
              address: `${name}, ${address}`
            });

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
