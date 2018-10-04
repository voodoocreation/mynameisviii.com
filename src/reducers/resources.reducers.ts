import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IResourcesReducers = {
  error: undefined,
  hasAllItems: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [actions.fetchResources.failed, actions.fetchMoreResources.failed],
    (state, { error }) => ({
      ...state,
      error,
      isLoading: false
    })
  )

  .case(actions.fetchResources.started, state => ({
    ...state,
    error: undefined,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchResources.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreResources.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchMoreResources.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }));
