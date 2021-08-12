import * as React from "react";
import Menu from "./component/Menu";
import Pannel from "./component/Pannel";
import { useStore } from "react-redux";
import { IStore } from "../store/root-reducers";
import { useSelector } from 'react-redux';


function XMind() {
  return <>
    <Menu />
    <Pannel />
  </>
}

export default XMind;