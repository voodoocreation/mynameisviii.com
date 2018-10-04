import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("RESOURCES");

export const fetchResources = actionCreator.async<
  {},
  PLFetchResourcesDone,
  PLFetchResourcesFailed
>("FETCH");

export const fetchMoreResources = actionCreator.async<
  {},
  PLFetchResourcesDone,
  PLFetchResourcesFailed
>("FETCH_MORE");
