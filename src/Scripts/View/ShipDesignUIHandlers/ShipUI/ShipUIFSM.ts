import { sceneManager } from "../../../../main";
import { ShipGridController } from "../../../Controller/GridController/ShipGridController";
import { Shape } from "../../../Model/Shape/Shape";
import { StateType, UIFSM } from "../UIFSM";
import { ShipDragState } from "./ShipDragState";
import { ShipIdleState } from "./ShipIdleState";

export class ShipUIFSM extends UIFSM {

    gridController: ShipGridController;

    constructor(shipGridController: ShipGridController, shape: Shape, x: number, y: number) {
        super(shipGridController, shape);
        this.camera = sceneManager.scene.mainCamera;
        this.gridController = shipGridController;
        this.shape = shape;
        this.gfx.position.set(x, y);

        this.allStates
            .set(StateType.Idle, new ShipIdleState(this))
            .set(StateType.Drag, new ShipDragState(this))

        this.currentState = this.allStates.get(StateType.Idle);
        this.currentState.onEnter();
    }
}