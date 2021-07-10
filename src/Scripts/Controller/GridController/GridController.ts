import * as PIXI from 'pixi.js';
import * as PW from "../../lib/PixiWrapper";
import * as Util from "../../lib/Utilities";
import { app } from '../../../main';
import { Grid } from '../../Model/Grid/Grid';
import { UIFSM } from '../../View/ShipDesignUIHandlers/UIFSM';


export abstract class GridController<T extends Grid> {
    grid: T;
    container: PIXI.Container;
    cellSize: number = 32;

    protected columnSize: number;
    protected breadth: number;
    protected xOffset: number;
    protected yOffset: number;
    protected ctx: PIXI.Graphics;

    constructor(columnSize: number) {
        this.container = new PIXI.Container();
        this.container.sortableChildren = true;
        this.ctx = new PIXI.Graphics();
        this.container.addChild(this.ctx);
        this.columnSize = columnSize;
        this.breadth = this.cellSize * (columnSize + 1);
        this.xOffset = app.pixi.renderer.screen.width / 2 - this.breadth / 2;
        this.yOffset = app.pixi.renderer.screen.height / 2 - this.breadth / 2;
        this.draw();
    }

    abstract snapPointToGrid(shapeUIHandler: UIFSM, point: PIXI.Point): PIXI.Point;

    onUpdate() {
    }

    containCoord(point: PIXI.Point, isLocalToGrid: boolean) {
        let inc = (Number(!isLocalToGrid));
        let x = point.x + inc;
        let y = point.y + inc;
        return !(x < 1 || x > this.columnSize || y < 1 || y > this.columnSize);
    }

    containPointInWorld(x, y): boolean {
        return (this.xOffset - this.cellSize / 2) <= x && x <= (this.breadth + this.xOffset + this.cellSize / 2)
            && (this.yOffset - this.cellSize / 2) <= y && y <= (this.breadth + this.yOffset + this.cellSize / 2);
    }

    intersectedWith(x, y, width, height) {
        let x1 = this.xOffset;
        let y1 = this.yOffset;
        let x2 = this.breadth + this.xOffset;
        let y2 = this.breadth + this.yOffset;
        if (x1 >= x + width || x >= x2)
            return false;
        if (y1 >= y + height || y >= y2)
            return false;
        return true;
    }

    snapCoordToGrid(coord: PIXI.Point): PIXI.Point {
        return coord.set(
            coord.x * this.cellSize + this.xOffset,
            coord.y * this.cellSize + this.yOffset
        )
    }

    centerOfGridCoord(): number {
        return Math.floor(this.columnSize / 2);
    }

    confinePoint(shapeUIHandler: UIFSM, point: PIXI.Point): PIXI.Point {
        let shapeGridPosition = shapeUIHandler.shape.getGridPosition();
        point.x = Util.clamp(shapeGridPosition.x + point.x, 0, this.columnSize - 1) - shapeGridPosition.x;
        point.y = Util.clamp(shapeGridPosition.y + point.y, 0, this.columnSize - 1) - shapeGridPosition.y;
        return point;
    }

    private draw() {
        this.ctx.clear();
        for (let i = 1; i <= this.columnSize; ++i) {
            const startCoord = i * this.cellSize;
            PW.drawLine(this.ctx,
                startCoord + this.xOffset, 0 + this.yOffset,
                startCoord + this.xOffset, this.breadth + this.yOffset,
                3);
            PW.drawLine(this.ctx,
                0 + this.xOffset, startCoord + this.yOffset,
                this.breadth + this.xOffset, startCoord + this.yOffset,
                3);
        }
        this.ctx.endFill();
    }
}