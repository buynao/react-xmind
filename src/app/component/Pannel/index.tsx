import * as React from "react"
import Root from "./Root";
import { IXmindNode } from "../../../model/node";

interface IProps {
  root: IXmindNode[]
}

function Pannel(props: IProps) {
  return <div>
    画布
    <Root node={props.root}/>
  </div>
}

export default Pannel;