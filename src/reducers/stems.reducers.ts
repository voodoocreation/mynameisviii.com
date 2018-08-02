import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IStemsReducers = {
  hasAllItems: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases([actions.fetchStems.failed, actions.fetchMoreStems.failed], state => ({
    ...state,
    isLoading: false
  }))

  .case(actions.fetchStems.started, state => ({
    ...state,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchStems.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreStems.started, state => ({
    ...state,
    isLoading: true
  }))

  .case(actions.fetchMoreStems.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }));
