import * as React from "react"
import { IXmindNode, XmindNode } from "../../../../model/node";
import { updateNodesAction, updateNodeAction, selectCurNodeAction } from "../../../actions/index";
import { IStore } from "../../../reducers/index";
import "./index.less";
import { useDispatch, useSelector } from 'react-redux';
import classNames from "classnames";
import { getOffsetLeft, getOffsetTop } from "../../../util/help";

const { useRef } = React;

interface INodeProps {
  node: IXmindNode
  curNode: IXmindNode
}

function Node({ node, curNode }: INodeProps) {
  const dispatch = useDispatch();
  const clsName = classNames("node", {
    "select": node.id === curNode?.id,
    "root-node": !node.parent,
  });
  const element = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const needUpate = {
  //     curNode: {
  //       ...node,
  //       element: element.current
  //     }
  //   }
  //   // 引用赋值
  //   if (!node.parent) {
  //     dispatch(updateNodeAction(needUpate))
  //   } else {
  //     dispatch(updateNodesAction(needUpate))
  //   }
  //   return () => {
  //     console.log('释放element')
  //     node.element = null;
  //   }
  // }, []);

  return <>
      <div
        className={clsName}
        ref={element}
        onClick={() => {
          dispatch(selectCurNodeAction({
            ...node
          }))
        }}
        style={{
            left: node.x,
            top: node.y
          }}>
          <p>{node.content} childrens: {node.children?.length}</p>
          <p>{`height：${node.minHeight}`}</p>
          <p>X:{node.x}  Y:{node.y} deep:{node.deep} index:{node.index}</p>
      </div>
    </>
}

function RootNode() {

  const { nodeList, curNode } = useSelector((store: IStore) => store);

  return <>
    {
      nodeList.map((item) => <Node
        key={item.id}
        node={item}
        curNode={curNode}
      />)
    }
  </>
}

export default RootNode;