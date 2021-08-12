import { IAddChildNodeInfo, ICurNode } from "../actions/index";
import { IXmindNode } from "../../model/node";
import { RootState } from "../../store/index";
import { getOffsetLeft, getOffsetTop } from "../util/help";

interface INodeMap {
  [key: string]: IXmindNode;
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
  return updateNodesControl(Object.values(nodeMap), nodeMap);
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
  const newRoots = nodeList.map((item) => {
    if (item.id === curNode.id) {
      return curNode
    }
    return item;
  });
  return [...newRoots];
}
// 更新当前组节点
export const updateNodesControl = function(rootNode: IXmindNode[], nodeMap?: INodeMap | null) {
  // 节点组合映射成map         
  const nodesMap = nodeMap || genNodeId2MapKey(rootNode);
  // 批量更新组节点高度
  updateNodesHeight(rootNode[0], nodesMap);
  // 批量更新节点位移
  updateNodesOffset(rootNode[0], nodesMap);
  // 节点map生成新数组
  const newNodeList = Object.values(nodesMap);
  console.log('newNodeList');
  console.log(newNodeList);
  return [...newNodeList];
}


/* ----------------------------工具库------------------------------- */
// 删除节点引用关系
function deleteNodeForTree (deleteId: string, curNode: IXmindNode, nodeMap: INodeMap) {
  const parentNode = curNode.parent as IXmindNode;
  if (!parentNode) return;
  const parentNodeId = parentNode.id;
  const parentChildren = nodeMap[parentNodeId].children as IXmindNode[];
  nodeMap[parentNodeId].children = parentChildren.filter((item) => item.id !== deleteId);
  
  deleteNodeForTree(deleteId, nodeMap[parentNodeId], nodeMap);
}

// 添加节点引用关系
function addNodeForTree (curNode: IXmindNode, nodeMap: INodeMap) {
  const parentNode = curNode.parent as IXmindNode;
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
function deleteNodeForNodeList (curNode: IXmindNode, nodeMap: INodeMap) {
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
function updateNodesHeight (rootNode: IXmindNode, nodesMap: any) : number {
  const nodes = rootNode.children as IXmindNode[];
  const len = nodes.length;
  if (len === 0)  {
    nodesMap[rootNode.id].minHeight = rootNode.minHeight;
    return rootNode.minHeight;
  };
  let minHeight = 0;
  nodes.forEach((item) => {
    minHeight = minHeight + updateNodesHeight(item, nodesMap);
  })

  nodesMap[rootNode.id].minHeight = minHeight;
  return minHeight;
}
// 更新所以节点的偏移量
function updateNodesOffset (rootNode: IXmindNode, nodesMap: any) {
  if (!rootNode) return; 
  const nodes = rootNode.children as IXmindNode[];
  const len = nodes.length;
  if (len === 0) return;
  for (let i = 0; i < len; i++) {
    const nodeId = nodes[i].id;
    nodesMap[nodeId].x = getOffsetLeft(nodes[i], nodesMap);
    if (i === 0) {
      nodesMap[nodeId].y = getOffsetTop(nodes[i], nodesMap);
    } else {
      // 上个节点的top + 上个节点的高度 - 上个节点的占用高度
      const prevNodeId = nodes[ i - 1].id;
      const offsetTop = nodesMap[prevNodeId].y + nodesMap[prevNodeId].minHeight - (nodesMap[prevNodeId].minHeight - 100) / 2;
      nodesMap[nodeId].y = offsetTop + (nodesMap[nodeId].minHeight - 100) / 2;
    }
    updateNodesOffset(nodes[i], nodesMap)
  }

  return;
}

// nodeList 生成  { [node.id]: {node} }
function genNodeId2MapKey(nodeList: IXmindNode[]) : INodeMap {
  const nodeMap = {} as INodeMap;
  nodeList.forEach((item) => {
    const key = item.id as string;
    nodeMap[key] = item;
  });
  return nodeMap;
}

// 批量更新