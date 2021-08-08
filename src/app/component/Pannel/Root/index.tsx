import * as React from "react"
import { IXmindNode, XmindNode } from "../../../../model/node";
import { useDispatch } from 'react-redux';
import { addChildNodeAction, deleteNodeAction } from "../../../actions";
import { IStore } from "../../../../store/root-reducers";
import { useSelector } from 'react-redux';

interface IProps {
  node: IXmindNode[]
}
interface INodeProps {
  node: IXmindNode
}
function Node({ node }: INodeProps) {
  const root = useSelector((store: IStore) => store.root);
  const dispatch = useDispatch();
  return <div>
      <div>
        {node.content} x:{node.x}; y:{node.y};id:{node.id}
        <button onClick={() => {
          const curX = Number(node?.x) + 1;
          const deep = Number(node?.deep) + 1;
          const sameNodes = root.filter((item) => deep === item.deep && node === item.parent);
          const child = new XmindNode({
            parent: node,
            content: `子节点${deep}`,
            deep: curX,
            x: curX,
            y: sameNodes.length + 1
          });
          dispatch(addChildNodeAction({
            newNode: child
          }))
        }}>添加节点</button>
        <button onClick={() => {
          if (!node.parent) {
            alert("根节点无法添加同级节点");
            return;
          }
          const curX = Number(node?.x);
          const curY = Number(node?.y) + 1;
          const deep = Number(node?.deep);
          const child = new XmindNode({
            parent: node.parent,
            content: `同级节点${deep}`,
            deep: deep,
            x: curX,
            y: curY
          });
          dispatch(addChildNodeAction({
            newNode: child
          }))
        }}>添加同级节点</button>
        <button onClick={() => {
          if (!node.parent) {
            alert("根节点无法删除")
            return;
          };
          dispatch(deleteNodeAction(
            {
              curNode: node
            }
          ))
        }}>删除节点</button>
      </div>
  </div>
}
function RootNode(root: IProps) {
  const node = root.node;
  return <div>
    {
      node.map((item) => <Node key={item.id} node={item} />)
    }
  </div>
}

export default RootNode;