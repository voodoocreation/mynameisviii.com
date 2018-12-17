import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getStemsError = (state: IRootReducers) => state.stems.error;

export const getStems = defaultMemoize(
  (state: IRootReducers) => state.stems.items
);

export const getStemsCount = createSelector(
  getStems,
  stems => Object.keys(stems).length
);

export const getStemsAsArray = createSelector(
  getStems,
  stems =>
    assocToArray(stems).sort((a: IStem, b: IStem) => a.createdAt > b.createdAt)
);

export const getStemsLastEvaluatedKey = (state: IRootReducers) =>
  state.stems.lastEvaluatedKey;

export const getStemsLastEvaluatedKeyAsString = createSelector(
  getStemsLastEvaluatedKey,
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

export const getHasAllStems = (state: IRootReducers) => state.stems.hasAllItems;

export const getStemsIsLoading = (state: IRootReducers) =>
  state.stems.isLoading;
