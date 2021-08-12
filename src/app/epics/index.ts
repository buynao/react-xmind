

import { Epic } from "redux-observable";
import { filter, map } from "rxjs/operators";

import { isActionOf } from "typesafe-actions";
import { RootState, ActionsType } from "../../store/index";
import { IXmindNode } from "../../model/node";
import * as controls from "../control";
import { ICurNode, IAddChildNodeInfo,
  actionSuccessAction, addChildNodeAction, deleteNodeAction, updateNodeAction, updateNodesAction } from "../actions";

type RootEpic = Epic<
  ActionsType,
  ActionsType,
  RootState,
  typeof controls
>;

export const addChildNodeEpic: RootEpic = (action$, store, { addNode }) =>
  action$.pipe(
    filter(isActionOf(addChildNodeAction)),
    map((nodeInfo: IAddChildNodeInfo) => addNode(nodeInfo, store.value)),
    map((root: IXmindNode[]) => actionSuccessAction(root))
  )

export const deleteNodeEpic: RootEpic = (action$, store, { deleteNode }) =>
  action$.pipe(
    filter(isActionOf(deleteNodeAction)),
    map((nodeInfo: ICurNode) => deleteNode(nodeInfo, store.value)),
    map((root: IXmindNode[]) => actionSuccessAction(root))
  )

export const updateNodeEpic: RootEpic = (action$, store, { updateNode }) =>
  action$.pipe(
    filter(isActionOf(updateNodeAction)),
    map((nodeInfo: ICurNode) => updateNode(nodeInfo, store.value)),
    map((root: IXmindNode[]) => actionSuccessAction(root))
  )

export const updateNodesEpic: RootEpic = (action$, store, { updateNodesControl }) =>
  action$.pipe(
    filter(isActionOf(updateNodesAction)),
    map((nodeInfo: ICurNode) => updateNodesControl(store.value.nodeList)),
    map((root: IXmindNode[]) => actionSuccessAction(root))
  )