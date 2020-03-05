import actionCreatorFactory from "typescript-fsa";

const createAction = actionCreatorFactory("ANALYTICS");

export const trackEvent = createAction<{
  [index: string]: any;
  event: string;
}>("TRACK_EVENT");
