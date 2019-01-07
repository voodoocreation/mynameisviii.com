import { call, put, select, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchReleasesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchReleases.started, function*() {
      const response = yield call(ports.api.fetchReleases);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchReleases.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchReleases.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreReleasesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreReleases.started, function*() {
      const lastEvaluatedKey = yield select(
        selectors.getReleasesLastEvaluatedKeyAsString
      );
      const response = yield call(
        ports.api.fetchReleases,
        undefined,
        lastEvaluatedKey
      );

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchMoreReleases.done({ result, params: {} }));

        const itemCount = yield select(selectors.getReleasesCount);
        yield put(
          actions.trackEvent({
            event: "releases.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreReleases.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchReleaseBySlugSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchReleaseBySlug.started, function*({
      payload
    }: Action<PLFetchReleaseBySlugStarted>) {
      const response = yield call(ports.api.fetchReleaseBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchReleaseBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchReleaseBySlug.failed({
            error: tryParseJson(response.message),
            params: payload
          })
        );
      }
    });
  };
