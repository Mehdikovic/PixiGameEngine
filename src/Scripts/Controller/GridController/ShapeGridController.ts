import * as PIXI from 'pixi.js';
import * as Util from "../../lib/Utilities";
import { Grid } from '../../Model/Grid/Grid';
import { GridController } from './GridController';
import { ShapeUIFSM } from '../../View/ShipDesignUIHandlers/ShapeUI/ShapeUIFSM';

export class ShapeGridController extends GridController<Grid> {
    shapeUI: ShapeUIFSM;

    constructor(columnSize: number) {
        super(columnSize);
        this.grid = new Grid(columnSize);
        this.shapeUI = new ShapeUIFSM(this, 0x00ff00);
    }

    onUpdate() {
        this.shapeUI.onUpdate();
    }

    snapPointToGrid(shapeUIHandler: ShapeUIFSM, point: PIXI.Point): PIXI.Point {
        let x = point.x;
        let y = point.y;
        x -= this.xOffset;
        y -= this.yOffset;
        x = Math.round(x / this.cellSize);
        y = Math.round(y / this.cellSize);
        x = Util.clamp(x, 1 - shapeUIHandler.shape.left, this.columnSize - shapeUIHandler.shape.right);
        y = Util.clamp(y, 1 - shapeUIHandler.shape.top, this.columnSize - shapeUIHandler.shape.bottom);
        shapeUIHandler.shape.setGridPosition(this.grid, x - 1, y - 1);
        return point.set(x * this.cellSize + this.xOffset, y * this.cellSize + this.yOffset);
    }
}