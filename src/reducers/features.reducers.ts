import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IFeaturesReducers = {
  items: []
};

export default reducerWithInitialState(initialState)
  .case(actions.addFeature, (state, payload) => ({
    ...state,
    items: [...state.items, payload]
  }))

  .case(actions.addFeatures, (state, payload) => ({
    ...state,
    items: [...state.items, ...payload]
  }))

  .case(actions.removeFeature, (state, payload) => ({
    ...state,
    items: state.items.filter(item => item !== payload)
  }))

  .case(actions.removeFeatures, (state, payload) => ({
    ...state,
    items: state.items.filter(item => !payload.includes(item))
  }));
