import { Shape } from "../../../Model/Shape/Shape";
import { Vertex } from "../../../Model/Shape/Vertex";
import { VertexHandlerUI } from "../../VertexHandlerUI";
import { ShapeDragState } from "./ShapeDragState";
import { ShapeIdleState } from "./ShapeIdleState";
import { ShapeVertexManualSortState } from "./ShapeVertexManualSortState";
import { ShapeVertexHandlerState } from "./ShapeVertexHandlerState";
import { ShapeGridController } from "../../../Controller/GridController/ShapeGridController";
import { StateType, UIFSM } from "../UIFSM";

export class ShapeUIFSM extends UIFSM {
    vertexHandlers: VertexHandlerUI[];

    constructor(shapeGridController: ShapeGridController, color) {
        let shape = new Shape(1, 1, color);
        super(shapeGridController, shape);
        this.shape = shape;
        this.shape.setGridPosition(shapeGridController.grid, 0, 0);

        this.allStates
            .set(StateType.Idle, new ShapeIdleState(this))
            .set(StateType.Drag, new ShapeDragState(this))
            .set(StateType.VertexHandler, new ShapeVertexHandlerState(this))
            .set(StateType.VertexManualSort, new ShapeVertexManualSortState(this));

        this.currentState = this.allStates.get(StateType.Idle);
        this.currentState.onEnter();
    }

    drawShape(color: number) {
        super.drawShape(color);
        this.initialVertexHandlers(this.shape.getVertices());
    }

    private initialVertexHandlers(verts: Vertex[]) {
        if (this.vertexHandlers) {
            verts.forEach((vertex, index) => {
                this.vertexHandlers[index].reEvaluateVertex(vertex);
            });
        } else {
            this.vertexHandlers = [];
            verts.forEach(vertex => {
                this.vertexHandlers.push(
                    new VertexHandlerUI(this, vertex)
                );
            });
        }
    }
}