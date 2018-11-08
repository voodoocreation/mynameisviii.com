import merge from "lodash.merge";
import SagaTester from "redux-saga-tester";

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
      maps: g.google.maps
    },
    fromTestPorts
  );

  const sagaTester = new SagaTester({
    initialState,
    reducers: rootReducer
  });
  sagaTester.start(rootSaga(ports));

  return {
    dispatch: (action: any) => sagaTester.dispatch(action),
    findAction: (actionFromTest: any) =>
      sagaTester
        .getCalledActions()
        .find((action: any) => action.type === actionFromTest().type),
    sagaTester,
    store: () => sagaTester.getState()
  };
};
