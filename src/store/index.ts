

import { ActionType } from 'typesafe-actions';
import { applyMiddleware, compose, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";
import * as dependencies from "../app/control/index";

import rootEpic from "./root-epics";
import * as actions from  "./root-actions";
import reducers from "./root-reducers";
import { IStore } from "XmindTypes";

export type RootState = IStore;
export type ActionsType = ActionType<typeof actions>;

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: Function;
  }
}

const epicMiddleware = createEpicMiddleware<
    ActionsType,
    ActionsType,
    RootState
  >({
  dependencies
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create store
function configureStore(initialState?: RootState) {
  // configure middlewares
  const middlewares = [epicMiddleware];
  // compose enhancers
  const enhancer = composeEnhancers(applyMiddleware(...middlewares));
  // create store
  return createStore(reducers, enhancer);
}

const store = configureStore();

epicMiddleware.run(rootEpic); // 必须放在store生成后启动

export default store;
