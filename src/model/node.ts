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
    this.id = props.id;
    this.deep = props.deep || 0;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.index = props.index || 0;
    this.element = props.element;
    this.wrap = props.wrap || {
      width: 0,
      height: 0
    }
  }
}