import { IAddChildNodeInfo, IDeleteNodeInfo } from "../actions/index";
import { IXmindNode } from "../../model/node";
import { RootState } from "../../store/index";
import { Console } from "console";

function getRootNode(node: IXmindNode) :IXmindNode {
  if (!node.parent) {
    return node;
  }
  return getRootNode(node.parent);
}

function isSameNodeParent(parentNode: IXmindNode, node: IXmindNode): boolean {
  if (!node.parent) return false;
  if (node.parent === parentNode) {
    return true;
  }
  return isSameNodeParent(parentNode, node.parent);
}
export const addNode = function(nodeInfo: IAddChildNodeInfo, store: RootState) {
  const { newNode } = nodeInfo;
  const { root } = store;
  root.push(newNode);
  return [...root];
}

export const deleteNode = function(nodeInfo: IDeleteNodeInfo, store: RootState) {
  const { curNode } = nodeInfo;
  const { root } = store;

  const deleteRoots = root.filter((item) => {
    const isSame = isSameNodeParent(curNode, item);
    console.log(isSame);
    if (curNode.id === item.id || isSame) {
      return false;
    }
    return true;
  });
  console.log('deleteRoots');
  console.log(deleteRoots);
  const sameNodes = deleteRoots.filter((item) => {
    if (item.deep === curNode.deep && item.parent === curNode.parent) {
      return true;
    }
    return false;
  });
  const newRoots = deleteRoots.filter((item) => {
    if (item.parent !== curNode.parent) {
      return true;
    }
    return false;
  });
  let deep = 1;
  const resetDeepNodes = sameNodes.map((item) => {
    item.y = deep++;
    return item;
  });

  return [...newRoots, ...resetDeepNodes];
}


