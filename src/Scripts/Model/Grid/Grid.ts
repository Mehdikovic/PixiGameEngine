import EventEmitter from 'events';
import * as Utils from '../../lib/Utilities';

export class Grid extends EventEmitter {
    protected _size: number;
    protected _cells: boolean[];

    onElementAdded: symbol = Symbol("onElementAdded");
    onElementRemoved: symbol = Symbol("onElementRemoved");

    constructor(size: number) {
        super();
        this._size = size;
        this._cells = new Array<boolean>(size * size);
    }

    get size() { return this._size }
    get width() { return this._size }
    get height() { return this._size }

    getCell(x: number, y: number): boolean { return this._cells[this.getIndex(x, y)] }
    setCell(x: number, y: number, val: boolean) { this._cells[this.getIndex(x, y)] = val }

    getIndex = (x, y) => Utils.getIndex(x, y, this._size);
}

export interface IGridComposition {
    addedToGrid(x: number, y: number): void;
    removedFromGrid(): void;
    isInGrid: boolean;
    centerx: number;
    centery: number;
}

export class CompositionGrid<T extends IGridComposition> extends Grid {
    protected _elements: T[];

    constructor(size: number) {
        super(size);
        this._elements = new Array<T>(size * size);
    }

    addElement(newx: number, newy: number, element: T): boolean {
        if (this.getCell(newx, newy)) { return false; }

        this.removeElement(element);

        element.addedToGrid(newx, newy);
        this.setCell(newx, newy, true);
        this._elements[this.getIndex(newx, newy)] = element;
        this.emit(this.onElementAdded, element);
        return true;
    };

    removeElement(element: T): void {
        if (element.isInGrid) {
            this.emit(this.onElementRemoved, element);
            this._elements[this.getIndex(element.centerx, element.centery)] = null;
            this.setCell(element.centerx, element.centery, false);
            element.removedFromGrid();
        }
    }

    getElement(x: number, y: number): T { return this._elements[this.getIndex(x, y)] }
    getElements(): T[] { return this._elements }
}