import EventEmitter from 'events';
import { App } from './Application';
import { Scene } from "./Scene";

export class SceneManager extends EventEmitter {
    static instance: SceneManager;
    static getInstance() {
        if (!this.instance) {
            console.error("SceneManager must be initialized!");
        }
        return this.instance;
    }

    private currentScene: Scene;
    private currentSceneIndex: number = -1;
    private lastSceneIndex: number = -1;

    private app: App;
    private scenesArr: Scene[];
    private scenesMap: Map<string, Scene> = new Map<string, Scene>();

    //EVENTS
    onSceneLoaded: symbol = Symbol("onSceneLoaded");
    onSceneUnloaded: symbol = Symbol("onSceneUnloaded");
    onSceneChanged: symbol = Symbol("onSceneChanged");

    constructor() {
        super();
        SceneManager.instance = this;
        this.app = App.instance;
    }

    get scene() {
        return this.currentScene;
    }

    static async goToSceneAsync(scene: Scene) {
        await this.instance.goToSceneAsync(scene);
    }

    static async loadSceneAsync(id: number | string) {
        await this.instance.loadSceneAsync(id);
    }

    static async loadNextScene() {
        await this.instance.loadNextScene();
    }


    async BeginAsync(scenes: Scene[]) {
        if (scenes.length <= 0) return;
        this.scenesArr = scenes;
        scenes.forEach((scene, i) => {
            scene.id = i;
            this.scenesMap.set(scene.name, scene);
        });

        this.currentSceneIndex = 0;
        this.lastSceneIndex = this.scenesArr.length - 1;
        this.currentScene = this.scenesArr[this.currentSceneIndex];

        this.currentScene.loaded(await this.currentScene.buildSceneAsync());
        this.emit(this.onSceneLoaded, this.currentScene);
        this.app.pixi.stage.addChild(this.currentScene.mainCamera);

        this.app.on(this.app.onUpdated, () => { if (this.currentScene) this.currentScene.onUpdate(); });
    }

    async loadSceneAsync(id: number | string) {
        if (typeof id === "number") {
            if (id < 0 || id > this.lastSceneIndex || id === this.currentSceneIndex) return;
            await this.goToSceneAsync(this.scenesArr[id]);
        } else if (typeof id === "string") {
            if (!this.scenesMap.has(id)) {
                console.error(`there is no scene with the name: ${id}`)
                return;
            }
            await this.goToSceneAsync(this.scenesMap.get(id));
        }
    }

    async loadNextScene() {
        if (this.scenesArr.length <= 1) return;
        if (this.currentSceneIndex === this.lastSceneIndex) return;
        this.currentSceneIndex += 1;
        await this.goToSceneAsync(this.scenesArr[this.currentSceneIndex]);
    }

    private async goToSceneAsync(scene: Scene) {
        let prevScene: Scene = null;

        if (this.currentScene) {
            prevScene = this.currentScene;
            prevScene.unloaded();
            this.emit(this.onSceneUnloaded, prevScene);
            this.app.pixi.stage.removeChild(prevScene.mainCamera);
        }

        this.currentSceneIndex = scene.id;
        this.currentScene = scene;

        this.app.pixi.renderer.backgroundColor = 0x000000;
        this.currentScene.loaded(await this.currentScene.buildSceneAsync());
        this.emit(this.onSceneLoaded, this.currentScene);
        this.app.pixi.stage.addChild(this.currentScene.mainCamera);

        if (prevScene)
            this.emit(this.onSceneChanged, prevScene, scene);
    }

}