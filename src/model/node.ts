import { v4 as uuidv4 } from 'uuid';

export interface IXmindNode {
  parent?: IXmindNode | null;
  children?: IXmindNode[];
  content?: string;
  id?: string;
  deep?: number;
  x: number;
  y: number;
}

export class XmindNode implements IXmindNode {
  parent;
  children: [];
  content;
  id;
  deep;
  public x: number;
  public y: number;
  constructor(props?: IXmindNode) {
    this.parent = props?.parent || null;
    this.children = [];
    this.content = props?.content || '子节点';
    this.id = props?.id || uuidv4();
    this.deep = props?.deep || 0;
    this.x = props?.x || 0;
    this.y = props?.y || 0;
  }
}