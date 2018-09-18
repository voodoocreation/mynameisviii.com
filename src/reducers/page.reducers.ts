import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IPageReducers = {
  currentRoute: undefined,
  error: undefined,
  hasNewVersion: false,
  isLoading: false,
  isNavOpen: false,
  isOnline: true,
  transitioningTo: undefined
};

export default reducerWithInitialState(initialState)
  .case(actions.updateOnlineStatus, (state, payload) => ({
    ...state,
    isOnline: payload
  }))

  .case(actions.setHasNewVersion, (state, payload) => ({
    ...state,
    hasNewVersion: payload
  }))

  .case(actions.toggleNavigation, state => ({
    ...state,
    isNavOpen: !state.isNavOpen
  }))

  .case(actions.setCurrentRoute, (state, payload) => ({
    ...state,
    currentRoute: payload
  }))

  .case(actions.changeRoute.started, (state, payload) => ({
    ...state,
    error: undefined,
    isLoading: true,
    isNavOpen: false,
    transitioningTo: payload
  }))

  .case(actions.changeRoute.done, (state, { params }) => ({
    ...state,
    currentRoute: params,
    isLoading: false,
    transitioningTo: undefined
  }))

  .case(actions.changeRoute.failed, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
    transitioningTo: undefined
  }));
