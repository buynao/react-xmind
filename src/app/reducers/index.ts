import { createReducer } from "typesafe-actions";
import { combineReducers } from 'redux';
import { IXmindNode, XmindNode } from "../../model/node";
import { actionSuccessAction } from "../actions/index";

export interface IStore {
  root: IXmindNode[];
}

interface IAction {
  type: string;
  root: IXmindNode[];
}

const reducers = combineReducers({
    root: createReducer([new XmindNode({
      content: '根节点',
      x: 0,
      y: 0
    })])
    .handleAction(actionSuccessAction, (root: IXmindNode, action: IAction) => action.root)
});

export default reducers;
