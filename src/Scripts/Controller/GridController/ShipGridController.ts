import * as PIXI from 'pixi.js';
import { sceneManager } from '../../../main';
import { ShipGrid } from '../../Model/Grid/ShipGrid';
import { ShipUIFSM } from '../../View/ShipDesignUIHandlers/ShipUI/ShipUIFSM';
import { Shape } from '../../Model/Shape/Shape';
import { GridController } from './GridController';

export class ShipGridController extends GridController<ShipGrid>  {
    private shapeUIs: ShipUIFSM[] = [];

    constructor(columnSize: number) {
        super(columnSize);
        this.grid = new ShipGrid(columnSize);

        let shap1 = new Shape(1, 1, 0xff0000);
        let shap2 = new Shape(2, 2, 0xff00ff);
        let shap3 = new Shape(3, 2, 0x00ffff);
        let shap4 = new Shape(1, 2, 0xf0ff0f);

        this.shapeUIs.push(new ShipUIFSM(this, shap1, sceneManager.scene.mainCamera.right - 100, 50));
        this.shapeUIs.push(new ShipUIFSM(this, shap2, sceneManager.scene.mainCamera.right - 100, 150));
        this.shapeUIs.push(new ShipUIFSM(this, shap3, sceneManager.scene.mainCamera.right - 100, 250));
        this.shapeUIs.push(new ShipUIFSM(this, shap4, sceneManager.scene.mainCamera.right - 100, 350));
    }

    onUpdate() {
        this.shapeUIs.forEach(shipUI => {
            shipUI.onUpdate();
        });
    }

    snapPointToGrid(shipUI: ShipUIFSM, point: PIXI.Point): PIXI.Point {
        let x = point.x;
        let y = point.y;
        x -= this.xOffset;
        y -= this.yOffset;
        x = Math.round(x / this.cellSize);
        y = Math.round(y / this.cellSize);

        if (x >= 1 - shipUI.shape.left && x <= this.columnSize - shipUI.shape.right &&
            y >= 1 - shipUI.shape.top && y <= this.columnSize - shipUI.shape.bottom) {
            shipUI.shape.setGridPosition(this.grid, x - 1, y - 1);
            return point.set(x * this.cellSize + this.xOffset, y * this.cellSize + this.yOffset);
        } else {
            x += x <= 0 ? -shipUI.shape.right : shipUI.shape.left;
            y += y <= 0 ? -shipUI.shape.bottom : shipUI.shape.top;
            shipUI.shape.setGridPosition(this.grid, x, y);
            return point;
        }
    }

    addToGridStructure(shipUI: ShipUIFSM) {
        if (!shipUI.shape.isInGrid) return;
        console.log("called", shipUI.shape.getGridPosition());
        /*  let x = segmentUI.container.x;
         let y = segmentUI.container.y;
         if (!this.isIntersectWith(x - segmentUI.width / 2, y - segmentUI.height / 2, segmentUI.width, segmentUI.height)) {
             this.grid.removeShipSegment(segmentUI.shipSegment);
             return;
         }
         //TODO bug exist here - we have to take care of all points of segment sprites not just one of them
         segmentUI.container.position.set(segmentUI.prevPosOfContainer.x, segmentUI.prevPosOfContainer.y);
 
         x -= this.xOffset;
         y -= this.yOffset;
 
         x = Math.round(x / this.cellSize);
         y = Math.round(y / this.cellSize);
 
         if (x < 1 || x > this.columnSize || y < 1 || y > this.columnSize) return;
 
         if (this.grid.addElement(x - 1, y - 1, segmentUI.shipSegment)) {
             segmentUI.container.position.set(x * this.cellSize + this.xOffset, y * this.cellSize + this.yOffset);
         } */
    }
}