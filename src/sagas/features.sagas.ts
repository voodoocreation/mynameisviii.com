import { call, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";

import * as actions from "../actions/root.actions";

export const addFeaturesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.addFeatures, function*(
      action: Action<PLAddFeatures>
    ) {
      const featuresToAdd =
        typeof action.payload === "string" ? [action.payload] : action.payload;

      yield call(
        ports.features.push.bind(
          ports.features,
          ...featuresToAdd.filter(item => !ports.features.includes(item))
        )
      );
    });
  };

export const removeFeaturesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(actions.removeFeatures, function*(
      action: Action<PLRemoveFeatures>
    ) {
      const featuresToRemove =
        typeof action.payload === "string" ? [action.payload] : action.payload;

      for (const feature of featuresToRemove) {
        yield call(
          ports.features.splice.bind(ports.features),
          ports.features.indexOf(feature),
          1
        );
      }
    });
  };
