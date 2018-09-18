export const getCurrentRoute = (state: IRootReducers) =>
  state.page.currentRoute;

export const getPageError = (state: IRootReducers) => state.page.error;

export const getPageIsLoading = (state: IRootReducers) => state.page.isLoading;

export const hasNewVersion = (state: IRootReducers) => state.page.hasNewVersion;

export const isNavOpen = (state: IRootReducers) => state.page.isNavOpen;

export const isOnline = (state: IRootReducers) => state.page.isOnline;
