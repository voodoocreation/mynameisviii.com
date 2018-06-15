import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("ANALYTICS");

export const trackEvent = actionCreator<PLTrackEvent>("TRACK_EVENT");
