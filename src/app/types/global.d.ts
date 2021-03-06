

declare module "XmindTypes" {
  export type IWrap = {
    width: number;
    height: number;
  }
  export type ConnectLine = {
    from: {
      x: number;
      y: number;
    },
    q: {
      x: number;
      y: number;
    },
    to: {
      x: number;
      y: number;
    };
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
    element?: HTMLDivElement | null;
    wrap?: IWrap;
    isRoot?: boolean;
    ele?: {
      width: number;
      height: number;
    }
  }
  
  export type INodes = INode[];
  export type Direction = 'left' | 'right' | 'mid';
  export interface IStore {
    nodeList: INodes;
    curNode: INode;
    layoutMode: Direction;
    nodesLine: ConnectLine[];
  }
}
declare module 'classnames';