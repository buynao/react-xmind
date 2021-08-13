import { v4 as uuidv4 } from 'uuid';
import { MIN_HEIGHT } from "../app/constants";

export interface IXmindNode {
  parent?: IXmindNode | null;
  children?: IXmindNode[];
  content?: string;
  id: string;
  deep?: number;
  index?: number;
  x: number;
  y: number;
  element?: HTMLDivElement | null;
  minHeight: number;
}

export class XmindNode implements IXmindNode {
  index;
  parent;
  children: [];
  content;
  id;
  deep;
  element;
  minHeight; // 当前节点的子节点最大高度
  public x: number;
  public y: number;
  constructor(props: IXmindNode) {
    this.parent = props.parent || null;
    this.children = [];
    this.content = props.content || '子节点';
    this.id = props.id || uuidv4().slice(0, 8);
    this.deep = props.deep || 0;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.index = props.index || 0;
    this.element = props.element || null;
    this.minHeight = props.minHeight || MIN_HEIGHT;
  }
}