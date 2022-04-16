import { createReducer } from "typesafe-actions";
import { combineReducers } from 'redux';
import { XmindNode } from "../../model/node";
import { INode, INodes, ConnectLine, IStore } from "XmindTypes";
import { actionSuccess, selectCurNodeAction, updateLayoutSuccessAction } from "../actions/index";
import { v4 as uuidv4 } from 'uuid';
import { INIT_LEFT, INIT_TOP } from '../constants';

interface IAction {
  type: string;
  nodeList: INodes;
  curNode: INode;
  nodesLine: ConnectLine[];
  layoutMode: string;
}

const reducers = combineReducers<IStore>({
    nodeList: createReducer([new XmindNode({
      content: '根节点',
      x: INIT_LEFT,
      y: INIT_TOP,
      id: uuidv4().slice(0, 8),
      isRoot: true,
    })])
    .handleAction(actionSuccess, (nodeList: INode, action: IAction) => action.nodeList),

    curNode: createReducer(null)
    .handleAction(selectCurNodeAction, (curNode: INode, action: IAction) => action.curNode),

    nodesLine: createReducer([])
    .handleAction(actionSuccess, (nodesLine: ConnectLine[], action: IAction) => action.nodesLine),

    layoutMode: createReducer('right')
    .handleAction(actionSuccess, (layoutMode: string, action: IAction) => action.layoutMode || layoutMode),
});

export default reducers;
