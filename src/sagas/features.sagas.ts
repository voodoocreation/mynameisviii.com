import { call, takeLatest } from "redux-saga/effects";

import * as actions from "../actions/root.actions";

export const addFeaturesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(
      [actions.addFeature, actions.addFeatures],
      function*(action: {
        type: string;
        payload: PLAddFeature | PLAddFeatures;
      }) {
        const featuresToAdd =
          typeof action.payload === "string"
            ? [action.payload]
            : action.payload;

        yield call(
          ports.features.push.bind(
            ports.features,
            ...featuresToAdd.filter(item => !ports.features.includes(item))
          )
        );
      }
    );
  };

export const removeFeaturesSaga = (ports: IStorePorts) =>
  function*() {
    yield takeLatest(
      [actions.removeFeature, actions.removeFeatures],
      function*(action: {
        type: string;
        payload: PLRemoveFeature | PLRemoveFeatures;
      }) {
        const featuresToRemove =
          typeof action.payload === "string"
            ? [action.payload]
            : action.payload;

        for (const feature of featuresToRemove) {
          yield call(
            ports.features.splice.bind(ports.features),
            ports.features.indexOf(feature),
            1
          );
        }
      }
    );
  };
