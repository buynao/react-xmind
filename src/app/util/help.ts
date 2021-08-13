import { IXmindNode } from "../../model/node"
import { WIDTH, X_GAP, MIN_HEIGHT, INIT_TOP } from "../constants"
import { INodeMap } from "../control/index";


export const getFirstNodeTop = (node: IXmindNode, nodesMap?: INodeMap) => {
  // 根节点
  if (!node.parent || !nodesMap) {
    return INIT_TOP;
  }
  // 多个子节点
  const parentId = node.parent.id;
  // const midY = (nodesMap[parentId].minHeight - nodesMap[nodeId].minHeight) / 2;
  const parentOffsetHeight = nodesMap[parentId].element?.offsetHeight || MIN_HEIGHT;
  const parentMinHeight = nodesMap[parentId].minHeight;
  // parentHeigh
  const midY = parentOffsetHeight > parentMinHeight ? (parentOffsetHeight - parentMinHeight) / 2 : (parentMinHeight - parentOffsetHeight) / 2;
  const top = parentOffsetHeight > parentMinHeight ? nodesMap[parentId].y + midY : nodesMap[parentId].y - midY;
  return top;
}

export const getOffsetLeft = (node: IXmindNode, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetLeft = node.deep * WIDTH + node.deep * X_GAP;
  return offsetLeft;
}
