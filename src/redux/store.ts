import { createStore, combineReducers } from "redux";

const AppReducer = combineReducers({
  dummy: () => ({}),
});

const store = createStore(AppReducer);

export default store;
