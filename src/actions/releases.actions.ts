import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("RELEASES");

export const fetchReleases = actionCreator.async<
  {},
  PLFetchReleasesDone,
  PLFetchReleasesFailed
>("FETCH");

export const fetchMoreReleases = actionCreator.async<
  {},
  PLFetchReleasesDone,
  PLFetchReleasesFailed
>("FETCH_MORE");

export const fetchReleaseBySlug = actionCreator.async<
  PLFetchReleaseBySlugStarted,
  PLFetchReleaseBySlugDone,
  PLFetchReleaseBySlugFailed
>("FETCH_BY_SLUG");

export const setCurrentReleaseSlug = actionCreator<PLSetCurrentReleaseSlug>(
  "SET_CURRENT_SLUG"
);
