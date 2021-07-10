import { App } from './Application';
import EventEmitter from 'events';
import { Viewport } from 'pixi-viewport';

type AssetType = Map<string, string>;

export abstract class Scene extends EventEmitter {
    mainCamera: Viewport;
    name: string;
    id: number;

    private assets: AssetType;

    constructor(name: string, assetsToLoad?: AssetType) {
        super();
        this.name = name;
        this.assets = assetsToLoad;
    }

    buildSceneAsync(): Promise<any> {
        let loader = App.getInstance().pixi.loader;
        if (this.assets) {
            for (let key in this.assets.keys) {
                loader.add(key, this.assets.get(key));
            }
        }
        return new Promise((resolve, reject) => {
            loader.onError = (err) => {
                reject(err);
            }
            loader.load((_loader, resource) => {
                resolve(resource);
            });
        })
    }

    loaded(resources) { }
    unloaded() { }
    onUpdate() { }

    protected abstract setupCamera(): Viewport;
}