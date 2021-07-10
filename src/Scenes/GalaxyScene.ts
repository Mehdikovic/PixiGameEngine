import { Scene } from "../Engine/Scene";
import { LodData } from "../Scripts/Model/LodManager";
import { ViewportController } from "../Scripts/Controller/ViewportControllers/ViewportController";
import { Galaxy } from '../Scripts/Controller/GalaxyControllers/Galaxy';
import { Viewport } from "pixi-viewport";

export class GalaxyScene extends Scene {
    viewport: ViewportController;
    galaxy: Galaxy;

    constructor() {
        super("GalaxyScene");
    }

    loaded() {
        this.mainCamera = this.setupCamera();
        this.galaxy = new Galaxy(this.viewport);
    }

    onUpdate() {
        this.viewport.onUpdate();
        this.galaxy.onUpdate();
    }

    protected setupCamera(): Viewport {
        let lodData = new LodData();
        this.viewport = new ViewportController(lodData);
        return this.viewport;
    }
}