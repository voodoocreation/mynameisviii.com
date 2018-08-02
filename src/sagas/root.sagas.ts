import { all, fork } from "redux-saga/effects";

import * as analytics from "./analytics.sagas";
import * as appearances from "./appearances.sagas";
import * as news from "./news.sagas";
import * as releases from "./releases.sagas";
import * as stems from "./stems.sagas";

const mapSagas = (ports: any, effect: any) => (sagas: any) =>
  Object.keys(sagas).reduce(
    (acc: any, curr: any) => [...acc, effect(sagas[curr](ports))],
    []
  );

export default (ports: IStorePorts) =>
  function*() {
    yield all(
      mapSagas(ports, fork)({
        ...analytics,
        ...appearances,
        ...news,
        ...releases,
        ...stems
      })
    );
  };
