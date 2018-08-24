import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("PAGE");

export const toggleNavigation = actionCreator<{}>("TOGGLE_NAVIGATION");

export const updateOnlineStatus = actionCreator<PLUpdateOnlineStatus>(
  "UPDATE_ONLINE_STATUS"
);

export const setCurrentRoute = actionCreator<PLSetCurrentRoute>(
  "SET_CURRENT_ROUTE"
);
export const changeRoute = actionCreator.async<
  PLChangeRouteStarted,
  PLChangeRouteDone,
  PLChangeRouteFailed
>("CHANGE_ROUTE");
