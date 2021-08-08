import { createReducer } from "typesafe-actions";
import { combineReducers } from 'redux';
import { IXmindNode, XmindNode } from "../../model/node";
import { actionSuccessAction } from "../actions/index";

export interface IStore {
  root: IXmindNode;
}

interface IAction {
  type: string;
  payload: any;
}

const reducers = combineReducers({
    root: createReducer(new XmindNode({
      content: '根节点'
    }))
    .handleAction(actionSuccessAction, (root: IXmindNode) => {
      console.log('reduce_root', root);;
      return {...root};
    })
});

export default reducers;
