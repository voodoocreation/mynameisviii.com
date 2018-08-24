import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IAppearancesReducers = {
  currentLocation: undefined,
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
      actions.fetchAppearances.failed,
      actions.fetchMoreAppearances.failed,
      actions.fetchAppearanceBySlug.failed
    ],
    (state, { error }) => ({
      ...state,
      error,
      isLoading: false
    })
  )

  .case(actions.fetchAppearances.started, state => ({
    ...state,
    error: undefined,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchAppearances.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreAppearances.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchMoreAppearances.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentAppearanceSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchAppearanceBySlug.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchAppearanceBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }))

  .cases(
    [
      actions.setCurrentAppearanceSlug,
      actions.geocodeCurrentAppearanceAddress.started
    ],
    state => ({
      ...state,
      currentLocation: undefined
    })
  )

  .case(actions.geocodeCurrentAppearanceAddress.done, (state, { result }) => ({
    ...state,
    currentLocation: result
  }));
