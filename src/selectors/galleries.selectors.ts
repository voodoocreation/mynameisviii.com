import { createSelector, defaultMemoize } from "reselect";
import { assocToArray } from "../transformers/transformData";

export const getGalleriesError = (state: IRootReducers) =>
  state.galleries.error;

export const getGalleries = defaultMemoize(
  (state: IRootReducers) => state.galleries.items
);

export const getGalleriesCount = createSelector(
  getGalleries,
  galleries => Object.keys(galleries).length
);

export const getGalleriesAsArray = createSelector(
  getGalleries,
  galleries =>
    assocToArray(galleries).sort(
      (a: IGallery, b: IGallery) => a.modifiedAt < b.modifiedAt
    )
);

export const getCurrentGallerySlug = (state: IRootReducers) =>
  state.galleries.currentSlug;

export const getCurrentGallery = createSelector(
  getGalleries,
  getCurrentGallerySlug,
  (galleries, slug) => (slug ? galleries[slug] : undefined)
);

export const getCurrentGalleryImages = createSelector(
  getCurrentGallery,
  gallery => gallery && gallery.images
);

export const getGalleriesLastKey = createSelector(
  getGalleries,
  getGalleriesCount,
  (galleries, galleriesCount) => Object.keys(galleries)[galleriesCount - 1]
);

export const getHasAllGalleries = (state: IRootReducers) =>
  state.galleries.hasAllItems;

export const getGalleriesIsLoading = (state: IRootReducers) =>
  state.galleries.isLoading;
