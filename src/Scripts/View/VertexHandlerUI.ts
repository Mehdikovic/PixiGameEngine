import { Graphics, Point, Text } from "pixi.js";
import { Vertex } from "../Model/Shape/Vertex";
import { ShapeUIFSM } from "./ShipDesignUIHandlers/ShapeUI/ShapeUIFSM";

export class VertexHandlerUI {
    shapeUIFSM: ShapeUIFSM;
    gfx: Graphics;

    mustBeUpdate: boolean = false;
    private vertex: Vertex;
    private text: Text;
    private temp: Point = new Point();

    constructor(shapeUI: ShapeUIFSM, vertex: Vertex) {
        this.gfx = new Graphics();
        this.shapeUIFSM = shapeUI;
        this.vertex = vertex;
        this.gfx.x = vertex.x * shapeUI.gridController.cellSize;
        this.gfx.y = vertex.y * shapeUI.gridController.cellSize;
        this.gfx.zIndex = 1000;
        this.gfx.interactive = true;
        this.gfx.visible = false;

        this.text = new Text(this.vertex.sortedIndex.toString(), { fontFamily: 'Arial', fontSize: 14, fill: 0xffffff, align: 'left' });
        this.text.visible = false;
        this.text.position.set(-10, 0);
        this.gfx.addChild(this.text);
        this.draw();
        this.shapeUIFSM.gfx.addChild(this.gfx);
    }

    get isInteractable() { return this.vertex.interactive; }

    reEvaluateVertex(vertex: Vertex) {
        this.vertex = vertex;
        this.gfx.x = vertex.x * this.shapeUIFSM.gridController.cellSize;
        this.gfx.y = vertex.y * this.shapeUIFSM.gridController.cellSize;
        this.draw();
    }

    onUpdate() {
        this.temp = this.shapeUIFSM.getLocalCoordOfMouseToShape();
        if (this.temp.x === 0 && this.temp.y === 0) return;

        this.temp = this.shapeUIFSM.gridController.confinePoint(this.shapeUIFSM, this.temp);
        this.vertex.changeX(this.temp.x);
        this.vertex.changeY(this.temp.y);

        this.shapeUIFSM.drawShape(this.shapeUIFSM.shape.color);
        this.reEvaluateVertex(this.vertex);
        this.gfx.tint = 0xffff00;
    }

    activeHandler() { this.gfx.visible = true; }
    deactiveHandler() { this.gfx.visible = false; }
    toggleHandler() { this.gfx.visible = !this.gfx.visible; }

    activeText() { this.text.visible = true; }
    deactiveText() { this.text.visible = false; }
    toggleText() { this.text.visible = !this.text.visible; }

    delete() {
        this.gfx.clear();
        this.gfx.interactive = false;
        this.gfx.removeAllListeners();
        this.gfx = null;
        this.vertex = null;
        this.shapeUIFSM = null;
    }

    setNewIndex(newIndex: number) {
        this.vertex.sortedIndex = newIndex;
        this.text.text = this.vertex.sortedIndex.toString();
        this.text.tint = 0x0000ff;
    }

    private draw() {
        this.gfx.clear();
        this.gfx.beginFill(0xffffff);
        this.gfx.drawCircle(0, 0, 5);
        this.gfx.endFill();
        this.gfx.tint = 0xff00ff;
        this.text.text = this.vertex.sortedIndex.toString();
        this.text.tint = 0x00ff00;
    }
}