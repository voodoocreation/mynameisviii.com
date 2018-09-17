import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchGalleriesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchGalleries.started, function*() {
      const response = yield call(ports.api.fetchGalleries);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchGalleries.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchGalleries.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchMoreGalleriesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreGalleries.started, function*() {
      const lastKey = yield select(selectors.getGalleriesLastKey);

      const response = yield call(ports.api.fetchGalleries, lastKey);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };

        yield put(actions.fetchMoreGalleries.done({ result, params: {} }));

        const itemCount = yield select(selectors.getGalleriesCount);
        yield put(
          actions.trackEvent({
            event: "galleries.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreGalleries.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchGalleryBySlugSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchGalleryBySlug.started, function*({
      payload
    }: {
      payload: PLFetchGalleryBySlugStarted;
      type: string;
    }) {
      const response = yield call(ports.api.fetchGalleryBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchGalleryBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchGalleryBySlug.failed({
            error: tryParseJson(response.message),
            params: payload
          })
        );
      }
    });
  };
