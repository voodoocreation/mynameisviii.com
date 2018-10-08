export const getFeatures = (state: IRootReducers) => state.features.items;

export const getFeature = (state: IRootReducers, feature: string) =>
  getFeatures(state).includes(feature);
