

import { Epic } from "redux-observable";
import { from, of } from "rxjs";
import { filter, catchError, map } from "rxjs/operators";

import { isActionOf } from "typesafe-actions";
import { RootState, ActionsType } from "../../store/index";
import { IXmindNode } from "../../model/node";
import * as controls from "../control";
import { IDeleteNodeInfo, IAddChildNodeInfo,
  actionSuccessAction, addChildNodeAction, deleteNodeAction } from "../actions";

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
    map((nodeInfo: IDeleteNodeInfo) => deleteNode(nodeInfo, store.value)),
    map((root: IXmindNode[]) => {
      console.log('epic');
      console.log(root);
      return actionSuccessAction(root)
    })
  )