import * as React from "react"
import Root from "./Root";
import { IXmindNode } from "../../../model/node";
import "./index.less";
interface IProps {
  root: IXmindNode[]
}

function Pannel(props: IProps) {
  return <div className="pannel">
    <Root node={props.root}/>
  </div>
}

export default Pannel;