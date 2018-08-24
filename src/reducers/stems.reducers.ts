import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IStemsReducers = {
  error: undefined,
  hasAllItems: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [actions.fetchStems.failed, actions.fetchMoreStems.failed],
    (state, { error }) => ({
      ...state,
      error,
      isLoading: false
    })
  )

  .case(actions.fetchStems.started, state => ({
    ...state,
    error: undefined,
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
    error: undefined,
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
