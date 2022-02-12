import * as React from "react"
import { INode, IStore } from "XmindTypes";
import { updateNodeAction, selectCurNodeAction } from "../../../actions/index";
import "./index.less";
import { useDispatch, useSelector } from 'react-redux';
import classNames from "classnames";
import { getRootNode } from "../../../control/index";
import ConnectLine from "../ConnectLine";

const { useRef, useEffect } = React;

interface INodeProps {
  node: INode
  selectNode: INode
}

function Node({ node, selectNode }: INodeProps) {
  const dispatch = useDispatch();
  const element = useRef<HTMLDivElement | null>(null);

  const clsName = classNames("node", {
    "select": node.id === selectNode?.id,
    "root-node": !node.parent,
    "second-node": node.deep === 1
  });

  useEffect(() => {
    const needUpate = {
      curNode: {
        ...node,
        element: element.current as HTMLDivElement
      }
    }

    dispatch(updateNodeAction(needUpate))

    return () => {
      node.element = null;
    }
  }, []);
console.log(node);
  return <>
      <div
        className={clsName}
        ref={element}
        style={{
          opacity: node.x === 0 ? 0 : 1,
          left: node.x,
          top: node.y
        }}
        onClick={() => {
          dispatch(selectCurNodeAction({
            ...node
          }))
        }}>
          {/* <p>{`x: ${node.x}`}</p>
          <p>{`y: ${node.y}`}</p> */}
          <p>{`${node.content}`}</p>
      </div>
    </>
}

function RootNode({ MindWrapRef }: any) {

  const { nodeList, curNode } = useSelector((store: IStore) => store);
  
  return <div ref={MindWrapRef} className="mind-map-nodes">
    {
      nodeList.map((item) => <Node
        key={item.id}
        node={item}
        selectNode={curNode}
      />)
    }
    {/* <ConnectLine /> */}
  </div>
}

export default RootNode;