import * as React from "react"
import Root from "./Root";
import "./index.less";
import ConnectLine from "../ConnectLine";

function Pannel() {
  return <div className="pannel">
    <Root />
    <ConnectLine />
  </div>
}

export default Pannel;