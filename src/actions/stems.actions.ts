import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("STEMS");

export const fetchStems = actionCreator.async<
  {},
  PLFetchStemsDone,
  PLFetchStemsFailed
>("FETCH");

export const fetchMoreStems = actionCreator.async<
  {},
  PLFetchStemsDone,
  PLFetchStemsFailed
>("FETCH_MORE");
