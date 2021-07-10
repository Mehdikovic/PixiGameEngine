import { InteractionEvent } from "@pixi/interaction";
import { input } from "../../../../main";
import { IState, StateType } from "../UIFSM";
import { ShipUIFSM } from "./ShipUIFSM";

export class ShipIdleState implements IState {
    uiFSM: ShipUIFSM;
    stateType: StateType;

    constructor(shipUIFSM: ShipUIFSM) {
        this.stateType = StateType.Idle;
        this.uiFSM = shipUIFSM;
    }

    onEnter(): void {
    }

    OnExit(): void {
    }

    onUpdate(): StateType {
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
        return StateType.SELF;
    }
}