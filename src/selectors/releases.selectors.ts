import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getReleases = defaultMemoize(
  (state: IRootReducers) => state.releases.items
);

export const getReleasesCount = createSelector(
  getReleases,
  releases => Object.keys(releases).length
);

export const getReleasesAsArray = createSelector(getReleases, releases =>
  assocToArray(releases).sort(
    (a: IRelease, b: IRelease) => a.releasedOn > b.releasedOn
  )
);

export const getReleasesByType = createSelector(getReleasesAsArray, releases =>
  releases.reduce((acc: { [index: string]: any }, curr: IRelease) => {
    if (!acc[curr.type]) {
      acc[curr.type] = [];
    }
    acc[curr.type].push(curr);
    return acc;
  }, {})
);

export const getCurrentReleaseSlug = (state: IRootReducers) =>
  state.releases.currentSlug;

export const getCurrentRelease = createSelector(
  getReleases,
  getCurrentReleaseSlug,
  (releases, slug) => (slug ? releases[slug] : undefined)
);

export const getReleasesLastEvaluatedKey = (state: IRootReducers) =>
  state.releases.lastEvaluatedKey;

export const getReleasesLastEvaluatedKeyAsString = createSelector(
  getReleasesLastEvaluatedKey,
  lastEvaluatedKey =>
    !lastEvaluatedKey
      ? undefined
      : btoa(
          encodeURIComponent(
            JSON.stringify({
              IsActive: lastEvaluatedKey.isActive,
              ReleasedOn: lastEvaluatedKey.releasedOn,
              Slug: lastEvaluatedKey.slug
            })
          )
        )
);

export const getHasAllReleases = (state: IRootReducers) =>
  state.releases.hasAllItems;

export const getReleasesIsLoading = (state: IRootReducers) =>
  state.releases.isLoading;
