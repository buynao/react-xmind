import { INode } from "XmindTypes"
import { WIDTH, X_GAP, MIN_HEIGHT, INIT_TOP } from "../constants"
import { INodeMap } from "../control/index";


export const getFirstNodeTop = (node: INode, nodesMap: INodeMap) => {
  // 根节点
  if (!node.parent || !nodesMap) {
    console.log(node);
    const nodeId = node.id;
    const rootNode = nodesMap[nodeId];
    const rootTop = (rootNode.wrap?.height as number - rootNode.element?.offsetHeight) / 2;
    return INIT_TOP;
  }
  // 多个子节点
  const parentId = node.parent.id;
  // const midY = (nodesMap[parentId].minHeight - nodesMap[nodeId].minHeight) / 2;
  const parentOffsetHeight = nodesMap[parentId].element?.offsetHeight || MIN_HEIGHT;
  const parentMinHeight = nodesMap[parentId].wrap?.height || 0;
  // parentHeigh
  const midY = parentOffsetHeight > parentMinHeight ? (parentOffsetHeight - parentMinHeight) / 2 : (parentMinHeight - parentOffsetHeight) / 2;
  const top = parentOffsetHeight > parentMinHeight ? nodesMap[parentId].y + midY : nodesMap[parentId].y - midY;
  return top;
}

export const getOffsetLeft = (node: INode, nodesMap: INodeMap, ele?: HTMLDivElement | null) => {
  if (!node.deep) {
    return ele?.offsetLeft || 0;
  }
  const offsetLeft = getLeftWidth(node, nodesMap);
  return offsetLeft;
}

function getLeftWidth (node: INode, nodesMap: INodeMap): number {
  if (!node) return 0;
  if (!node.parent) return 0;
  const parentId = node.parent.id;
  return nodesMap[parentId].element?.offsetLeft as number + nodesMap[parentId].element?.offsetWidth as number + X_GAP;
}