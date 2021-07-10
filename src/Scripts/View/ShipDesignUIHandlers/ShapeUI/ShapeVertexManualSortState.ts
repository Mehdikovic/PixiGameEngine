import { InteractionEvent } from "@pixi/interaction";
import { input } from "../../../../main";
import { VertexHandlerUI } from "../../VertexHandlerUI";
import { ShapeUIFSM } from "./ShapeUIFSM";
import { IState, StateType } from "../UIFSM";

export class ShapeVertexManualSortState implements IState {
    uiFSM: ShapeUIFSM;
    stateType: StateType;
    nextIndex: number = -1;

    constructor(shapeUIFSM: ShapeUIFSM) {
        this.stateType = StateType.VertexManualSort;
        this.uiFSM = shapeUIFSM;
    }

    onEnter(): void {
        this.nextIndex = -1;
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.activeHandler();
            handler.activeText();
            handler.gfx
                .on('pointerdown', (event) => this.onHandlerButtonDown(event, handler), this)
                .on('pointerup', (event) => this.onHandlerButtonUp(event, handler), this)
                .on('pointerupoutside', (event) => this.onHandlerButtonUp(event, handler), this);
        });
    }

    OnExit(): void {
        this.nextIndex = -1;
        this.uiFSM.vertexHandlers.forEach(handler => {
            handler.deactiveHandler();
            handler.deactiveText();
            handler.gfx.removeAllListeners();
        });
    }

    onUpdate(): StateType {
        if (input.isKeyDown(input.KEY.SPACE)) {
            if (this.nextIndex !== -1) {
                this.uiFSM.shape.manualSort();
            }
            return StateType.PREVIOUS;
        }

        return StateType.SELF;
    }

    onGraphicButtonDown(event: InteractionEvent): StateType {
        event.stopPropagation();
        return StateType.SELF;
    }

    onGraphicButtonUp(event: InteractionEvent): StateType {
        event.stopPropagation();
        return StateType.SELF;
    }

    private onHandlerButtonDown(event: InteractionEvent, handler: VertexHandlerUI) {
        event.stopPropagation();
        if (event.data.button === input.MOUSE.MIDDLE)
            handler.setNewIndex(this.getNextIndex());
    }

    private onHandlerButtonUp(event: InteractionEvent, handler: VertexHandlerUI) {
        event.stopPropagation();
    }

    private getNextIndex(): number {
        ++this.nextIndex;
        if (this.nextIndex >= this.uiFSM.vertexHandlers.length) {
            this.nextIndex = 0;
        }
        return this.nextIndex;
    }
}