import { IXmindNode } from "../../model/node"

const WIDTH = 200;
export const MIN_HEIGHT = 100;
const X_GAP = 10;
const Y_GAP = 10;
const INIT_TOP = 300;

export const getOffsetTop = (node: IXmindNode) => {
  // 根节点
  if (!node.parent) {
    return INIT_TOP;
  }
  // 多个子节点
  const midY = ((node.parent.children as []).length * MIN_HEIGHT - MIN_HEIGHT)/ 2;
  return node.parent.y - midY;
}

export const getOffsetLeft = (node: IXmindNode, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetLeft = node.deep * WIDTH + node.deep * X_GAP;
  return offsetLeft;
}