import { IXmindNode } from "../../model/node"

const WIDTH = 200;
export const MIN_HEIGHT = 100;
const X_GAP = 20;
const Y_GAP = 10;
const INIT_TOP = 300;

export const getOffsetTop = (node: IXmindNode, nodesMap?: any) => {
  // 根节点
  if (!node.parent) {
    return INIT_TOP;
  }
  // 多个子节点
  const parentId = node.parent.id;
  const nodeId = node.id;
  const midY = (nodesMap[parentId].minHeight - nodesMap[nodeId].minHeight) / 2;
  return nodesMap[parentId].y - midY;
}

export const getOffsetLeft = (node: IXmindNode, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetLeft = node.deep * WIDTH + node.deep * X_GAP;
  return offsetLeft;
}