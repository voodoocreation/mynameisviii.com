import { all, fork } from "redux-saga/effects";

import * as analytics from "./analytics.sagas";
import * as appearances from "./appearances.sagas";
import * as news from "./news.sagas";
import * as releases from "./releases.sagas";

const mapSagas = (ports: any, effect: any) => (arr: any) =>
  arr.reduce((acc: any, curr: any) => [...acc, effect(curr(ports))], []);

export default (ports: IStorePorts) =>
  function*() {
    yield all(
      mapSagas(ports, fork)([
        analytics.trackAnalyticsEventSaga,
        appearances.fetchAppearancesSaga,
        appearances.fetchMoreAppearancesSaga,
        appearances.fetchAppearanceBySlugSaga,
        news.fetchLatestNewsSaga,
        news.fetchMoreLatestNewsSaga,
        news.fetchNewsArticleBySlugSaga,
        releases.fetchReleasesSaga,
        releases.fetchMoreReleasesSaga,
        releases.fetchReleaseBySlugSaga
      ])
    );
  };
