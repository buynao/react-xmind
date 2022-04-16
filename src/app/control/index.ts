import { IAddChildNodeInfo, ICurNode } from "../actions/index";
import { ConnectLine, INode, INodes, IWrap } from "XmindTypes";
import { RootState } from "../../store/index";
import { getOffsetLeft, getFirstNodeTop, getOffsetRight } from "../util/help";
import { MIN_HEIGHT, MIN_WIDTH, X_GAP, Y_GAP } from "../constants"

export interface INodeMap {
  [key: string]: Required<INode>;
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
  return {
    nodeList: Object.values(nodeMap),
    nodesLine: []
  };
}
// 删除节点
export const deleteNode = function(nodeInfo: ICurNode, store: RootState) {
  const { curNode } = nodeInfo;
  const { nodeList, layoutMode } = store;
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

  return updateNodesControl([...newRoots, ...resetSameNodes], null, layoutMode);
}
// 更新当前节点
export const updateNode = function(nodeInfo: ICurNode, store: RootState) {
  const { curNode } = nodeInfo;
  const { nodeList, layoutMode } = store;
  const nodeMap = genNodeId2MapKey(nodeList);
  updateNodeForTree(curNode, nodeMap);
  return updateNodesControl(Object.values(nodeMap), nodeMap, layoutMode);
}
// 更新当前组节点
export const updateNodesControl = function(nodeList: INodes, nodeMap: INodeMap | null, layoutMode: string) {
  // 节点组合映射成map         
  const nodesMap = nodeMap || genNodeId2MapKey(nodeList);
  const rootNode = getRootNode(nodeList[0]);
  // 批量更新组节点高度
  updateNodesWrap(nodesMap[rootNode.id], nodesMap);
  // 批量更新节点位移
  updateNodesOffset(nodesMap[rootNode.id], nodesMap, layoutMode);
  // 节点map生成新数组
  const newNodeList = Object.values(nodesMap);
  // 节点map生成连接线
  const nodesLine = updateNodesLine(nodesMap[rootNode.id], nodesMap, [], layoutMode);
  return {
    nodeList: [...newNodeList],
    nodesLine
  };
}

export const updateNodesConnectLine = function(nodeList: INodes) {
  console.log(`updateNodesConnectLine:${nodeList}`);
  return ['updateNodesConnectLine'];
}


/* ----------------------------工具库------------------------------- */
// 更新节点引用关系
function updateNodeForTree (curNode: INode, nodeMap: INodeMap) {
  if (!curNode) return;
  nodeMap[curNode.id] = curNode as Required<INode>;
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
  const parentNode = curNode.parent;
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
  const childrens = rootNode.children as INodes;
  const len = childrens.length;
  let minWidth = 0;
  let minHeight = 0;
  const rootId = rootNode.id;
  if (len === 0)  {
    minHeight = nodesMap[rootId].element?.offsetHeight as number;
    minWidth = nodesMap[rootId].element?.offsetWidth as number;
    nodesMap[rootId].ele = { height: minHeight, width: minWidth };
    nodesMap[rootId].wrap = { height: minHeight || MIN_HEIGHT, width: minWidth || MIN_WIDTH };
    return nodesMap[rootId].wrap;
  };

  minWidth = nodesMap[rootId].element?.offsetWidth || MIN_WIDTH;
  childrens.forEach((item) => {
    const { width, height } = updateNodesWrap(item, nodesMap);
    minHeight = minHeight + Y_GAP + height;
    minWidth = minWidth + X_GAP + width;
  })
  minHeight = minHeight - Y_GAP;
  nodesMap[rootId].wrap = { height: minHeight, width: minWidth };
  return nodesMap[rootId].wrap;
}

// 更新所以节点的偏移量
function updateNodesOffset (rootNode: INode, nodesMap: INodeMap, layoutMode: string) {
  if (!rootNode) return; 
  const childrens = rootNode.children as INodes;
  const len = childrens.length;
  
  if (!rootNode.parent) {
    nodesMap[rootNode.id].y = getFirstNodeTop(rootNode, nodesMap);
  }

  if (len === 0) return;

  for (let i = 0; i < len; i++) {
    const nodeId = childrens[i].id;
    if (layoutMode === 'left') {
      nodesMap[nodeId].x = getOffsetRight(childrens[i], nodesMap);
    } else {
      nodesMap[nodeId].x = getOffsetLeft(childrens[i], nodesMap);
    }
    if (i === 0) {
      nodesMap[nodeId].y = getFirstNodeTop(childrens[i], nodesMap);
    } else {
      // 上个节点的top + 上个节点的高度 - 上个节点的占用高度
      const prevNodeId = childrens[i - 1].id;
      const preWrap = nodesMap[prevNodeId].wrap;
      const offsetTop = nodesMap[prevNodeId].y + preWrap.height - (preWrap.height - (nodesMap[prevNodeId].element?.offsetHeight as number)) / 2;
      nodesMap[nodeId].y = offsetTop + (nodesMap[nodeId].wrap.height - (nodesMap[nodeId].element?.offsetHeight as number)) / 2 + Y_GAP;
    }
    updateNodesOffset(childrens[i], nodesMap, layoutMode)
  }

  return;
}

// nodeList 生成  { [node.id]: {node} }
function genNodeId2MapKey(nodeList: INodes) : INodeMap {
  const nodeMap = {} as INodeMap;
  nodeList.forEach((item) => {
    const key = item.id;
    nodeMap[key] = item as Required<INode>;
  });
  return nodeMap;
}

// 获取根节点
export function getRootNode(node: INode) : INode{
  if (!node.parent) return node;
  return getRootNode(node.parent);
}
/**
 * 更新连接线
 */
function updateNodesLine (root: INode, nodeMap: INodeMap, lines: ConnectLine[], layoutMode: string): ConnectLine[] {
  if(root.children && !root.children.length) {
    return lines;
  }
  const rootId = root.id;
  const rootNode = nodeMap[rootId];
  rootNode.children.forEach(item => {
    const bezireMap: ConnectLine = {
      from: {
        x: rootNode.x + rootNode.ele.width,
        y: rootNode.y + rootNode.ele.height / 2
      },
      to: {
        x: 0,
        y: 0
      }
    }
    const nodeId = item.id;
    const childrenNode = nodeMap[nodeId];
    console.log(childrenNode.x)
    bezireMap.to = {
      x: childrenNode.x,
      y: childrenNode.y + childrenNode.ele.height / 2
    }
    lines.push(bezireMap);
    lines.concat(updateNodesLine(childrenNode, nodeMap, lines, layoutMode));
  });
  return lines;
}