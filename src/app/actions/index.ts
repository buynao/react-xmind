import { createAction, createCustomAction } from "typesafe-actions";
import { INode, INodes } from "XmindTypes";        

export type IAddChildNodeInfo = {
  newNode: INode
}

export type ICurNode = {
  curNode: INode
}

// 1. 添加子节点
const ADD_CHILD = "XMIND/ADD_CHILD";
export const addChildNodeAction = createCustomAction(ADD_CHILD,
  (addNodeInfo: IAddChildNodeInfo) =>  addNodeInfo
);

// 2. 删除子节点
const DELETE_NODE = "XMIND/DELETE_NODE";
export const deleteNodeAction = createCustomAction(DELETE_NODE,
  (curNode: ICurNode) =>  curNode
);

// 2. 更新当前节点
const UPDATE_NODE = "XMIND/UPDATE_NODE";
export const updateNodeAction = createCustomAction(UPDATE_NODE,
  (curNode: ICurNode) =>  curNode
);

// 3. 更新当前节点
const UPDATE_NODES = "XMIND/UPDATE_NODES";
export const updateNodesAction = createCustomAction(UPDATE_NODES,
  (curNode: ICurNode) =>  curNode
);

// 3. 操作成功
const ACTION_SUCCESS = "XMIND/ACTION_SUCCESS";
export const actionSuccess = createCustomAction(ACTION_SUCCESS,
  (nodeList: INodes) =>  ({
    nodeList
  })
);

// 4. 操作成功
const SELECT_CUR_NODE = "XMIND/SELECT_CUR_NODE";
export const selectCurNodeAction = createCustomAction(SELECT_CUR_NODE,
  (curNode: INode) =>  ({
    curNode
  })
);
