import { InteractionEvent } from "pixi.js";
import { input } from "../../../../main";
import { VertexHandlerUI } from "../../VertexHandlerUI";
import { ShapeUIFSM } from "./ShapeUIFSM";
import { IState, StateType } from "../UIFSM";

export class ShapeVertexHandlerState implements IState {
    uiFSM: ShapeUIFSM;
    stateType: StateType;

    constructor(shapeUIFSM: ShapeUIFSM) {
        this.stateType = StateType.VertexHandler;
        this.uiFSM = shapeUIFSM;

        this.uiFSM.shape.on(this.uiFSM.shape.onManualSort, () => {
            this.reEvalVertexDataAndShape();
        });
    }

    onEnter(): void {
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.activeHandler();
            handler.gfx
                .on('pointerdown', (event) => this.onHandlerButtonDown(event, handler), this)
                .on('pointerup', (event) => this.onHandlerButtonUp(event, handler), this)
                .on('pointerupoutside', (event) => this.onHandlerButtonUp(event, handler), this);
        });
    }

    OnExit(): void {
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.deactiveHandler();
            handler.gfx.removeAllListeners();
        });
    }

    onUpdate(): StateType {
        if (input.isMouseButtonDown(input.MOUSE.MIDDLE)) {
            let pos = this.uiFSM.getLocalCoordOfMouseToShape();
            if (!this.uiFSM.shape.addVertexToShape(pos.x, pos.y))
                return StateType.SELF;

            this.reEvalVertexDataAndShape();
        }

        this.uiFSM.vertexHandlers.forEach(handler => {
            if (handler.mustBeUpdate) handler.onUpdate();
        });

        if (input.isKeyDown(input.KEY.SPACE)) {
            return StateType.VertexManualSort;
        }

        return StateType.SELF;
    }


    onGraphicButtonDown(event: InteractionEvent): StateType {
        event.stopPropagation();
        return StateType.SELF;
    }

    onGraphicButtonUp(event: InteractionEvent): StateType {
        event.stopPropagation();
        if (event.data.button == input.MOUSE.LEFT) {
            return StateType.Idle;
        }
        return StateType.SELF;
    }

    private onHandlerButtonDown(event: InteractionEvent, handler: VertexHandlerUI) {
        event.stopPropagation();
        if (event.data.button === input.MOUSE.LEFT && handler.isInteractable) {
            handler.mustBeUpdate = true;
        }
    }

    private onHandlerButtonUp(event: InteractionEvent, handler: VertexHandlerUI) {
        event.stopPropagation();
        if (event.data.button === input.MOUSE.LEFT && handler.isInteractable) {
            handler.mustBeUpdate = false;
            handler.gfx.tint = 0xff00ff;
            this.uiFSM.shape.calculateBounds();
        }
    }

    private reEvalVertexDataAndShape() {
        this.removeVertexHandlers();
        this.uiFSM.drawShape(this.uiFSM.shape.color);
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.activeHandler();
            handler.gfx
                .on('pointerdown', (event) => this.onHandlerButtonDown(event, handler), this)
                .on('pointerup', (event) => this.onHandlerButtonUp(event, handler), this)
                .on('pointerupoutside', (event) => this.onHandlerButtonUp(event, handler), this);
        });
        this.uiFSM.shape.calculateBounds();
    }

    private removeVertexHandlers() {
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.delete();
        });
        this.uiFSM.gfx.removeChildren();
        this.uiFSM.vertexHandlers = null;
    }
}