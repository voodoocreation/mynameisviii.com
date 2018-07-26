import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IPageReducers = {
  currentRoute: undefined,
  error: undefined,
  isLoading: false,
  isNavOpen: false,
  transitioningTo: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchAppearances.failed,
      actions.fetchMoreAppearances.failed,
      actions.fetchLatestNews.failed,
      actions.fetchMoreLatestNews.failed,
      actions.fetchReleases.failed,
      actions.fetchMoreReleases.failed
    ],
    (state, { error }) => ({
      ...state,
      error
    })
  )

  .cases(
    [
      actions.fetchAppearanceBySlug.failed,
      actions.fetchNewsArticleBySlug.failed,
      actions.fetchReleaseBySlug.failed
    ],
    (state, { error }) => ({
      ...state,
      error
    })
  )

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
