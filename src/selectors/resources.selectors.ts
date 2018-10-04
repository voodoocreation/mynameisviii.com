import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getResourcesError = (state: IRootReducers) =>
  state.resources.error;

export const getResources = defaultMemoize(
  (state: IRootReducers) => state.resources.items
);

export const getResourcesCount = createSelector(
  getResources,
  resources => Object.keys(resources).length
);

export const getResourcesAsArray = createSelector(getResources, resources =>
  assocToArray(resources).sort(
    (a: IResource, b: IResource) => a.createdAt > b.createdAt
  )
);

export const getResourcesByType = createSelector(
  getResourcesAsArray,
  resources =>
    resources.reduce((acc: { [index: string]: any }, curr: IResource) => {
      if (!acc[curr.type]) {
        acc[curr.type] = [];
      }
      acc[curr.type].push(curr);
      return acc;
    }, {})
);

export const getResourcesLastEvaluatedKey = (state: IRootReducers) =>
  state.resources.lastEvaluatedKey;

export const getResourcesLastEvaluatedKeyAsString = createSelector(
  getResourcesLastEvaluatedKey,
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

export const getHasAllResources = (state: IRootReducers) =>
  state.resources.hasAllItems;

export const getResourcesIsLoading = (state: IRootReducers) =>
  state.resources.isLoading;
