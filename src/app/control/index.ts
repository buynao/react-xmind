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

/**
 * 判断node与parentNode是否存在"血缘"关系
 * 
 * @param parentNode 父节点
 * @param node 子节点
 * @returns boolean
 */
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
  newNode.parent?.children?.push(newNode);
  root.push(newNode);
  return [...root];
}

export const deleteNode = function(nodeInfo: IDeleteNodeInfo, store: RootState) {
  const { curNode } = nodeInfo;
  const { root } = store;
  if (!curNode.parent) return [];
  // 1. 将所有待删除的子节点，及子孙节点进行删除
  const deleteRoots = deleteNodeForRoots(root, curNode);
  // 2. 更新当前节点的父节点，父节点children需清除该节点
  const parentNode = curNode.parent;
  parentNode.children = parentNode?.children?.filter((item) => item.id !== curNode.id);
  const updateNodes = deleteRoots.map((item) => item.id === parentNode.id ? parentNode : item);
  // 3. 缓存当前节点的同级节点
  const cacheSameNodes = updateNodes.filter((item) => {
    if (item.deep === curNode.deep && item.parent === curNode.parent) {
      return true;
    }
    return false;
  });
  // 5. 重置当前节点的同级节点
  let deep = 1;
  const resetSameNodes = cacheSameNodes.map((item) => {
    item.y = deep++;
    return item;
  });
  // 4. 过滤当前节点的同级节点
  const newRoots = updateNodes.filter((item) => {
    if (item.parent !== curNode.parent) {
      return true;
    }
    return false;
  });

  return [...newRoots, ...resetSameNodes];
}


function deleteNodeForRoots (root: IXmindNode[], curNode: IXmindNode) {
  return root.filter((item) => {
    const isSame = isSameNodeParent(curNode, item);
    if (curNode.id === item.id || isSame) {
      return false;
    }
    return true;
  });
}