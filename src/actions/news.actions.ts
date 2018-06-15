import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("NEWS");

export const fetchLatestNews = actionCreator.async<
  {},
  PLFetchLatestNewsDone,
  PLFetchLatestNewsFailed
>("FETCH");

export const fetchMoreLatestNews = actionCreator.async<
  {},
  PLFetchLatestNewsDone,
  PLFetchLatestNewsFailed
>("FETCH_MORE");

export const fetchNewsArticleBySlug = actionCreator.async<
  PLFetchNewsArticleBySlugStarted,
  PLFetchNewsArticleBySlugDone,
  PLFetchNewsArticleBySlugFailed
>("FETCH_BY_SLUG");

export const setCurrentNewsArticleSlug = actionCreator<
  PLSetCurrentNewsArticleSlug
>("SET_CURRENT_SLUG");
