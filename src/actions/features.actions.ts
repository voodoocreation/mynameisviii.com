import actionCreatorFactory from "typescript-fsa";

const actionCreator = actionCreatorFactory("FEATURES");

export const addFeature = actionCreator<PLAddFeature>("ADD_ONE");

export const addFeatures = actionCreator<PLAddFeatures>("ADD_MULTIPLE");

export const removeFeature = actionCreator<PLRemoveFeature>("REMOVE_ONE");

export const removeFeatures = actionCreator<PLRemoveFeatures>(
  "REMOVE_MULTIPLE"
);
