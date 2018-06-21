import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("PAGE");

export const toggleNavigation = actionCreator<{}>("TOGGLE_NAVIGATION");

export const changeRoute = actionCreator.async<
  PLChangeRouteStarted,
  PLChangeRouteDone,
  PLChangeRouteFailed
>("CHANGE_ROUTE");
