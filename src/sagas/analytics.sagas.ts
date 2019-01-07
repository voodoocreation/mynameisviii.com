import { call, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";

import * as actions from "../actions/root.actions";

export const trackAnalyticsEventSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.trackEvent, function*(
      action: Action<PLTrackEvent>
    ) {
      yield call(ports.dataLayer.push.bind(ports.dataLayer), action.payload);
    });
  };
