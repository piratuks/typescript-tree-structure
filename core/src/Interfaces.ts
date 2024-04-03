import { v4 as uuidv4 } from 'uuid';

export interface CustomObjectOption {
  id?: string;
  children?: CustomObject[];
  width: number;
  height: number;
}

export interface CustomObjectMeta {
  getChildren: () => CustomObject[];
  getId: () => string;
  getWidth: () => number;
  getHeight: () => number;
  getPosition: () => Position;

  setId: (id: string) => void;
  setChildren: (childTables: CustomObject[]) => void;
  setChild: (childTables: CustomObject) => void;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setPosition: (position: Position) => void;
}

export class CustomObject implements CustomObjectMeta {
  private children: CustomObject[];
  private id: string;
  private width: number;
  private height: number;
  private position: Position = { x: 0, y: 0 };

  constructor({ children = [], id, width, height }: CustomObjectOption) {
    this.children = children;
    this.id = id ? id : uuidv4();
    this.width = width;
    this.height = height;
  }

  getChildren = () => this.children;
  getId = () => this.id;
  getWidth = () => this.width;
  getHeight = () => this.height;
  getPosition = () => this.position;

  setChild = (childTable: CustomObject) => {
    this.children.push(childTable);
    this.children = this.children.sort((a, b) => (b.getChildren().length || 0) - (a.getChildren().length || 0));
  };
  setChildren = (childTables: CustomObject[]) => {
    this.children = childTables.sort((a, b) => (b.getChildren().length || 0) - (a.getChildren().length || 0));
  };
  setId = (id: string) => {
    this.id = id;
  };
  setWidth = (width: number) => {
    this.width = width;
  };
  setHeight = (height: number) => {
    this.height = height;
  };
  setPosition = (position: Position) => {
    this.position = position;
  };
  clone = (): CustomObject => {
    const cloned = new CustomObject({
      id: this.id,
      children: this.children,
      width: this.width,
      height: this.height
    });

    return cloned;
  };
}

export interface Position {
  x: number;
  y: number;
}

export interface CustomObjectFormated extends CustomObject {
  group?: string;
  level?: number;
}

export interface SortedGroups {
  root: CustomObjectFormated;
  children: SortedGroups[];
}

export enum Orientation {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export interface LayoutCoordinator {
  prepare: (data: CustomObject[]) => void;
  execute: () => void;
}

export interface LayoutCoordinatorExtra {
  customObjectSpace: number;
  orientation: Orientation;
}
