import { reducerWithInitialState } from "typescript-fsa-reducers";

import * as actions from "../actions/root.actions";

export const initialState: IGalleriesReducers = {
  currentSlug: undefined,
  error: undefined,
  hasAllItems: false,
  isLoading: false,
  items: {}
};

export default reducerWithInitialState(initialState)
  .cases(
    [
      actions.fetchGalleries.failed,
      actions.fetchMoreGalleries.failed,
      actions.fetchGalleryBySlug.failed
    ],
    (state, { error }) => ({
      ...state,
      error,
      isLoading: false
    })
  )

  .case(actions.fetchGalleries.started, state => ({
    ...state,
    error: undefined,
    isLoading: true,
    items: {}
  }))

  .case(actions.fetchGalleries.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.isTruncated,
    isLoading: false,
    items: result.items
  }))

  .case(actions.fetchMoreGalleries.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchMoreGalleries.done, (state, { result }) => ({
    ...state,
    hasAllItems: !result.isTruncated,
    isLoading: false,
    items: {
      ...state.items,
      ...result.items
    }
  }))

  .case(actions.setCurrentGallerySlug, (state, payload) => ({
    ...state,
    currentSlug: payload
  }))

  .case(actions.fetchGalleryBySlug.started, state => ({
    ...state,
    error: undefined,
    isLoading: true
  }))

  .case(actions.fetchGalleryBySlug.done, (state, { result }) => ({
    ...state,
    isLoading: false,
    items: {
      ...state.items,
      [result.slug]: result
    }
  }));
