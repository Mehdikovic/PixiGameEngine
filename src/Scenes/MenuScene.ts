import { Viewport } from "pixi-viewport";
import { Scene } from "../Engine/Scene";
import { SceneManager } from "../Engine/SceneManager";
import { app, input } from "../main";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    loaded() {
        app.pixi.renderer.backgroundColor = 0x505050;
        this.mainCamera = this.setupCamera();
    }

    onUpdate() {
        if (input.isKeyDown(input.KEY.ENTER)) {
            SceneManager.loadNextScene();
        }
    }

    protected setupCamera(): Viewport {
        return new Viewport();
    }
}