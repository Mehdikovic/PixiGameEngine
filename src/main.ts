window.addEventListener("contextmenu", e => e.preventDefault());

import { App } from './Engine/Application'
import { InputManager } from './Engine/InputManager';
import { SceneManager } from './Engine/SceneManager'
import { GalaxyScene } from "./Scenes/GalaxyScene";
import { MenuScene } from "./Scenes/MenuScene";
import { ShapeDesignScene } from './Scenes/ShapeDesignScene';
import { ShipDesignScene } from './Scenes/ShipDesignScene';

export const app: App = new App();
export const input: InputManager = app.inputManager;
export const sceneManager: SceneManager = app.sceneManager;

sceneManager.BeginAsync(
    [
        new GalaxyScene(),
        new ShapeDesignScene(),
        new ShipDesignScene(),
        new MenuScene(),
    ]
);