import { combineReducers } from "redux";

import appearances, {
  initialState as initialAppearances
} from "./appearances.reducers";
import features, { initialState as initialFeatures } from "./features.reducers";
import galleries, {
  initialState as initialGalleries
} from "./galleries.reducers";
import news, { initialState as initialNews } from "./news.reducers";
import page, { initialState as initialPage } from "./page.reducers";
import releases, { initialState as initialReleases } from "./releases.reducers";
import resources, {
  initialState as initialResources
} from "./resources.reducers";
import stems, { initialState as initialStems } from "./stems.reducers";

export default combineReducers({
  appearances,
  features,
  galleries,
  news,
  page,
  releases,
  resources,
  stems
});

export const initialState: IRootReducers = {
  appearances: initialAppearances,
  features: initialFeatures,
  galleries: initialGalleries,
  news: initialNews,
  page: initialPage,
  releases: initialReleases,
  resources: initialResources,
  stems: initialStems
};
