import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getNewsError = (state: IRootReducers) => state.news.error;

export const getNewsArticles = defaultMemoize(
  (state: IRootReducers) => state.news.items
);

export const getNewsArticlesCount = createSelector(
  getNewsArticles,
  articles => Object.keys(articles).length
);

export const getNewsArticlesAsArray = createSelector(
  getNewsArticles,
  articles =>
    assocToArray(articles).sort(
      (a: INewsArticle, b: INewsArticle) => a.createdAt < b.createdAt
    )
);

export const getCurrentNewsArticleSlug = (state: IRootReducers) =>
  state.news.currentSlug;

export const getCurrentNewsArticle = createSelector(
  getNewsArticles,
  getCurrentNewsArticleSlug,
  (articles, slug) => (slug ? articles[slug] : undefined)
);

export const getNewsLastEvaluatedKey = (state: IRootReducers) =>
  state.news.lastEvaluatedKey;

export const getNewsLastEvaluatedKeyAsString = createSelector(
  getNewsLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              CreatedAt: lastEvaluatedKey.createdAt,
              IsActive: lastEvaluatedKey.isActive,
              Slug: lastEvaluatedKey.slug
            })
          )
        )
);

export const getHasAllNewsArticles = (state: IRootReducers) =>
  state.news.hasAllItems;

export const getNewsIsLoading = (state: IRootReducers) => state.news.isLoading;
