import { call, put, takeLatest } from "redux-saga/effects";
import { Action, Success } from "typescript-fsa";

import * as actions from "../actions/root.actions";

export const cachePageOnTransitionSaga = () =>
  function*() {
    yield takeLatest(actions.changeRoute.done, function*(
      action: Action<Success<PLChangeRouteStarted, PLChangeRouteDone>>
    ) {
      if ("serviceWorker" in navigator && navigator.serviceWorker) {
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

export const receiveServiceWorkerMessageSaga = () =>
  function*() {
    yield takeLatest(actions.receiveServiceWorkerMessage, function*(
      action: Action<PLReceiveServiceWorkerMessage>
    ) {
      switch (action.payload.type) {
        case "serviceWorker.activate":
          yield put(actions.setHasNewVersion(true));
          break;
      }
    });
  };
