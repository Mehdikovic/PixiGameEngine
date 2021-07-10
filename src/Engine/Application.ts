import * as PIXI from "pixi.js";
import EventEmitter from "events";
import { Time } from "./Time";
import { InputManager } from "./InputManager";
import { SceneManager } from "./SceneManager";
import * as PIXIPlugins from "./PIXIPlugins";

export class App extends EventEmitter {
    private static _instance: App;

    static getInstance() {
        return this.instance;
    }

    static get instance() {
        if (!this._instance) {
            console.error("Application must be initialized!");
            return;
        }
        return this._instance;
    }

    pixi: PIXI.Application;
    onUpdated: symbol = Symbol("onUpdated");
    onResized: symbol = Symbol("onResized");

    inputManager: InputManager;
    sceneManager: SceneManager;

    constructor(opts?: PIXI.IApplicationOptions) {
        super();
        PIXIPlugins.registerPixelatePlugin();

        this.setupPixi(opts);
    }

    private setupPixi(opts?: PIXI.IApplicationOptions) {
        this.pixi = new PIXI.Application(opts);
        document.body.appendChild(this.pixi.view);
        window.addEventListener("resize", this.onResize);
        this.onResize();
        this.pixi.ticker.add(this.onUpdate, this);
        App._instance = this;
        this.inputManager = new InputManager(this, this.pixi.renderer.plugins.interaction);
        this.sceneManager = new SceneManager();
    }

    private onResize = () => {
        this.pixi.renderer.resize(window.innerWidth - 50, window.innerHeight - 50);
        this.pixi.view.width = window.innerWidth - 50;
        this.pixi.view.height = window.innerHeight - 50;
        this.emit(this.onResized);
    }

    private onUpdate() {
        Time.deltaTime = this.pixi.ticker.deltaMS / 1000;
        Time.time += Time.deltaTime;
        this.emit(this.onUpdated);

        this.inputManager.processAfterLoop();
    }
}