import { call, takeLatest } from "redux-saga/effects";

import * as actions from "../actions/root.actions";

export const cachePageOnTransitionSaga = () =>
  function*() {
    yield takeLatest(actions.changeRoute.done, function*(action: {
      type: string;
      payload: { params: PLChangeRouteStarted; result: PLChangeRouteDone };
    }) {
      if ("serviceWorker" in navigator) {
        const serviceWorker = navigator.serviceWorker.controller;

        if (serviceWorker && serviceWorker.state === "activated") {
          yield call(serviceWorker.postMessage.bind(serviceWorker), {
            payload: action.payload.params,
            type: "changeRoute"
          });
        }
      }
    });
  };
