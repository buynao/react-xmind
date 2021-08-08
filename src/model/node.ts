import { v4 as uuidv4 } from 'uuid';

export interface IXmindNode {
  parent?: IXmindNode | null;
  children?: IXmindNode[];
  content?: string;
  id?: string;
  deep?: number;
}

export class XmindNode implements IXmindNode {
  parent;
  children: [];
  content;
  id;
  deep;
  constructor(props?: IXmindNode) {
    this.parent = props?.parent || null;
    this.children = [];
    this.content = props?.content || '子节点';
    this.id = props?.id || uuidv4();
    this.deep = props?.deep || 0;
  }
}