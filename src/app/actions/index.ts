import { createAction, createCustomAction } from "typesafe-actions";
import { IXmindNode } from "../../model/node";        

export type IAddChildNodeInfo = {
  newNode: IXmindNode
}

export type IDeleteNodeInfo = {
  curNode: IXmindNode
}

// 1. 添加子节点
const ADD_CHILD = "XMIND/ADD_CHILD";
export const addChildNodeAction = createCustomAction(ADD_CHILD,
  (addNodeInfo: IAddChildNodeInfo) =>  addNodeInfo
);

// 2. 删除子节点
const DELETE_NODE = "XMIND/DELETE_NODE";
export const deleteNodeAction = createCustomAction(DELETE_NODE,
  (deleteNodeInfo: IDeleteNodeInfo) =>  deleteNodeInfo
);

// 3. 操作成功
const ACTION_SUCCESS = "XMIND/ACTION_SUCCESS";
export const actionSuccessAction = createCustomAction(ACTION_SUCCESS,
  (root: IXmindNode[], length?: number) =>  ({
    root,
    length
  })
);
