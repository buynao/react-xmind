import { INode } from "XmindTypes"
import { X_GAP, MIN_HEIGHT, INIT_TOP } from "../constants"
import { INodeMap } from "../control/index";


export const getFirstNodeTop = (node: INode, nodesMap: INodeMap) => {
  // 根节点
  if (!node.parent || !nodesMap) {
    return INIT_TOP;
  }
  // 多个子节点
  const parentId = node.parent.id;
  // const midY = (nodesMap[parentId].minHeight - nodesMap[nodeId].minHeight) / 2;
  const parentOffsetHeight = nodesMap[parentId].element?.offsetHeight || MIN_HEIGHT;
  const parentMinHeight = nodesMap[parentId].wrap?.height || 0;
  // 当前 wrap 的 top
  const midY = parentOffsetHeight > parentMinHeight ? (parentOffsetHeight - parentMinHeight) / 2 : (parentMinHeight - parentOffsetHeight) / 2;
  const wrapTop = parentOffsetHeight > parentMinHeight ? nodesMap[parentId].y + midY : nodesMap[parentId].y - midY;
  // 当前 element 的 top
  const nodeId = node.id;
  const nodeOffsetHeight = nodesMap[nodeId].element?.offsetHeight || MIN_HEIGHT;
  const nodeMinHeight = nodesMap[nodeId].wrap?.height;
  const nodY = nodeOffsetHeight > nodeMinHeight ? (nodeOffsetHeight - nodeMinHeight) / 2 : (nodeMinHeight - nodeOffsetHeight) / 2;
  // fix deep === 2
  const diffY = nodesMap[nodeId].deep === 2 && parentOffsetHeight > nodeMinHeight ? (parentOffsetHeight - nodeMinHeight) / 2 : 0

  return wrapTop + nodY + diffY;
}

export const getOffsetLeft = (node: INode, nodesMap: INodeMap, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetLeft = getLeftWidth(node, nodesMap);
  return offsetLeft;
}

export const getOffsetRight = (node: INode, nodesMap: INodeMap, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetRight = getRightWidth(node, nodesMap);
  return offsetRight;
}

function getRightWidth (node: INode, nodesMap: INodeMap): number {
  if (!node) return 0;
  if (!node.parent) return 0;
  const parentId = node.parent.id;
  const parentNode = nodesMap[parentId];
  const parentElement = parentNode.element as HTMLElement;
  const offsetLeft = parentNode.x - parentElement.offsetWidth - X_GAP;
  return parentNode.isRoot ? offsetLeft - 20 : offsetLeft;
}

function getLeftWidth (node: INode, nodesMap: INodeMap): number {
  if (!node) return 0;
  if (!node.parent) return 0;
  const parentId = node.parent.id;
  const parentNode = nodesMap[parentId];
  const parentElement = parentNode.element as HTMLElement;
  return parentNode.x + parentElement.offsetWidth + X_GAP;
}