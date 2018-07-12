import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getAppearances = defaultMemoize(
  (state: IRootReducers) => state.appearances.items
);

export const getAppearancesCount = createSelector(
  getAppearances,
  appearances => Object.keys(appearances).length
);

export const getAppearancesAsArray = createSelector(
  getAppearances,
  appearances =>
    assocToArray(appearances).sort(
      (a: IAppearance, b: IAppearance) => a.startingAt > b.startingAt
    )
);

export const getUpcomingAppearances = createSelector(
  getAppearancesAsArray,
  appearances =>
    appearances.filter(
      (appearance: IAppearance) =>
        appearance.finishingAt > new Date().toISOString()
    )
);

export const getPastAppearances = createSelector(
  getAppearancesAsArray,
  appearances =>
    appearances.filter(
      (appearance: IAppearance) =>
        appearance.finishingAt <= new Date().toISOString()
    )
);

export const getCurrentAppearanceSlug = (state: IRootReducers) =>
  state.appearances.currentSlug;

export const getCurrentAppearance = createSelector(
  getAppearances,
  getCurrentAppearanceSlug,
  (appearances, slug) => (slug ? appearances[slug] : undefined)
);

export const getAppearancesLastEvaluatedKey = (state: IRootReducers) =>
  state.appearances.lastEvaluatedKey;

export const getAppearancesLastEvaluatedKeyAsString = createSelector(
  getAppearancesLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              IsActive: lastEvaluatedKey.isActive,
              Slug: lastEvaluatedKey.slug,
              StartingAt: lastEvaluatedKey.startingAt
            })
          )
        )
);

export const getHasAllAppearances = (state: IRootReducers) =>
  state.appearances.hasAllItems;

export const getAppearancesIsLoading = (state: IRootReducers) =>
  state.appearances.isLoading;

export const getAppearancePriceRange = (appearance: IAppearance) =>
  appearance.sales
    .sort((a, b) => a.price - b.price)
    .reduce((acc: IPriceRange, curr) => {
      if (!acc.min || curr.price < acc.min.price) {
        acc.min = curr;
      } else if (
        (acc.max && curr.price > acc.max.price) ||
        (!acc.max && acc.min && curr.price > acc.min.price)
      ) {
        acc.max = curr;
      }

      return acc;
    }, {});

export const getCurrentAppearanceLocation = (state: IRootReducers) =>
  state.appearances.currentLocation;
