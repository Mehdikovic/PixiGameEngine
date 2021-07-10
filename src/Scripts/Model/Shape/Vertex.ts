import { IVertex } from "../../lib/Utilities";
import { Shape } from "./Shape";


export class Vertex implements IVertex {
    shape: Shape;
    sortedIndex: number = -1;

    private _x: number;
    private _y: number;
    private _interactive: boolean;

    constructor(sortedIndex: number, x, y, shape: Shape, interactable = true) {
        this.sortedIndex = sortedIndex;
        this._x = x;
        this._y = y;
        this.shape = shape;
        this._interactive = interactable;
    }

    reinitialize(x, y): Vertex {
        this._x = x;
        this._y = y;
        return this;
    }

    get interactive() { return this._interactive; }
    get x() { return this._x; }
    get y() { return this._y; }
    get point(): IVertex { return { x: this._x, y: this._y }; }

    changeX(value) {
        this._x = value;
    }

    changeY(value) {
        this._y = value;
    }
}