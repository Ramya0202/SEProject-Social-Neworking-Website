import { combineReducers } from "redux";

import authReducer from "./AuthReducer";
import contentReducer from "./ContentReducer";
import BucketReducer from "./BucketReducer";

export const reducers = combineReducers({
  authReducer,
  contentReducer,
  BucketReducer,
});
