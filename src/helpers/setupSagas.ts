import merge from "lodash.merge";
import { AnyAction } from "redux";
import SagaTester from "redux-saga-tester";
import { ActionCreator } from "typescript-fsa";

import rootReducer, {
  initialState as rootInitialState
} from "../reducers/root.reducers";
import rootSaga from "../sagas/root.sagas";

const g: any = global;

export default (fromTestStore = {}, fromTestPorts = {}) => {
  const initialState = merge({}, rootInitialState, fromTestStore);
  const ports = merge(
    {
      api: {},
      dataLayer: g.dataLayer,
      features: g.features,
      maps: { ...g.google.maps }
    },
    fromTestPorts
  );

  const sagaTester = new SagaTester({
    initialState,
    reducers: rootReducer
  });
  sagaTester.start(rootSaga(ports));

  return {
    dispatch: (action: AnyAction) => sagaTester.dispatch(action),
    filterAction: (actionFromTest: ActionCreator<any>) =>
      sagaTester
        .getCalledActions()
        .filter(action => action.type === actionFromTest.type),
    ports,
    sagaTester,
    store: () => sagaTester.getState()
  };
};
