import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchStemsSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchStems.started, function*() {
      const response = yield call(ports.api.fetchStems);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchStems.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchStems.failed({ error: response.message, params: {} })
        );
      }
    });
  };

export const fetchMoreStemsSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreStems.started, function*() {
      const lastEvaluatedKey = yield select(
        selectors.getStemsLastEvaluatedKeyAsString
      );
      const response = yield call(
        ports.api.fetchStems,
        undefined,
        lastEvaluatedKey
      );

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };

        yield put(actions.fetchMoreStems.done({ result, params: {} }));

        const itemCount = yield select(selectors.getStemsCount);
        yield put(
          actions.trackEvent({
            event: "stems.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreStems.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };
