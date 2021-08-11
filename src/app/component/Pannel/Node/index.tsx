import * as React from "react";
import { IXmindNode, XmindNode } from "../../../../model/node";
import { useDispatch } from 'react-redux';
import { addChildNodeAction, deleteNodeAction } from "../../../actions";
import { IStore } from "../../../../store/root-reducers";
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

interface INodeProps {
  node: IXmindNode
  element?: HTMLDivElement
}

function NodeChild  ({
  node, element
}: INodeProps) {
  const root = useSelector((store: IStore) => store.root);
  const dispatch = useDispatch();
  return <>
            <button onClick={() => {
            const curX = Number(node?.x) + 1;
            const deep = Number(node?.deep) + 1;
            const id = uuidv4().slice(0, 8);
            const sameNodes = root.filter((item) => deep === item.deep && node === item.parent);
            const child = new XmindNode({
              parent: node,
              content: `子节点${id.slice(0, 8)}`,
              deep,
              id,
              x: curX,
              y: 0,
              index: sameNodes.length
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
            const id = uuidv4().slice(0, 8);
            const child = new XmindNode({
              parent: node.parent,
              content: `同级节点${deep}`,
              deep: deep,
              x: curX,
              y: curY,
              id,
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
  </>
}

export default NodeChild;