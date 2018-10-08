import { combineReducers } from "redux";

import appearances from "./appearances.reducers";
import features from "./features.reducers";
import galleries from "./galleries.reducers";
import news from "./news.reducers";
import page from "./page.reducers";
import releases from "./releases.reducers";
import resources from "./resources.reducers";
import stems from "./stems.reducers";

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
