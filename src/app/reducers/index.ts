import { createReducer } from "typesafe-actions";
import { combineReducers } from 'redux';
import { XmindNode } from "../../model/node";
import { INode, INodes, ConnectLine } from "XmindTypes";
import { actionSuccess, selectCurNodeAction, ConnectLineSuccessAction } from "../actions/index";
import { v4 as uuidv4 } from 'uuid';

export interface IStore {
  nodeList: INodes;
  curNode: INode;
  connectLine: ConnectLine[]
}

interface IAction {
  type: string;
  nodeList: INodes;
  curNode: INode;
  nodesLine: ConnectLine[]
}

const reducers = combineReducers({
    nodeList: createReducer([new XmindNode({
      content: '根节点',
      x: 400,
      y: 500,
      id: uuidv4().slice(0, 8)
    })])
    .handleAction(actionSuccess, (nodeList: INode, action: IAction) => action.nodeList),

    curNode: createReducer(null)
    .handleAction(selectCurNodeAction, (curNode: INode, action: IAction) => action.curNode),

    nodesLine: createReducer([])
    .handleAction(actionSuccess, (nodesLine: ConnectLine[], action: IAction) => action.nodesLine),
});

export default reducers;
