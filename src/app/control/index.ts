import { IAddChildNodeInfo, ICurNode } from "../actions/index";
import { INode, INodes, IWrap } from "XmindTypes";
import { RootState } from "../../store/index";
import { getOffsetLeft, getFirstNodeTop } from "../util/help";
import { MIN_HEIGHT, MIN_WIDTH, X_GAP, Y_GAP } from "../constants"
import { type } from "os";

export interface INodeMap {
  [key: string]: INode;
}

/**
 * 判断node与parentNode是否存在"血缘"关系
 * 
 * @param parentNode 父节点
 * @param node 子节点
 * @returns boolean
 */
function isSameNodeParent(parentNode: INode, node: INode): boolean {
  if (!node.parent) return false;
  if (node.parent.id === parentNode.id) {
    return true;
  }
  return isSameNodeParent(parentNode, node.parent);
}
// 添加节点
export const addNode = function(nodeInfo: IAddChildNodeInfo, store: RootState) {
  const { newNode } = nodeInfo;
  const { nodeList } = store;
  const nodeMap = genNodeId2MapKey([...nodeList, newNode]);
  const parentId = newNode.parent?.id as string;
  nodeMap[parentId].children?.push(newNode);
  addNodeForTree(nodeMap[parentId], nodeMap);
  return Object.values(nodeMap);
}
// 删除节点
export const deleteNode = function(nodeInfo: ICurNode, store: RootState) {
  const { curNode } = nodeInfo;
  const { nodeList } = store;
  if (!curNode.parent) return nodeList;
  const nodeMap = genNodeId2MapKey(nodeList);
  // 1. 将所有待删除的子节点，及子孙节点进行删除
  const { nodes } = deleteNodeForNodeList(curNode, nodeMap);
  // 2. 更新当前节点的父节点，父节点children需清除该节点
  deleteNodeForTree(curNode.id, curNode, nodeMap);
  const updateNodes = Object.values(nodeMap);
  // 3. 缓存当前节点的同级节点
  const cacheSameNodes = updateNodes.filter((item) => {
    if (item.deep === curNode.deep && item.parent === curNode.parent) {
      return true;
    }
    return false;
  });
  // 4. 重置当前节点的同级节点
  let deep = 0;
  const resetSameNodes = cacheSameNodes.map((item) => {
    item.index = deep++;
    return item;
  });
  // 5. 过滤当前节点的同级节点
  const newRoots = updateNodes.filter((item) => {
    if (item.parent !== curNode.parent) {
      return true;
    }
    return false;
  });

  return updateNodesControl([...newRoots, ...resetSameNodes]);
}
// 更新当前节点
export const updateNode = function(nodeInfo: ICurNode, store: RootState) {
  const { curNode } = nodeInfo;
  const { nodeList } = store;
  const nodeMap = genNodeId2MapKey(nodeList);
  updateNodeForTree(curNode, nodeMap);
  return updateNodesControl(Object.values(nodeMap), nodeMap);
}
// 更新当前组节点
export const updateNodesControl = function(nodeList: INodes, nodeMap?: INodeMap) {
  // 节点组合映射成map         
  const nodesMap = nodeMap || genNodeId2MapKey(nodeList);
  const rootNode = getRootNode(nodeList[0]) as INode;
  // 批量更新组节点高度
  updateNodesWrap(nodesMap[rootNode.id], nodesMap);
  // 批量更新节点位移
  updateNodesOffset(nodesMap[rootNode.id], nodesMap);
  // 节点map生成新数组
  const newNodeList = Object.values(nodesMap);
  console.log('newNodeList');
  console.log(newNodeList);
  return [...newNodeList];
}


/* ----------------------------工具库------------------------------- */
// 更新节点引用关系
function updateNodeForTree (curNode: INode, nodeMap: INodeMap) {
  if (!curNode) return;
  nodeMap[curNode.id] = curNode;
  updateNodeForTree(nodeMap[curNode.id].parent as INode, nodeMap)
}

// 删除节点引用关系
function deleteNodeForTree (deleteId: string, curNode: INode, nodeMap: INodeMap) {
  const parentNode = curNode.parent as INode;
  if (!parentNode) return;
  const parentNodeId = parentNode.id;
  const parentChildren = nodeMap[parentNodeId].children as INodes;
  nodeMap[parentNodeId].children = parentChildren.filter((item) => item.id !== deleteId);
  
  deleteNodeForTree(deleteId, nodeMap[parentNodeId], nodeMap);
}

// 添加节点引用关系
function addNodeForTree (curNode: INode, nodeMap: INodeMap) {
  const parentNode = curNode.parent as INode;
  if (!parentNode) return;
  const parentNodeId = parentNode.id;
  nodeMap[parentNodeId].children = nodeMap[parentNodeId].children?.map((item) => {
    if (item.id === curNode.id) {
      return curNode;
    }
    return item;
  })
  addNodeForTree(nodeMap[parentNodeId], nodeMap)
}


// 删除节点及其子节点
function deleteNodeForNodeList (curNode: INode, nodeMap: INodeMap) {
  const nodeList = Object.values(nodeMap);
  nodeList.forEach((item) => {
    const isSame = isSameNodeParent(curNode, item);
    if (curNode.id === item.id || isSame) {
      delete nodeMap[item.id];
    }
  });
  return {
    nodes: Object.values(nodeMap),
    nodeMap,
  }
}

// 更新所有节点的高度
function updateNodesWrap (rootNode: INode, nodesMap: INodeMap) : IWrap {
  const nodes = rootNode.children as INodes;
  const len = nodes.length;
  let minWidth = 0;
  let minHeight = 0;
  const rootId = rootNode.id;
  if (len === 0)  {
    minHeight = nodesMap[rootId].element?.offsetHeight || MIN_HEIGHT;
    minWidth = nodesMap[rootId].element?.offsetWidth || MIN_WIDTH;
    nodesMap[rootId].wrap = { height: minHeight, width: minWidth };
    return nodesMap[rootId].wrap as IWrap;
  };
  minWidth = nodesMap[rootId].element?.offsetWidth || MIN_WIDTH;
  nodes.forEach((item) => {
    const { width, height } = updateNodesWrap(item, nodesMap);
    minHeight = minHeight + Y_GAP + height;
    minWidth = minWidth + X_GAP + width;
  })
  minHeight = minHeight - Y_GAP;
  nodesMap[rootId].wrap = { height: minHeight, width: minWidth };
  return nodesMap[rootId].wrap as IWrap;
}
// 更新所以节点的偏移量
function updateNodesOffset (rootNode: INode, nodesMap: INodeMap) {
  if (!rootNode) return; 
  const nodes = rootNode.children as INodes;
  const len = nodes.length;
  if (!rootNode.parent) {
    nodesMap[rootNode.id].y = getFirstNodeTop(rootNode, nodesMap);
  }
  if (len === 0) return;
  for (let i = 0; i < len; i++) {
    const nodeId = nodes[i].id;
    nodesMap[nodeId].x = getOffsetLeft(nodes[i], nodesMap);
    if (i === 0) {
      nodesMap[nodeId].y = getFirstNodeTop(nodes[i], nodesMap);
    } else {
      // 上个节点的top + 上个节点的高度 - 上个节点的占用高度
      const prevNodeId = nodes[i - 1].id;
      const preWrap = nodesMap[prevNodeId].wrap as IWrap;
      const offsetTop = nodesMap[prevNodeId].y + preWrap?.height - (preWrap?.height - nodesMap[prevNodeId].element?.offsetHeight) / 2;
      nodesMap[nodeId].y = offsetTop + (nodesMap[nodeId].wrap?.height - nodesMap[nodeId].element?.offsetHeight) / 2 + Y_GAP;
    }
    updateNodesOffset(nodes[i], nodesMap)
  }
  return;
}

// nodeList 生成  { [node.id]: {node} }
function genNodeId2MapKey(nodeList: INodes) : INodeMap {
  const nodeMap = {} as INodeMap;
  nodeList.forEach((item) => {
    const key = item.id as string;
    nodeMap[key] = item;
  });
  return nodeMap;
}

// 获取根节点
export function getRootNode(node: INode) : INode{
  if (!node.parent) return node;
  return getRootNode(node.parent);
}