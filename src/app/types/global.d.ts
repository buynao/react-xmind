

declare module "XmindTypes" {
  export type IWrap = {
    width: number;
    height: number;
  }
  export interface INode {
    parent?: INode | null;
    children?: INode[];
    content?: string;
    id: string;
    deep?: number;
    index?: number;
    x: number;
    y: number;
    element?: HTMLDivElement;
    wrap?: IWrap;
  }
  
  export type INodes = INode[];
  
  export interface IStore {
    nodeList: INodes;
    curNode: INode;
  }
}