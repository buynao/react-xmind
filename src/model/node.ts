import { v4 as uuidv4 } from 'uuid';
import { INode } from 'XmindTypes';

export class XmindNode implements INode {
  index;
  parent;
  children: [];
  content;
  id;
  deep;
  element;
  wrap;
  public x: number;
  public y: number;
  constructor(props: INode) {
    this.parent = props.parent || null;
    this.children = [];
    this.content = props.content || '子节点';
    this.id = props.id || uuidv4().slice(0, 8);
    this.deep = props.deep || 0;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.index = props.index || 0;
    this.element = props.element || null;
    this.wrap = props.wrap || {
      width: 0,
      height: 0
    }
  }
}