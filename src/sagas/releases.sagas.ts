import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchReleasesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchReleases.started, function*() {
      const res = yield call(ports.api.fetchReleases);

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
        };
        yield put(actions.fetchReleases.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchReleases.failed({ error: res.message, params: {} })
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
      const res = yield call(
        ports.api.fetchReleases,
        undefined,
        lastEvaluatedKey
      );

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
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
          actions.fetchMoreReleases.failed({ error: res.message, params: {} })
        );
      }
    });
  };

export const fetchReleaseBySlugSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchReleaseBySlug.started, function*({
      payload
    }: {
      payload: PLFetchReleaseBySlugStarted;
      type: string;
    }) {
      const res = yield call(ports.api.fetchReleaseBySlug, payload);

      if (res.ok) {
        yield put(
          actions.fetchReleaseBySlug.done({
            params: payload,
            result: res.data
          })
        );
      } else {
        yield put(
          actions.fetchReleaseBySlug.failed({
            error: tryParseJson(res.message),
            params: payload
          })
        );
      }
    });
  };
