import { createReducer } from "typesafe-actions";
import { combineReducers } from 'redux';
import { IXmindNode, XmindNode } from "../../model/node";
import { actionSuccessAction, selectCurNodeAction } from "../actions/index";
import { v4 as uuidv4 } from 'uuid';

export interface IStore {
  nodeList: IXmindNode[];
  curNode: IXmindNode;
}

interface IAction {
  type: string;
  nodeList: IXmindNode[];
  curNode: IXmindNode;
}

const reducers = combineReducers({
    nodeList: createReducer([new XmindNode({
      content: '根节点',
      x: 0,
      y: 300,
      id: uuidv4().slice(0, 8),
      minHeight: 0
    })])
    .handleAction(actionSuccessAction, (nodeList: IXmindNode, action: IAction) => action.nodeList),
    curNode: createReducer(null)
    .handleAction(selectCurNodeAction, (curNode: IXmindNode, action: IAction) => action.curNode)
});

export default reducers;
