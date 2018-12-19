import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("FEATURES");

export const addFeatures = actionCreator<PLAddFeatures>("ADD");

export const removeFeatures = actionCreator<PLRemoveFeatures>("REMOVE");
