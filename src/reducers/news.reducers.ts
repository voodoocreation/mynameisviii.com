import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: INewsReducers = {
  currentSlug: undefined,
  hasAllItems: false,
  isLoading: false,
  items: {},
  lastEvaluatedKey: undefined
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchLatestNews.failed,
      actions.fetchMoreLatestNews.failed,
      actions.fetchNewsArticleBySlug.failed
    ],
    state => ({
      ...state,
      isLoading: false
    })
  )

  .case(actions.fetchLatestNews.started, state => ({
    ...state,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchLatestNews.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: result.items,
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.fetchMoreLatestNews.started, state => ({
    ...state,
    isLoading: true
  }))

  .case(actions.fetchMoreLatestNews.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.lastEvaluatedKey,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    },
    lastEvaluatedKey: result.lastEvaluatedKey
  }))

  .case(actions.setCurrentNewsArticleSlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchNewsArticleBySlug.started, state => ({
    ...state,
    isLoading: true
  }))

  .case(actions.fetchNewsArticleBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
