import { combineReducers } from "redux";

import appearances from "./appearances.reducers";
import news from "./news.reducers";
import page from "./page.reducers";
import releases from "./releases.reducers";

export default combineReducers({
  appearances,
  news,
  page,
  releases
});
