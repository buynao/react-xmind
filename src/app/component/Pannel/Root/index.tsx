import * as React from "react"
import { IXmindNode, XmindNode } from "../../../../model/node";
import { updateNodesAction, updateNodeAction } from "../../../actions/index";
import NodeChild  from "../Node";
import "./index.less";
import { useDispatch } from 'react-redux';
import classNames from "classnames";
import { getOffsetLeft, getOffsetTop } from "../../../util/help";

const { useEffect, useRef } = React;

interface IProps {
  node: IXmindNode[]
}
interface INodeProps {
  node: IXmindNode
}

function Node({ node }: INodeProps) {
  const dispatch = useDispatch();
  const clsName = classNames("node", {
    "root-node": !node.parent,
  });
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const needUpate = {
      curNode: {
        ...node,
        element: element.current,
        x: getOffsetLeft(node, element.current),
        y: getOffsetTop(node)
      }
    }
    // 引用赋值
    if (!node.parent) {
      dispatch(updateNodeAction(needUpate))
    } else {
      dispatch(updateNodesAction(needUpate))
    }
    return () => {
      console.log('释放element')
      node.element = null;
    }
  }, []);

  return <>
      <div className={clsName} ref={element} style={{
          left: node.x,
          top: node.y
        }}>
          {node.content} childrens: {node.children?.length}
          <p>{`height：${node.minHeight}`}</p>
          <p>X:{node.x}  Y:{node.y} deep:{node.deep} index:{node.index}</p>
          <NodeChild node={node} />
      </div>
    </>
}

function RootNode(root: IProps) {
  const { node } = root;

  // useEffect(() => {
  //   console.log("new nodes:");
  //   console.log(nodes[0]);
  // }, [nodes])
  console.log('重新渲染后的 S：')
  console.log(node)
  console.log('重新渲染后的 E：')
  return <>
    {
      node.map((item) => <Node key={item.id} node={item} />)
    }
  </>
}

export default RootNode;