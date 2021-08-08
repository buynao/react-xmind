import * as React from "react"
import { IXmindNode, XmindNode } from "../../../../model/node";
import { useDispatch } from 'react-redux';
import { addChildNodeAction, deleteNodeAction } from "../../../actions";

interface IProps {
  node: IXmindNode
}

function Node(root: IProps) {
  const node = root.node;
  const dispatch = useDispatch();
  return <div>
      <div>
        {node.content}
        <button onClick={() => {
          const child = new XmindNode({
            parent: node,
            content: `子节点${Number(node?.deep) + 1}`,
            deep: Number(node?.deep) + 1
          });
          dispatch(addChildNodeAction({
            curNode: node,
            newNode: child
          }))
        }}>添加节点</button>
        <button onClick={() => {
          if (!node.parent) {
            alert("根节点无法添加同级节点");
            return;
          }
          const child = new XmindNode({
            parent: node.parent,
            content: `同级节点${Number(node?.deep)}`,
            deep: Number(node?.deep)
          });
          dispatch(addChildNodeAction({
            curNode: node.parent,
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
              curNode: node,
              parentNode: node.parent
            }
          ))
        }}>删除节点</button>
      </div>

      {node.children?.map((item: IXmindNode) => <Node key={item.id} node={{...item}} />)}
  </div>
}

export default Node;