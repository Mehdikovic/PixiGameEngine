import * as Utils from "../../lib/Utilities";
import { Point } from "pixi.js";
import { MapChunkData } from "../../Model/MapChunkData";
import { ViewportData } from "../../Model/ViewportData";
import { EventEmitter } from "events"
import { ViewportController } from "./ViewportController";

export class ViewportLocator extends EventEmitter {
    viewport: ViewportController;
    viewData: ViewportData;
    chunkData: MapChunkData;
    onLocationChanged: symbol;

    constructor(viewport: ViewportController) {
        super();
        this.viewport = viewport;
        this.viewData = viewport.viewData;
        this.chunkData = viewport.lodManager.mapChunkData;
        this.onLocationChanged = Symbol("onLocationChanged");
    }

    putViewportAtCenter() {
        this.viewport.center = new Point(
            this.viewData.worldSize / 2 - this.chunkData.space / 2,
            this.viewData.worldSize / 2 - this.chunkData.space / 2
        );
        this.emit(this.onLocationChanged);
    }

    locateViewportRelativeToPrevWorld(prevWorldStars: number, wrapperx: number, wrappery: number) {
        let x = (this.viewport.center.x + wrapperx * this.viewData.screenThreshold) / this.chunkData.space;
        let y = (this.viewport.center.y + wrappery * this.viewData.screenThreshold) / this.chunkData.space;
        let xRounded = Math.round(x);
        let yRounded = Math.round(y);
        let finalCenter = this.getLocationWithStar(new Point(xRounded, yRounded), prevWorldStars - 1, this.viewData.stars - 1);
        this.viewport.center = new Point(
            finalCenter.x - (xRounded - x) * this.chunkData.space,
            finalCenter.y - (yRounded - y) * this.chunkData.space,
        );
        this.emit(this.onLocationChanged);
    }

    locateViewportBasedOnStarPosition(position: Point) {
        this.viewport.center = this.getLocationWithStar(position, 2 ** 32 - 1, this.viewData.stars - 1);
        this.emit(this.onLocationChanged);
    }

    private getLocationWithStar(position: Point, fromMax: number, toMax: number): Point {
        return new Point(
            Math.round(Utils.mapToRange(position.x, 0, fromMax, 0, toMax)) * this.chunkData.space,
            Math.round(Utils.mapToRange(position.y, 0, fromMax, 0, toMax)) * this.chunkData.space
        );
    }
}