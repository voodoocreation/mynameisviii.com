import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("GALLERIES");

export const fetchGalleries = actionCreator.async<
  {},
  PLFetchGalleriesDone,
  PLFetchGalleriesFailed
>("FETCH");

export const fetchMoreGalleries = actionCreator.async<
  {},
  PLFetchGalleriesDone,
  PLFetchGalleriesFailed
>("FETCH_MORE");

export const fetchGalleryBySlug = actionCreator.async<
  PLFetchGalleryBySlugStarted,
  PLFetchGalleryBySlugDone,
  PLFetchGalleryBySlugFailed
>("FETCH_BY_SLUG");

export const setCurrentGallerySlug = actionCreator<PLSetCurrentGallerySlug>(
  "SET_CURRENT_SLUG"
);
