import { IAddChildNodeInfo, ICurNode } from "../actions/index";
import { IXmindNode } from "../../model/node";
import { RootState } from "../../store/index";
import { getOffsetLeft, getOffsetTop } from "../util/help";
import RootNode from "../component/Pannel/Root";

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
// 添加节点
export const addNode = function(nodeInfo: IAddChildNodeInfo, store: RootState) {
  const { newNode } = nodeInfo;
  const { root } = store;
  newNode.parent?.children?.push(newNode);
  root.push(newNode);
  return [...root];
}
// 删除节点
export const deleteNode = function(nodeInfo: ICurNode, store: RootState) {
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
  let deep = 0;
  const resetSameNodes = cacheSameNodes.map((item) => {
    item.index = deep++;
    return item;
  });
  // 4. 过滤当前节点的同级节点
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
  const { root } = store;
  const newRoots = root.map((item) => {
    if (item.id === curNode.id) {
      return curNode
    }
    return item;
  });
  return [...newRoots];
}
// 更新当前组节点
export const updateNodesControl = function(rootNode: IXmindNode[]) {
  // 1. 找出需要更新的组节点
  const nodesMap = genNodeId2MapKey(rootNode);
  // const newNodes = genNodesList(curNode.parent as IXmindNode, root);
  // 3. 批量更新组节点高度
  uodateNodesHeight(rootNode[0], nodesMap);
  // 4. 批量更新节点位移
  updateNodesOffset(rootNode[0], nodesMap);
  const newNodeList = Object.values(nodesMap) as IXmindNode[];
  console.log(`newNodeList`);
  console.log(newNodeList);
  return [...newNodeList];
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

// 更新所有节点的高度
function uodateNodesHeight (rootNode: IXmindNode, nodesMap: any) : number {
  const nodes = rootNode.children as IXmindNode[];
  const len = nodes.length;
  if (len === 0)  {
    nodesMap[rootNode.id].minHeight = rootNode.minHeight;
    return rootNode.minHeight;
  };
  let minHeight = 0;
  nodes.forEach((item) => {
    minHeight = minHeight + uodateNodesHeight(item, nodesMap);
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
    nodesMap[nodeId].x = getOffsetLeft(nodes[i]);
    if (i === 0) {
      nodesMap[nodeId].y = getOffsetTop(nodes[i]);
    } else {
      // 上个节点的top + 上个节点的高度
      const prevNodeId = nodes[ i - 1].id;
      const offsetTop = nodesMap[prevNodeId].y + (nodesMap[prevNodeId]?.minHeight) - (nodesMap[prevNodeId].minHeight - 100) / 2;
      nodesMap[nodeId].y = offsetTop + (nodesMap[nodeId].minHeight - 100) / 2;
    }
    updateNodesOffset(nodes[i], nodesMap)
  }

  return;
}


function genNodeId2MapKey(nodeList: IXmindNode[]) {
  const nodeMap = {} as any;
  nodeList.forEach((item) => {
    const key = item.id as string;
    nodeMap[key] = item;
  });
  return nodeMap;
}

// function genNodesList(curNode: IXmindNode | undefined | null, oldNodeList: IXmindNode[]) : IXmindNode[]{
//   if (!curNode) return oldNodeList;
//   let nodeMap = {} as any;
//   // nodeMap ={
//   //   ...genNodesMap(curNode)
//   // };
//   // curNode.children?.forEach(item => { 
//   //     nodeMap = {
//   //       ...genNodesMap(item)
//   //     }
//   // });
//   console.log(nodeMap);
//   // 2. 过滤需要删除的组节点
//   const newNodes = oldNodeList.map((item) => {
//     const key = item.id as string;
//     if (nodeMap[key]) return nodeMap[key];
//     return item;
//   });
//   return ([] as IXmindNode[]).concat(genNodesList(curNode.parent, newNodes))
// }