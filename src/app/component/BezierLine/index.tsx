import * as React from "react";
import { IStore } from "XmindTypes";
import { useSelector } from 'react-redux';

function BezierLine () {
  const { nodeList } = useSelector((store: IStore) => store);

  return <svg width="40" height="800" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 L90 300" stroke="#000000" style={{
    strokeWidth: '5px'
  }}></path>
</svg>
}

export default BezierLine;