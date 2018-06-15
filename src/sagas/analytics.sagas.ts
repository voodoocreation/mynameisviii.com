import { call, takeLatest } from "redux-saga/effects";

import * as actions from "../actions/root.actions";

export const trackAnalyticsEventSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.trackEvent, function*(action: {
      type: string;
      payload: PLTrackEvent;
    }) {
      yield call(ports.dataLayer.push, action.payload);
    });
  };
