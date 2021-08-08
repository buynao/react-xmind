import * as React from "react";
import Menu from "./component/Menu";
import Pannel from "./component/Pannel";
import { useStore } from "react-redux";
import { IStore } from "../store/root-reducers"
import { useSelector } from 'react-redux'


function XMind() {
  const root = useSelector((store: IStore) => store.root);
  console.log('app_root', root);
  return <>
    <Menu/>
    <Pannel
      root={root}
    />
  </>
}

export default XMind;