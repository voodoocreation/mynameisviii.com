import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("APPEARANCES");

export const fetchAppearances = actionCreator.async<
  {},
  PLFetchAppearancesDone,
  PLFetchAppearancesFailed
>("FETCH");

export const fetchMoreAppearances = actionCreator.async<
  {},
  PLFetchAppearancesDone,
  PLFetchAppearancesFailed
>("FETCH_MORE");

export const fetchAppearanceBySlug = actionCreator.async<
  PLFetchAppearanceBySlugStarted,
  PLFetchAppearanceBySlugDone,
  PLFetchAppearanceBySlugFailed
>("FETCH_BY_SLUG");

export const geocodeCurrentAppearanceAddress = actionCreator.async<
  {},
  PLGeocodeCurrentAppearanceAddressDone,
  PLGeocodeCurrentAppearanceAddressFailed
>("GEOCODE_CURRENT_ADDRESS");

export const setCurrentAppearanceSlug = actionCreator<
  PLSetCurrentAppearanceSlug
>("SET_CURRENT_SLUG");
