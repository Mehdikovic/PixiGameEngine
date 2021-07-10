import { InteractionEvent } from "@pixi/interaction";
import { Point } from "pixi.js";
import { input } from "../../../../main";
import { ShapeUIFSM } from "./ShapeUIFSM";
import { IState, StateType } from "../UIFSM";

export class ShapeDragState implements IState {
    uiFSM: ShapeUIFSM;
    stateType: StateType;

    private distanceFromMouseClick: Point = new Point();
    private tempPos: Point = new Point();

    constructor(shapeUIFSM: ShapeUIFSM) {
        this.stateType = StateType.Drag;
        this.uiFSM = shapeUIFSM;
    }

    onEnter(): void {
        this.uiFSM.camera.plugins.pause("wheel"); //TODO
        let temp = this.uiFSM.camera.toWorld(input.mousePosition);
        this.distanceFromMouseClick.set(
            temp.x - this.uiFSM.gfx.x,
            temp.y - this.uiFSM.gfx.y
        );
        this.uiFSM.gfx.tint = 0xffff00;
        this.uiFSM.gfx.zIndex = 100;
    }

    OnExit(): void {
        this.uiFSM.camera.plugins.resume("wheel"); //TODO
        this.uiFSM.setDefaultColor();
        this.uiFSM.gfx.zIndex = 1;
    }

    onUpdate(): StateType {
        this.snapToGrid();
        return StateType.SELF;
    }

    onGraphicButtonDown(event: InteractionEvent): StateType {
        event.stopPropagation();
        return StateType.SELF;
    }

    onGraphicButtonUp(event: InteractionEvent): StateType {
        event.stopPropagation();
        return StateType.Idle;
    }

    private snapToGrid() {
        let xChange = 0;// this.shape.localCenterX * this.gridController.cellSize; //segment size is an another option
        let yChange = 0;// this.shape.localCenterY * this.gridController.cellSize; //segment size is an another option
        this.tempPos = this.uiFSM.camera.toWorld(input.mousePosition);
        this.tempPos.x += xChange - this.distanceFromMouseClick.x;
        this.tempPos.y += yChange - this.distanceFromMouseClick.y;
        this.tempPos = this.uiFSM.gridController.snapPointToGrid(this.uiFSM, this.tempPos);
        this.uiFSM.gfx.position.set(
            this.tempPos.x - xChange,
            this.tempPos.y - yChange
        );
    }
}