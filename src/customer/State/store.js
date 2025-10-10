import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import authReducer from "./Auth/Reducer";
import { customerProductReducer } from "./Products/Reducer";

const rootReducer = combineReducers({
    auth: authReducer,
    product:customerProductReducer,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
export default store;