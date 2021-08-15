import * as React from "react";
import Menu from "./component/Menu";
import Pannel from "./component/Pannel";
import "./global.less";

function XMind() {
  return <>
  <Menu />
  <div className="mind-map">
    <Pannel />
  </div></>
}

export default XMind;