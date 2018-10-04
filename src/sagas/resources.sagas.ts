import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchResourcesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchResources.started, function*() {
      const response = yield call(ports.api.fetchResources);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchResources.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchResources.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreResourcesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreResources.started, function*() {
      const lastEvaluatedKey = yield select(
        selectors.getResourcesLastEvaluatedKeyAsString
      );
      const response = yield call(
        ports.api.fetchResources,
        undefined,
        lastEvaluatedKey
      );

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };

        yield put(actions.fetchMoreResources.done({ result, params: {} }));

        const itemCount = yield select(selectors.getResourcesCount);
        yield put(
          actions.trackEvent({
            event: "resources.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreResources.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };
