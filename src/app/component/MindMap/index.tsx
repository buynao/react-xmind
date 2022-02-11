import * as React from "react"
import ConnectLine from "./ConnectLine";
import Root from "./Root";
import "./index.less";
export const isPC = () => { //是否为PC端
  var userAgentInfo = navigator.userAgent;
  var Agents = ["Android", "iPhone",
              "SymbianOS", "Windows Phone",
              "iPad", "iPod"];
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
      }
  }
  return flag;
}
export const getEvent = (e:any) => {
  return isPC() ? e : e.targetTouches[0]
};
export const getTouchPosition = (e: any) => {
  const event = getEvent(e);
  const x = event.pageX;
  const y = event.pageY;
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  console.log(`初始位移x:${x}，y:${y}`)
  console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
  return {
    x,
    y
  }
}
const { useState, useRef } = React;

type MoveEvent =  React.MouseEvent<HTMLDivElement, MouseEvent>;

function MindMap() {
  const isMoveRef = useRef(false);
  const MovePos = useRef({ x: 0, y: 0 });
  const MindMapPos = useRef({ x: 0, y: 0 });
  const MindWrapRef = useRef<HTMLDivElement>(null);
  const MindConnectLineRef = useRef<HTMLDivElement>(null);


  const moveDown = (e: MoveEvent) => {
    MovePos.current = getTouchPosition(e);
    isMoveRef.current = true;
  }

  const move = (e: MoveEvent) => {
    if (isMoveRef.current) {
      const newPos = getTouchPosition(e);
      const diff = {
          x: newPos.x - MovePos.current.x + MindMapPos.current.x,
          y: newPos.y - MovePos.current.y + MindMapPos.current.y
      };
      if (MindWrapRef.current && MindConnectLineRef.current) {
          MindWrapRef.current.style.transform = `translate(${diff.x}px, ${diff.y}px)`;
          MindConnectLineRef.current.style.transform = `translate(${diff.x}px, ${diff.y}px)`;
      }
    }
  }
  const moveUp = (e: MoveEvent) => {
    const newPos = getTouchPosition(e);
    const diff = {
      x: newPos.x - MovePos.current.x + MindMapPos.current.x,
      y: newPos.y - MovePos.current.y + MindMapPos.current.y
    };
    isMoveRef.current = false;
    MindMapPos.current = diff;
  }

  return <div
          onMouseDown={(e) => moveDown(e)}
          onMouseMove={(e) => move(e)}
          onMouseUp={(e) => moveUp(e)}
          className="mind-map-wrap"
      >
      <ConnectLine MindConnectLineRef={MindConnectLineRef}/>
      <Root  MindWrapRef={MindWrapRef} />
  </div>
}

export default MindMap;