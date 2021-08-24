import * as React from "react"
import { INode, IStore } from "XmindTypes";
import { updateNodeAction, selectCurNodeAction } from "../../../actions/index";
import "./index.less";
import { useDispatch, useSelector } from 'react-redux';
import classNames from "classnames";
import { getRootNode } from "../../../control/index";

const { useRef, useEffect } = React;

interface INodeProps {
  node: INode
  selectNode: INode
}

function Node({ node, selectNode }: INodeProps) {
  const dispatch = useDispatch();
  const clsName = classNames("node", {
    "select": node.id === selectNode?.id,
    "root-node": !node.parent,
    "second-node": node.deep === 1
  });
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const needUpate = {
      curNode: {
        ...node,
        element: element.current as HTMLDivElement
      }
    }

    dispatch(updateNodeAction(needUpate))

    return () => {
      console.log('释放element')
      node.element = undefined;
    }
  }, []);

  return <>
      <div
        className={clsName}
        ref={element}
        style={{
            left: node.x,
            top: node.y
          }}
        onClick={() => {
          dispatch(selectCurNodeAction({
            ...node
          }))
        }}>
          <p>{`height: ${node.wrap?.height}`}</p>
          <p>{`ID:${node.id}`}</p>
      </div>
    </>
}

function RootNode() {

  const { nodeList, curNode } = useSelector((store: IStore) => store);
  const rootNode = getRootNode(nodeList[0]);

  return <>
    {
      nodeList.map((item) => <Node
        key={item.id}
        node={item}
        selectNode={curNode}
      />)
    }
  </>
}

export default RootNode;