import { call, put, select, takeLatest } from "redux-saga/effects";

import { arrayToAssoc, tryParseJson } from "../domain/transformData";

import * as actions from "../actions/root.actions";
import * as selectors from "../selectors/root.selectors";

export const fetchLatestNewsSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.fetchLatestNews.started, function*() {
      const res = yield call(ports.api.fetchLatestNews, 3);

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
        };
        yield put(actions.fetchLatestNews.done({ result, params: {} }));
      } else {
        yield put(
          actions.fetchLatestNews.failed({ error: res.message, params: {} })
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

      const res = yield call(ports.api.fetchLatestNews, 2, lastEvaluatedKey);

      if (res.ok) {
        const result = {
          ...res.data,
          items: arrayToAssoc(res.data.items, "slug")
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
          actions.fetchMoreLatestNews.failed({ error: res.message, params: {} })
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
      const res = yield call(ports.api.fetchNewsArticleBySlug, payload);

      if (res.ok) {
        yield put(
          actions.fetchNewsArticleBySlug.done({
            params: payload,
            result: res.data
          })
        );
      } else {
        yield put(
          actions.fetchNewsArticleBySlug.failed({
            error: tryParseJson(res.message),
            params: payload
          })
        );
      }
    });
  };
