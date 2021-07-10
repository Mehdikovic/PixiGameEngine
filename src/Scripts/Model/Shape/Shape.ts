import { point } from "../../lib/Utilities";
import * as Util from "../../lib/Utilities";
import { Vertex } from "./Vertex";
import EventEmitter from 'events';
import { Grid, IGridComposition } from "../Grid/Grid";

export class Shape extends EventEmitter implements IGridComposition {
    shapeId: number = -1;
    scaled: point = { x: 1, y: 1 };
    color: number;

    private vertices: Vertex[];
    private localCenter: point;
    private localPositionOnGrid: point;
    private gridIndex: number = 0;
    private angle = 0;

    private _left: number = 0;
    private _right: number = 0;
    private _top: number = 0;
    private _bottom: number = 0;

    onManualSort: symbol = Symbol("onManualSort");

    constructor(width: number, height: number, color: number) {
        super();
        this.color = color;
        this.vertices = [];
        this.localCenter = { x: -1, y: -1 };
        this.localPositionOnGrid = { x: -1, y: -1 };
        for (let index = 0; index < 3; index++) {
            let { x, y } = Util.getPosition(index, 2);
            this.vertices.push(
                //new Vertex(index, x * width, y * height, this)
                new Vertex(index, x * width, y * height, this, index !== 0)
            );
        }
        this.calculateBounds();
    }

    getVertices(): Vertex[] { return this.vertices; }

    getLocalCenter(): point { return this.localCenter; }
    get localCenterX(): number { return this.localCenter.x; }
    get localCenterY(): number { return this.localCenter.y; }

    get left(): number { return this._left; }
    get right(): number { return this._right; }
    get top(): number { return this._top; }
    get bottom(): number { return this._bottom; }

    get width() { return this._right - this._left; }
    get height() { return this._bottom - this._top; }

    getGridPosition(): point { return this.localPositionOnGrid; }

    setGridPosition(grid: Grid, x: number, y: number) {
        this.localPositionOnGrid.x = x;
        this.localPositionOnGrid.y = y;
        this.gridIndex = grid.getIndex(x, y);
        this._isInGrid = (x + this.left >= 0 && x + this.right < grid.size && y + this.top >= 0 && y + this.bottom < grid.size);
    }

    rotateRight() { this.rotateTheShape(90) }
    rotateLeft() { this.rotateTheShape(-90) }

    addVertexToShape(x: number, y: number): boolean {
        if (x === 0 && y === 0) return false;
        let vertexToRemove: Vertex = null;
        for (const vertex of this.vertices) {
            if (vertex.x === x && vertex.y === y) {
                vertexToRemove = vertex;
                break;
            };
        }

        if (vertexToRemove && this.vertices.length > 3) {
            this.vertices = sliceArrayElement(this.vertices, vertexToRemove);
        } else if (!vertexToRemove) {
            this.vertices.push(
                new Vertex(this.vertices.length, x, y, this)
            );
        }
        return true;
    }

    manualSort() {
        this.vertices = this.vertices.sort((a, b) => {
            if (a.sortedIndex !== b.sortedIndex)
                return a.sortedIndex - b.sortedIndex;
            else {
                return 0;
                // TODO better decision could be made here, when we insert new vertex we might encounter equal state
            }
        });
        this.vertices.forEach((vertex, index) => {
            vertex.sortedIndex = index;
        });
        this.emit(this.onManualSort);
    }

    calculateBounds() {
        this._left = Number.MAX_SAFE_INTEGER;
        this._right = Number.MIN_SAFE_INTEGER;
        this._top = Number.MAX_SAFE_INTEGER;
        this._bottom = Number.MIN_SAFE_INTEGER;
        this.vertices.forEach(vertex => {
            if (vertex.x < this._left) this._left = vertex.x;
            if (vertex.x > this._right) this._right = vertex.x;
            if (vertex.y < this._top) this._top = vertex.y;
            if (vertex.y > this._bottom) this._bottom = vertex.y;
        });
        this.localCenter.x = (this._right - this._left) / 2 * (Math.abs(this._right) > Math.abs(this._left) ? 1 : -1);
        this.localCenter.y = (this._bottom - this._top) / 2 * (Math.abs(this._bottom) > Math.abs(this._top) ? 1 : -1);
    }

    // BEGIN of IGridComposition
    private _isInGrid: boolean;
    get centerx(): number { return this.localPositionOnGrid.x };
    get centery(): number { return this.localPositionOnGrid.y };
    get isInGrid(): boolean { return this._isInGrid };

    addedToGrid(x: number, y: number): void {
        throw new Error("Method not implemented.");
    }
    removedFromGrid(): void {
        throw new Error("Method not implemented.");
    }
    // END of IGridComposition

    private rotateTheShape(angle) {
        this.vertices.forEach(vertex => {
            vertex = rotate(vertex, angle);
        });
        this.calculateBounds();
    }
}

const rotate = (vertex: Vertex, angle: number): Vertex => {
    let absAngle = Math.abs(angle);
    if (absAngle % 90 !== 0) {
        console.error("angle is not 90 degree or other forms of it")
        return;
    };

    if (angle < 0) {
        let remainder = absAngle % 360;
        angle = 360 - remainder;
    } else {
        angle %= 360;
    }

    let x = vertex.x;
    let y = vertex.y;
    switch (angle) {
        case 90:
            x = -vertex.y;
            y = vertex.x;
            break;
        case 180:
            x = -vertex.x;
            y = -vertex.y;
            break;
        case 270:
            x = vertex.y;
            y = -vertex.x;
            break;
    }
    return vertex.reinitialize(x, y);
}

const sliceArrayIndex = (arr: Vertex[], index) => {
    let result: Vertex[] = [];
    arr.forEach((vert, i) => {
        if (i !== index) result.push(vert);
    });
    return result;
}

const sliceArrayElement = (arr: Vertex[], element: Vertex) => {
    let result: Vertex[] = [];
    arr.forEach((vert) => {
        if (vert.x !== element.x || vert.y !== element.y) result.push(vert);
    });
    return result;
}