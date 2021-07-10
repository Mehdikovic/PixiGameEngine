import { Viewport } from "pixi-viewport";
import { App } from "../Engine/Application";
import { Scene } from "../Engine/Scene";
import { ShipGridController } from "../Scripts/Controller/GridController/ShipGridController";
import { ViewportConfiner } from '../Scripts/Controller/ViewportControllers/ViewportConfiner';
import { ViewportGizmos } from "../Scripts/Controller/ViewportControllers/ViewportGizmos";

export class ShipDesignScene extends Scene {
    cameraConfiner: ViewportConfiner;
    cameraGizmos: ViewportGizmos;
    gridController: ShipGridController;

    constructor() {
        super("ShipDesignScene");
    }

    loaded() {
        this.mainCamera = this.setupCamera();
        this.mainCamera.drag({ wheel: false, factor: 0.45, mouseButtons: "left" })
            .wheel()
            .pinch()
            .decelerate({ friction: 0.95, })
            .clampZoom({ maxScale: 20., minScale: 1 });

        this.cameraConfiner = new ViewportConfiner(this.mainCamera, 10);
        this.cameraGizmos = new ViewportGizmos(this.mainCamera);

        this.gridController = new ShipGridController(15);
        this.mainCamera.addChild(this.gridController.container);
    }

    onUpdate() {
        this.gridController.onUpdate();
        this.cameraConfiner.onUpdate();
        this.cameraGizmos.onUpdate();
    }

    protected setupCamera(): Viewport {
        return new Viewport({
            screenWidth: App.instance.pixi.screen.width,
            worldWidth: App.instance.pixi.screen.width,
            screenHeight: App.instance.pixi.screen.height,
            worldHeight: App.instance.pixi.screen.height,
            interaction: App.instance.pixi.renderer.plugins.interaction,
            passiveWheel: false,
        });
    }
}