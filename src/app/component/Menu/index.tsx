import * as React from "react"
import { useDispatch, useSelector } from 'react-redux';
import { XmindNode } from "../../../model/node";
import { INode, INodes } from "XmindTypes"
import { addChildNodeAction, deleteNodeAction, updateLayoutAction } from "../../actions/index";
import { v4 as uuidv4 } from 'uuid';
import "./index.less";

interface IProps {
  curNode: INode
  nodeList: INodes
  layoutMode: string;
}

function Menu() {
  const dispatch = useDispatch();
  const { curNode, nodeList, layoutMode } = useSelector((store: IProps) => store);
  const deep = Number(curNode?.deep);

  return <div className="mind-map-menu">
    <p>current node :{curNode?.id}</p>
    <button
      onClick={() => {
        const id = uuidv4().slice(0, 8);
        const sameNodes = nodeList.filter((item) => deep + 1 === item.deep && curNode.id === item.parent?.id);
        const child = new XmindNode({
          parent: curNode,
          content: `子节点${id.slice(0, 8)}`,
          deep: deep + 1,
          id,
          x: 0,
          y: 0,
          index: sameNodes.length
        });
        dispatch(addChildNodeAction({
          newNode: child
        }))
      }}
    >add children</button>
    <button onClick={() => {
      if (!curNode.parent) {
        alert("根节点无法添加同级节点");
        return;
      }
      const id = uuidv4().slice(0, 8);
      const sameNodes = nodeList.filter((item) => deep === item.deep && curNode.parent?.id === item.parent?.id);
      const child = new XmindNode({
        parent: curNode.parent,
        content: `同级节点${deep}`,
        deep,
        x: 0,
        y: 0,
        id,
        index: sameNodes.length
      });
      dispatch(addChildNodeAction({
        newNode: child
      }))
    }}>add siblings</button>
    <button onClick={() => {
      if (!curNode.parent) {
        alert("根节点无法删除")
        return;
      };
      dispatch(deleteNodeAction({ curNode }))
    }}>delete node</button>
    <button 
      disabled={layoutMode === 'right'}
    onClick={() => {
      dispatch(updateLayoutAction('right'))
    }}>layout: right</button>
    <button
      disabled={layoutMode === 'left'}
      onClick={() => {
      dispatch(updateLayoutAction('left'))
    }}>layout: left</button>
  </div>
}

export default Menu;