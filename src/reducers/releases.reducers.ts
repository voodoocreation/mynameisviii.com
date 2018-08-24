import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IReleasesReducers = {
  currentSlug: undefined,
  error: undefined,
  hasAllItems: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchReleases.failed,
      actions.fetchMoreReleases.failed,
      actions.fetchReleaseBySlug.failed
    ],
    (state, { error }) => ({
      ...state,
      error,
      isLoading: false
    })
  )

  .case(actions.fetchReleases.started, state => ({
    ...state,
    error: undefined,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchReleases.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreReleases.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchMoreReleases.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentReleaseSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchReleaseBySlug.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchReleaseBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
