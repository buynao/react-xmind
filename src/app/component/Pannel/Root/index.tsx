import * as React from "react"
import { IXmindNode, XmindNode } from "../../../../model/node";
import { useDispatch } from 'react-redux';
import { addChildNodeAction, deleteNodeAction } from "../../../actions";
import { IStore } from "../../../../store/root-reducers";
import { useSelector } from 'react-redux';
import "./index.less";
import { v4 as uuidv4 } from 'uuid';

interface IProps {
  node: IXmindNode[]
}
interface INodeProps {
  node: IXmindNode
}
function Node({ node }: INodeProps) {
  const root = useSelector((store: IStore) => store.root);
  const dispatch = useDispatch();
  return <>
        <div className={ !node.parent ? "root-node node" : "node"}>
          {node.content} childrens: {node.children?.length}
          <p>{node.parent ? `父节点：${node.parent.content}` : null}</p>
          <button onClick={() => {
            const curX = Number(node?.x) + 1;
            const deep = Number(node?.deep) + 1;
            const id = uuidv4();
            const sameNodes = root.filter((item) => deep === item.deep && node === item.parent);
            const child = new XmindNode({
              parent: node,
              content: `子节点${id.slice(0, 8)}`,
              deep: curX,
              id,
              x: curX,
              y: sameNodes.length + 1
            });
            dispatch(addChildNodeAction({
              newNode: child
            }))
          }}>添加</button>
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
          }}>同级</button>
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
        }}>删除</button>
        </div>
        <div className={`${node.id?.slice(0, 8)} children-nodes`}>
        {
          node.children?.map((item) =>
            <Node key={item.id} node={item} />
          )
        }
        </div>
    </>
}

function RootNode(root: IProps) {
  const node = root.node;
  return <Node node={node[0]} />
}

export default RootNode;