

import { Epic } from "redux-observable";
import { filter, map } from "rxjs/operators";

import { isActionOf } from "typesafe-actions";
import { RootState, ActionsType } from "../../store/index";
import { ConnectLine, INode, Direction } from "XmindTypes";
import * as controls from "../control";
import { ICurNode, IAddChildNodeInfo,
  actionSuccess, addChildNodeAction, deleteNodeAction, updateNodeAction, updateNodesAction, updateLayoutAction,
  updateLayoutSuccessAction } from "../actions";

type RootEpic = Epic<
  ActionsType,
  ActionsType,
  RootState,
  typeof controls
>;
type ActionResult = {
  nodeList: Required<INode>[];
  nodesLine: ConnectLine[];
  layoutMode?: Direction;
}
export const addChildNodeEpic: RootEpic = (action$, store, { addNode }) =>
  action$.pipe(
    filter(isActionOf(addChildNodeAction)),
    map((nodeInfo: IAddChildNodeInfo) => addNode(nodeInfo, store.value)),
    map((result: ActionResult) => actionSuccess(result.nodeList, result.nodesLine))
  )

export const deleteNodeEpic: RootEpic = (action$, store, { deleteNode }) =>
  action$.pipe(
    filter(isActionOf(deleteNodeAction)),
    map((nodeInfo: ICurNode) => deleteNode(nodeInfo, store.value)),
    map((result: ActionResult) => actionSuccess(result.nodeList, result.nodesLine, result.layoutMode))
  )

export const updateNodeEpic: RootEpic = (action$, store, { updateNode }) =>
  action$.pipe(
    filter(isActionOf(updateNodeAction)),
    map((nodeInfo: ICurNode) => updateNode(nodeInfo, store.value)),
    map((result: ActionResult) => actionSuccess(result.nodeList, result.nodesLine, result.layoutMode))
  )

export const updateNodesEpic: RootEpic = (action$, store, { updateNodesControl }) =>
  action$.pipe(
    filter(isActionOf(updateNodesAction)),
    map(() => updateNodesControl(store.value.nodeList, null, store.value.layoutMode)),
    map((result: ActionResult) => actionSuccess(result.nodeList, result.nodesLine, result.layoutMode))
  )

export const updateLayoutEpic: RootEpic = (action$, store, { updateNodesControl }) =>
  action$.pipe(
    filter(isActionOf(updateLayoutAction)),
    map((value) => updateNodesControl(store.value.nodeList, null, value.layoutMode)),
    map((result: ActionResult) => actionSuccess(result.nodeList, result.nodesLine, result.layoutMode))
)
