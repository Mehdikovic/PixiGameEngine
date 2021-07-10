import { InteractionEvent } from "@pixi/interaction";
import { Point } from "pixi.js";
import { input } from "../../../../main";
import { ShapeUIFSM } from "./ShapeUIFSM";
import { IState, StateType } from "../UIFSM";

export class ShapeIdleState implements IState {
    uiFSM: ShapeUIFSM;
    stateType: StateType;

    private tempPos: Point = new Point();

    constructor(shapeUIFSM: ShapeUIFSM) {
        this.stateType = StateType.Idle;
        this.uiFSM = shapeUIFSM;

        this.tempPos = this.uiFSM.gridController.snapCoordToGrid(new Point(1, 1));
        this.uiFSM.gfx.position.set(
            this.tempPos.x,
            this.tempPos.y
        );
    }

    onEnter(): void {
    }

    OnExit(): void {
    }

    onUpdate(): StateType {
        if (input.isKeyDown(input.KEY.SPACE) && this.uiFSM.vertexHandlers) {
            return StateType.VertexManualSort;
        }
        return StateType.SELF;
    }

    onGraphicButtonDown(event: InteractionEvent): StateType {
        event.stopPropagation();
        if (event.data.button === input.MOUSE.RIGHT) {
            return StateType.Drag;
        }
        return StateType.SELF;
    }

    onGraphicButtonUp(event: InteractionEvent): StateType {
        event.stopPropagation();
        if (event.data.button === input.MOUSE.LEFT && this.uiFSM.vertexHandlers) {
            return StateType.VertexHandler;
        }
        return StateType.SELF;
    }
}