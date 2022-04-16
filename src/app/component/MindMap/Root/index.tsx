import * as React from "react"
import { INode, IStore } from "XmindTypes";
import { updateNodeAction, selectCurNodeAction } from "../../../actions/index";
import "./index.less";
import { useDispatch, useSelector } from 'react-redux';
import classNames from "classnames";

const { useRef, useEffect } = React;

interface INodeProps {
  node: INode
  selectNode: INode
  layoutMode: string;
}

function Node({ node, selectNode, layoutMode }: INodeProps) {
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

  const style = {
    opacity: node.x === 0 ? 0 : 1,
    top: node.y,
    left: node.x
  };
  return <>
      <div
        className={clsName}
        ref={element}
        style={style}
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

  const { nodeList, curNode, layoutMode } = useSelector((store: IStore) => store);
  
  return <div ref={MindWrapRef} className="mind-map-nodes">
    {
      nodeList.map((item) => <Node
        key={item.id}
        node={item}
        selectNode={curNode}
        layoutMode={layoutMode}
      />)
    }
    {/* <ConnectLine /> */}
  </div>
}

export default RootNode;