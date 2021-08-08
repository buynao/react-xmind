import { IAddChildNodeInfo, IDeleteNodeInfo } from "../actions/index";
import { IXmindNode } from "../../model/node";

function getRootNode(node: IXmindNode) :IXmindNode {
  if (!node.parent) {
    return node;
  }
  return getRootNode(node.parent);
}

export const addNode = function(nodeInfo: IAddChildNodeInfo) {
  nodeInfo.curNode.children?.push(nodeInfo.newNode);
  const rootNode = getRootNode(nodeInfo.curNode);
  return rootNode;
}

export const deleteNode = function(nodeInfo: IDeleteNodeInfo) {
  const { curNode, parentNode } = nodeInfo;
  const childrens = parentNode.children?.filter((node) => {
      return node.id !== curNode.id;
  })
  parentNode.children = childrens;
  const rootNode = getRootNode(parentNode);
  return rootNode;
}


