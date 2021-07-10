import { Viewport } from "pixi-viewport";
import { Graphics, InteractionEvent, Point } from "pixi.js";
import { input, sceneManager } from "../../../main";
import { Shape } from "../../Model/Shape/Shape";
import { GridController } from "../../Controller/GridController/GridController";
import { Grid } from "../../Model/Grid/Grid";

export class UIFSM {
    shape: Shape;
    gfx: Graphics;
    gridController: GridController<Grid>;
    camera: Viewport;

    protected allStates: Map<StateType, IState> = new Map();
    protected currentState: IState;
    protected stateStack: StateType[] = [];

    constructor(gridController: GridController<Grid>, shape: Shape) {
        this.shape = shape;
        this.camera = sceneManager.scene.mainCamera;
        this.gridController = gridController;
        this.gfx = new Graphics();
        this.gfx.interactive = true;
        this.gfx
            .on('pointerdown', this.onButtonDown, this)
            .on('pointerup', this.onButtonUp, this)
            .on('pointerupoutside', this.onButtonUp, this);

        this.gridController.container.addChild(this.gfx);
        this.drawShape(shape.color);
    }

    onUpdate() {
        let newState = this.currentState.onUpdate();
        this.changeState(newState);
    }

    onButtonDown(event) {
        let newState = this.currentState.onGraphicButtonDown(event as InteractionEvent);
        this.changeState(newState);
    }

    onButtonUp(event) {
        let newState = this.currentState.onGraphicButtonUp(event as InteractionEvent);
        this.changeState(newState);
    }

    getLocalCoordOfMouseToShape(): Point {
        let currentPos: Point = this.camera.toWorld(input.mousePosition);
        currentPos.x = Math.round((currentPos.x - this.gfx.x) / this.gridController.cellSize);
        currentPos.y = Math.round((currentPos.y - this.gfx.y) / this.gridController.cellSize);
        return currentPos;
    }

    setColor(color: number) { this.gfx.tint = color }
    setDefaultColor() { this.gfx.tint = this.shape.color }

    protected changeState(newState: StateType) {
        if (this.currentState.stateType === newState || newState === StateType.SELF) return;

        if (newState === StateType.PREVIOUS && this.stateStack.length > 0) {
            this.currentState.OnExit();
            this.currentState = this.allStates.get(this.stateStack.pop());
            this.currentState.onEnter();
            return;
        }

        if (this.stateStack.length > 10)
            this.stateStack.shift();

        this.stateStack.push(this.currentState.stateType);

        this.currentState.OnExit();
        this.currentState = this.allStates.get(newState);
        this.currentState.onEnter();
    }

    drawShape(color: number) {
        let verts = this.shape.getVertices();
        let size = this.gridController.cellSize;
        this.gfx.clear();
        this.gfx.beginFill(0xFFFFFF, 1);
        this.gfx.drawPolygon(...verts.map(ver => new Point(ver.x * size, ver.y * size)));
        this.gfx.endFill();
        this.gfx.tint = color;
    }
}

export enum StateType {
    Idle,
    Drag,
    VertexManualSort,
    VertexHandler,
    PREVIOUS,
    SELF,
}

export interface IState {
    uiFSM: UIFSM;
    stateType: StateType;
    onEnter(): void;
    OnExit(): void;
    onUpdate(): StateType;
    onGraphicButtonDown(event: InteractionEvent): StateType;
    onGraphicButtonUp(event: InteractionEvent): StateType;
}

export const COLOR_RED = 0xff0000;
export const COLOR_GREEN = 0x00ff00;
export const COLOR_BLUE = 0x0000ff;
export const COLOR_YELLOW = 0xffff00;