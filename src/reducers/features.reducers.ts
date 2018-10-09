import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IFeaturesReducers = {
  items: []
};

export default reducerWithInitialState(initialState)
  .case(actions.addFeature, (state, payload) => ({
    ...state,
    items: [
      ...state.items,
      ...[payload].filter(item => !state.items.includes(item))
    ]
  }))

  .case(actions.addFeatures, (state, payload) => ({
    ...state,
    items: [
      ...state.items,
      ...payload.filter(item => !state.items.includes(item))
    ]
  }))

  .case(actions.removeFeature, (state, payload) => ({
    ...state,
    items: state.items.filter(item => item !== payload)
  }))

  .case(actions.removeFeatures, (state, payload) => ({
    ...state,
    items: state.items.filter(item => !payload.includes(item))
  }));
