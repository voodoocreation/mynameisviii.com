import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../transformers/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchLatestNewsSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchLatestNews.started, function*() {
      const response = yield call(ports.api.fetchLatestNews, 5);

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };
        yield put(actions.fetchLatestNews.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchLatestNews.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchMoreLatestNewsSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchMoreLatestNews.started, function*() {
      const lastEvaluatedKey = yield select(
        selectors.getNewsLastEvaluatedKeyAsString
      );

      const response = yield call(
        ports.api.fetchLatestNews,
        5,
        lastEvaluatedKey
      );

      if (response.ok) {
        const result = {
          ...response.data,
          items: arrayToAssoc(response.data.items, "slug")
        };

        yield put(actions.fetchMoreLatestNews.done({ result, params: {} }));

        const itemCount = yield select(selectors.getNewsArticlesCount);
        yield put(
          actions.trackEvent({
            event: "news.fetchedMore",
            itemCount
          })
        );
      } else {
        yield put(
          actions.fetchMoreLatestNews.failed({
            error: response.message,
            params: {}
          })
        );
      }
    });
  };

export const fetchNewsArticleBySlugSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchNewsArticleBySlug.started, function*({
      payload
    }: {
      payload: PLFetchNewsArticleBySlugStarted;
      type: string;
    }) {
      const response = yield call(ports.api.fetchNewsArticleBySlug, payload);

      if (response.ok) {
        yield put(
          actions.fetchNewsArticleBySlug.done({
            params: payload,
            result: response.data
          })
        );
      } else {
        yield put(
          actions.fetchNewsArticleBySlug.failed({
            error: tryParseJson(response.message),
            params: payload
          })
        );
      }
    });
  };
