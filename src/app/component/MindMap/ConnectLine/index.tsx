import * as React from "react";
import { IStore } from "XmindTypes";
import { useSelector } from 'react-redux';

function ConnectLine ({ MindConnectLineRef }: any) {
  const { nodesLine, layoutMode } = useSelector((store: IStore) => store);
  console.log(nodesLine);
  return <svg ref={MindConnectLineRef} className="ConnectLine-svg" width="100%" height="100%" version="1.1">
    {
      nodesLine.map((line, index) => {
        const start = line.from;
        const to = line.to;
        const Q = line.q;
  
        return <path
          key={index}
          d={`M${start.x} ${start.y} Q${Q.x} ${Q.y} ${to.x} ${to.y}`}
          fill="none"
          stroke="#000000"
          style={{
            strokeWidth: '2px'
          }}
        />
      })
    }
</svg>
}

export default ConnectLine;