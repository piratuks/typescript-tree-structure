import { v4 as uuidv4 } from 'uuid';
import {
  CustomObject,
  CustomObjectFormated,
  LayoutCoordinator,
  LayoutCoordinatorExtra,
  Orientation,
  Position,
  SortedGroups
} from './Interfaces';

export class TreeStructure implements LayoutCoordinator {
  private customObjectSpace: number = 0;
  private orientation: Orientation;
  private groups: CustomObjectFormated[][] = [];
  private sortedGroups: SortedGroups[] = [];
  private customObjects: CustomObjectFormated[] = [];
  // This is the coordinates for the top left corner of each group
  private coordinates: Position[] = [];
  // This is the group distances
  private distances: number[] = [];

  constructor({ customObjectSpace, orientation }: LayoutCoordinatorExtra) {
    this.customObjectSpace = customObjectSpace;
    this.orientation = orientation;
  }

  /**
   * Prepares and organizes objects for further processing by organizing them into groups and sorting the groups.
   * @param {CustomObject[]} customObjects - The objects to be prepared.
   */
  prepare = (customObjects: CustomObject[]) => {
    this.customObjects = customObjects;
    this.organizeObjectsIntoGroups(customObjects);
    this.sortGroups();
  };

  /**
   * Executes the processing steps for calculating distances between objects.
   * This method triggers the calculation of distances between objects.
   */
  execute = () => {
    this.distance();
  };

  /**
   * Finds and returns the parent object of a given object from a list of objects based on their parent-child relationships.
   * @param {CustomObjectFormated[]} customObjects - The list of objects to search for the parent.
   * @param {CustomObjectFormated} currentCustomObject - The object for which to find the parent.
   * @returns {CustomObjectFormated | undefined} The parent object, or undefined if no parent is found.
   */
  private getParentFromObjects = (customObjects: CustomObjectFormated[], currentCustomObject: CustomObjectFormated) => {
    return customObjects.find(item =>
      item.getChildren().some(childObj => childObj.getId() === currentCustomObject.getId())
    );
  };

  /**
   * Organizes objects into groups based on their parent-child relationships using a level-wise traversal.
   * @param {CustomObjectFormated[]} customObjects - The objects to be organized into groups.
   */
  private organizeObjectsIntoGroups = (customObjects: CustomObjectFormated[]) => {
    const result: CustomObjectFormated[] = [];
    const queue: CustomObjectFormated[] = [];
    const groups: CustomObjectFormated[][] = [];

    // Step 1: Identify objects with no parent
    const noParents = customObjects.filter(object => {
      const parent = this.getParentFromObjects(customObjects, object);
      return !parent;
    });
    noParents.map(object => {
      object.level = 0;
      object.group = uuidv4();
    });

    // Step 2: Enqueue objects with no parent
    noParents.forEach(noParent => {
      const group: CustomObjectFormated[] = [];

      queue.push(noParent);

      // Step 3: Perform level-wise traversal
      while (queue.length > 0) {
        const currentObject = queue.shift()!;
        result.push(currentObject);

        // Enqueue children for the next level
        currentObject.getChildren().forEach((child: CustomObjectFormated) => {
          if (currentObject.level !== undefined) {
            child.level = currentObject.level + 1;
          }
          if (currentObject.group) {
            child.group = currentObject.group;
          }
          queue.push(child);
        });

        group.push(currentObject);
      }

      groups.push(group);
    });

    this.groups = groups;
  };

  /**
   * Recursively sorts the children of a object based on the number of their children,
   * creating a hierarchical structure of sorted groups.
   *
   * @param {CustomObjectFormated[]} children - The children objects to be sorted.
   * @returns {SortedGroups[]} An array of sorted groups with root objects and their sorted children.
   */
  private sortChildren = (children: CustomObjectFormated[]): SortedGroups[] => {
    // sort children
    children.sort((a, b) => b.getChildren().length - a.getChildren().length);
    const sc: SortedGroups[] = [];
    // iterate through children
    children.forEach(child => {
      // sort children if they exist
      let sortedchildren: SortedGroups[] = [];
      if (child.getChildren().length > 0) {
        sortedchildren = this.sortChildren(child.getChildren());
      }
      sc.push({
        root: child,
        children: sortedchildren
      });
    });

    return sc;
  };

  /**
   * Sorts groups based on the length of their elements and organizes them with their root rectangles and sorted children.
   */
  private sortGroups = () => {
    //sort the groups from the largest to the smallest
    this.groups.sort((a, b) => b.length - a.length);
    const sortedGroups: SortedGroups[] = [];
    //iterate through the groups sorting
    this.groups.forEach(group => {
      // get the root rectangle of the group
      const rootRectangle =
        group[
          group
            .map(rect => {
              const parent = this.getParentFromObjects(group, rect);
              return !parent;
            })
            .indexOf(true)
        ];
      // sort the children if they exist
      let sortedchildren: SortedGroups[] = [];
      if (rootRectangle?.getChildren().length > 0) {
        sortedchildren = this.sortChildren(rootRectangle?.getChildren());
      }
      sortedGroups.push({
        root: rootRectangle,
        children: sortedchildren
      });
    });
    this.sortedGroups = sortedGroups;
  };

  /**
   * Calculates the starting point of a smaller line within a larger container.
   * @param {number} left - The left position of the larger container.
   * @param {number} width - The width of the smaller line.
   * @returns {number} The starting point X-coordinate of the smaller line.
   */
  private calculateStartingPointOfSmallerLine = (left: number, width: number): number => {
    const midpointX = left / 2;
    const startingPointX = midpointX - width / 2;

    return startingPointX;
  };

  /**
   * Calculates the distance based on the orientation.
   * If the orientation is vertical, it calls distanceVertical();
   * otherwise, it calls distanceHorizontal().
   */
  private distance = () => {
    if (this.orientation === Orientation.vertical) {
      this.distanceVertical();
    } else {
      this.distanceHorizontal();
    }
  };

  /**
   * Distributes children along the specified axis within a parent container.
   * @param children - An array of sorted groups representing child elements.
   * @param axis - The axis along which the children should be distributed.
   * @param parentSize - The size of the parent container along the distribution axis.
   * @param parentEnd - The end position of the parent container along the distribution axis.
   */
  private distributeChildren = (
    children: SortedGroups[],
    axis: keyof Position,
    parentSize: number,
    parentEnd: number
  ) => {
    const remainingSpace = parentSize - parentEnd;
    const totalSpaces = children.length + 1;
    const spaceBetweenLines = remainingSpace / totalSpaces;
    children.forEach(subChild => {
      const pos = subChild.root.getPosition();
      subChild.root.setPosition({ ...pos, [axis]: pos[axis] + spaceBetweenLines });
    });
  };

  /**
   * Handles the horizontal orientation layout for a object and its children.
   * @param customObject - The sorted groups representing the object and its children.
   * @param x - The initial x-coordinate for positioning.
   * @param y - The y-coordinate for positioning.
   * @param childTopy - The top y-coordinate of child elements.
   * @param leftx - The left x-coordinate of the object.
   * @returns The updated x and y coordinates.
   */
  private handleHorizontalOrientation = (
    customObject: SortedGroups,
    x: number,
    y: number,
    childTopy: number,
    leftx: number
  ) => {
    const pos = this.childDistances(customObject.children, childTopy, x + leftx, Orientation.horizontal);
    const objectWidth = customObject.root.getWidth();
    const newX =
      pos.x > objectWidth ? this.calculateStartingPointOfSmallerLine(pos.x, objectWidth) + leftx + x : leftx + x;
    customObject.root.setPosition({ x: newX, y });
    if (pos.x > objectWidth) x += pos.x;
    else x = objectWidth;

    this.distributeChildren(customObject.children, 'x', objectWidth, pos.x);
    return { x, y };
  };

  /**
   * Handles the vertical orientation layout for a object and its children.
   * @param customObject - The sorted groups representing the object and its children.
   * @param x - The x-coordinate for positioning.
   * @param y - The initial y-coordinate for positioning.
   * @param topy - The top y-coordinate of the object.
   * @param childLeftx - The left x-coordinate of child elements.
   * @returns The updated x and y coordinates.
   */
  private handleVerticalOrientation = (
    customObject: SortedGroups,
    x: number,
    y: number,
    topy: number,
    childLeftx: number
  ) => {
    const pos = this.childDistances(customObject.children, y + topy, childLeftx, Orientation.vertical);
    const rootHeight = customObject.root.getHeight();
    const newY = pos.y > rootHeight ? this.calculateStartingPointOfSmallerLine(pos.y, rootHeight) + topy + y : topy + y;
    customObject.root.setPosition({ x, y: newY });
    if (pos.y > rootHeight) y += pos.y;
    else {
      y = rootHeight;
      this.distributeChildren(customObject.children, 'y', rootHeight, pos.y);
    }

    return { x, y };
  };

  /**
   * Sets the position based on orientation and index for a object.
   * @param customObject - The sorted groups representing the object.
   * @param x - The initial x-coordinate for positioning.
   * @param y - The initial y-coordinate for positioning.
   * @param leftx - The left x-coordinate of the object.
   * @param topy - The top y-coordinate of the object.
   * @param orientation - The orientation of the layout (horizontal or vertical).
   * @param index - The index of the object.
   * @returns The updated x and y coordinates.
   */
  private setPositionBasedOnOrientationAndIndex = (
    customObject: SortedGroups,
    x: number,
    y: number,
    leftx: number,
    topy: number,
    orientation: Orientation,
    index: number
  ) => {
    const objWidth = customObject.root.getWidth();
    const objHeight = customObject.root.getHeight();
    const space = this.customObjectSpace;

    if (orientation === Orientation.horizontal) {
      const newX = x + leftx + (index === 0 ? space : 0);
      customObject.root.setPosition({ x: newX, y: y });
      x += objWidth + space * (index === 0 ? 2 : 1);
    } else if (orientation === Orientation.vertical) {
      const newY = y + topy + (index === 0 ? space : 0);
      customObject.root.setPosition({ x: x, y: newY });
      y += objHeight + space * (index === 0 ? 2 : 1);
    }

    return { x, y };
  };

  /**
   * Calculates the position based on orientation and child elements for a object.
   * @param child - The sorted groups representing child elements.
   * @param topy - The top y-coordinate of the parent object.
   * @param leftx - The left x-coordinate of the parent object.
   * @param orientation - The orientation of the layout (horizontal or vertical).
   * @returns The calculated position.
   */
  private childDistances = (child: SortedGroups[], topy: number, leftx: number, orientation: Orientation): Position => {
    let x = orientation === Orientation.horizontal ? 0 : leftx;
    let y = orientation === Orientation.vertical ? 0 : topy;

    child.forEach((object, index) => {
      // check if child has children
      if (object.children.length > 0) {
        // Calculate matching objects and maximum dimensions
        const matchingObjects = this.customObjects.filter(
          a => a.level === object.root.level && a.group === object.root.group
        );
        const maxObjectHeight = Math.max(...matchingObjects.map(a => a.getHeight()));
        const maxObjectWidth = Math.max(...matchingObjects.map(a => a.getWidth()));

        // Calculate topy or leftx based on orientation
        const childTopy = orientation === Orientation.vertical ? 0 : y + maxObjectHeight + this.customObjectSpace;
        const childLeftx = orientation === Orientation.horizontal ? 0 : x + maxObjectWidth + this.customObjectSpace;

        if (orientation === Orientation.vertical) {
          ({ x, y } = this.handleVerticalOrientation(object, x, y, topy, childLeftx));
        } else {
          ({ x, y } = this.handleHorizontalOrientation(object, x, y, childTopy, leftx));
        }
      } else {
        // when the child has no children
        ({ x, y } = this.setPositionBasedOnOrientationAndIndex(object, x, y, leftx, topy, orientation, index));
      }
    });

    return { x, y };
  };

  /**
   * Calculates the distance between groups and rectangles, positioning them based on their relationships in a horizontal manner.
   *
   * @description This method organizes the groups and their children, calculating positions and distances
   * to create a visually balanced layout.
   */
  private distanceHorizontal = () => {
    // This is the space between groups and rectangles
    // create distance type
    this.groups.forEach(() => {
      this.coordinates.push({ x: 0, y: this.customObjectSpace });
      this.distances.push(0);
    });
    // used for spaces between individual groups
    // iterate through the groups
    this.sortedGroups.forEach((object, index) => {
      // necessary for group members
      let horizontalLength = 0; //space
      let verticalLength = 0;

      if (index > 0) {
        this.coordinates[index] = {
          y: this.customObjectSpace,
          x: this.distances[index - 1] + this.coordinates[index - 1].x
        };
      }
      if (object.children.length > 0) {
        // This is the bottom y coordinates of the root element
        verticalLength = object.root.getHeight() + this.customObjectSpace * 2;
        // This is the top y coordinates of the children to the root
        const ch = object.children;
        ch.forEach((child, subIndex) => {
          // check if child has children
          if (child.children.length > 0) {
            // top left y coordinate for children's children
            const y = verticalLength + Math.max(...ch.map(a => a.root.getHeight())) + this.customObjectSpace;
            const { x } = this.childDistances(
              child.children,
              y,
              horizontalLength + this.coordinates[index].x,
              this.orientation
            );
            //if chilren's combined length is greater than parent's
            if (x > child.root.getWidth()) {
              child.root.setPosition({
                x:
                  this.calculateStartingPointOfSmallerLine(x, child.root.getWidth()) +
                  horizontalLength +
                  this.coordinates[index].x,
                y: verticalLength
              });
              horizontalLength += x - this.customObjectSpace;
            } else {
              child.root.setPosition({ x: horizontalLength + this.coordinates[index].x, y: verticalLength });
              horizontalLength += child.root.getWidth();
              //reset children coordinates to be centrally positioned relative to the parent
              const remainingSpace = child.root.getWidth() - x;
              const totalSpaces = child.children.length + 1;
              const spaceBetweenLines = remainingSpace / totalSpaces;
              child.children.forEach(subChild => {
                const pos = subChild.root.getPosition();
                subChild.root.setPosition({ ...pos, x: pos.x + spaceBetweenLines });
              });
            }
          } else {
            // when the child has no children
            // update self coordinates
            if (subIndex === 0) {
              child.root.setPosition({
                x: horizontalLength + this.coordinates[index].x + this.customObjectSpace,
                y: verticalLength
              });
              // update horizontal position
              horizontalLength = horizontalLength + child.root.getWidth() + this.customObjectSpace;
            } else {
              child.root.setPosition({
                x: horizontalLength + this.coordinates[index].x + this.customObjectSpace,
                y: verticalLength
              });
              // update horizontal position
              horizontalLength = horizontalLength + child.root.getWidth() + this.customObjectSpace;
            }
          }
        });
        // the combined length of children is greater than parent length
        if (horizontalLength > object.root.getWidth()) {
          object.root.setPosition({
            x:
              this.calculateStartingPointOfSmallerLine(
                horizontalLength + this.customObjectSpace,
                object.root.getWidth()
              ) + this.coordinates[index].x,
            y: this.coordinates[index].y
          });
          this.distances[index] = horizontalLength;
        } else {
          object.root.setPosition({ x: this.coordinates[index].x, y: this.coordinates[index].y });
          this.distances[index] = object.root.getWidth();
          //reset children coordinates to be centrally positioned relative to the parent
          const remainingSpace = object.root.getWidth() - horizontalLength;
          const totalSpaces = object.children.length + 1;
          const spaceBetweenLines = remainingSpace / totalSpaces;
          ch.forEach(subChild => {
            const pos = subChild.root.getPosition();
            subChild.root.setPosition({ ...pos, x: pos.x + spaceBetweenLines });
          });
        }
      } else {
        object.root?.setPosition({
          x: this.coordinates[index].x + this.customObjectSpace,
          y: this.coordinates[index].y
        });
        this.distances[index] = object.root.getWidth() + this.customObjectSpace;
      }
    });
  };

  /**
   * Calculates the distance between groups and rectangles, positioning them based on their relationships in a vertical manner.
   *
   * @description This method organizes the groups and their children, calculating positions and distances
   * to create a visually balanced layout.
   */
  private distanceVertical = () => {
    // This is the space between groups and rectangles
    // create distance type
    this.groups.forEach(() => {
      this.coordinates.push({ x: this.customObjectSpace, y: 0 });
      this.distances.push(0);
    });

    // iterate through groups
    this.sortedGroups.forEach((object, index) => {
      let horizontalLength = 0;
      let verticalLength = 0;
      if (index > 0) {
        this.coordinates[index] = {
          x: this.customObjectSpace,
          y: this.distances[index - 1] + this.coordinates[index - 1].y
        };
      }
      if (object.children.length > 0) {
        // This is the bottom y coordinates of the root element
        horizontalLength = object.root.getWidth() + this.customObjectSpace * 2;
        // This is the top y coordinates of the children to the root
        //verticalLength = + space
        const ch = object.children;
        ch.forEach((child, subIndex) => {
          // check if child has children
          if (child.children.length > 0) {
            // top left y coordinate for children's children
            const x = horizontalLength + Math.max(...ch.map(a => a.root.getWidth())) + this.customObjectSpace;
            const { y } = this.childDistances(
              child.children,
              verticalLength + this.coordinates[index].y,
              x,
              this.orientation
            );
            //if chilren's combined length is greater than parent's
            if (y > child.root.getHeight()) {
              child.root.setPosition({
                x: horizontalLength,
                y:
                  this.calculateStartingPointOfSmallerLine(y, child.root.getHeight()) +
                  verticalLength +
                  this.coordinates[index].y
              });
              verticalLength += y - this.customObjectSpace;
            } else {
              child.root.setPosition({ x: horizontalLength, y: this.coordinates[index].y + verticalLength });
              verticalLength += child.root.getHeight();
              //reset children coordinates to be centrally positioned relative to the parent
              const remainingSpace = child.root.getHeight() - y;
              const totalSpaces = child.children.length + 1;
              const spaceBetweenLines = remainingSpace / totalSpaces;
              child.children.forEach(subChild => {
                const pos = subChild.root.getPosition();
                subChild.root.setPosition({ ...pos, y: pos.y + spaceBetweenLines });
              });
            }
          } else {
            // when the child has no children
            // update self coordinates
            if (subIndex === 0) {
              child.root.setPosition({
                x: horizontalLength,
                y: this.coordinates[index].y + this.customObjectSpace + verticalLength
              });
              // update horizontal position
              verticalLength = verticalLength + child.root.getHeight() + this.customObjectSpace;
            } else {
              child.root.setPosition({
                x: horizontalLength,
                y: this.coordinates[index].y + this.customObjectSpace + verticalLength
              });
              // update horizontal position
              verticalLength = verticalLength + child.root.getHeight() + this.customObjectSpace;
            }
          }
        });
        // the combined length of children is greater than parent length
        if (verticalLength > object.root.getHeight()) {
          object.root.setPosition({
            x: this.coordinates[index].x,
            y:
              this.calculateStartingPointOfSmallerLine(
                verticalLength + this.customObjectSpace,
                object.root.getHeight()
              ) + this.coordinates[index].y
          });
          this.distances[index] = verticalLength;
        } else {
          object.root.setPosition({ x: this.coordinates[index].x, y: this.coordinates[index].y });
          this.distances[index] = object.root.getHeight();
          //reset children coordinates to be centrally positioned relative to the parent
          const remainingSpace = object.root?.getHeight() - verticalLength;
          const totalSpaces = object.children.length + 1;
          const spaceBetweenLines = remainingSpace / totalSpaces;
          ch.forEach(subChild => {
            const pos = subChild.root.getPosition();
            subChild.root.setPosition({ ...pos, y: pos.y + spaceBetweenLines });
          });
        }
      } else {
        object.root?.setPosition({
          x: this.coordinates[index].x,
          y: this.coordinates[index].y + this.customObjectSpace
        });
        this.distances[index] = object.root?.getHeight() + this.customObjectSpace;
      }
    });
  };
}
