import { TimeTicket } from 'yorkie-js-sdk';
import { ToolType } from 'features/boardSlices';
import { Root, Shape, Point } from 'features/docSlices';
import { LineOption } from '../line';
import { RectOption } from '../rect';

type Options = LineOption | RectOption;

abstract class Worker {
  abstract type: ToolType;

  abstract update: Function;

  abstract mousedown(point: Point, options: Options): void;

  abstract mousemove(point: Point): void;

  abstract mouseup(): void;

  abstract flushTask(): void;

  getElementByID(root: Root, createID: TimeTicket): Shape | undefined {
    try {
      return root.shapes.getElementByID(createID);
    } catch {
      return undefined;
    }
  }

  deleteByID(root: Root, createID: TimeTicket): Shape | undefined {
    try {
      return root.shapes.deleteByID(createID);
    } catch {
      return undefined;
    }
  }

  clearAll() {
    this.update((root: Root) => {
      for (const shape of root.shapes) {
        this.deleteByID(root, shape.getID());
      }
    });
  }
}

export default Worker;
