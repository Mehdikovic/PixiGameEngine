import * as Utils from "../lib/Utilities";
import { ILodData } from "./DataTypes";
import { MapChunkData } from "./MapChunkData";
import { ViewportData } from "./ViewportData";

//TODO scale values must be reevaluated again
let defaultData = {
    scaleFactor: 1,
    space: 64,
    globalOffset: 0,
    totalGalaxy: 16 * 16,
    columns: 16,
    rows: 16,
    scale: 2,
    minScale: .9,
    maxScale: 6.5,
}

export class LodData {
    private _data: Map<number, ILodData>;
    private _currentLodIndex: number;
    private _lastLodIndex: number;
    mapChunkData: MapChunkData;
    viewportData: ViewportData;

    constructor() {
        this._data = new Map();
        this._data.set(0, { ...defaultData, allStars: 2 ** 32 });
        this._data.set(1, { ...defaultData, allStars: 2 ** 16 });
        this._data.set(2, { ...defaultData, allStars: 2 ** 8 });
        this._data.set(3, { ...defaultData, allStars: 2 ** 4, minScale: .4, scale: .4 });

        this._currentLodIndex = 3;
        this._lastLodIndex = this._data.size - 1;

        this.mapChunkData = new MapChunkData();
        this.viewportData = new ViewportData();

        this.mapChunkData.evaluateData(this._data.get(this._currentLodIndex));
        this.viewportData.evaluateData(this._data.get(this._currentLodIndex));
    }

    get layer() {
        return this._lastLodIndex - this._currentLodIndex + 1;
    }

    isAtDeepestLevel() {
        return this._currentLodIndex === 0;
    }

    expandWorld() {
        this.reevaluateData(-1);
    }

    shrinkWorld() {
        this.reevaluateData(+1);
    }

    canShrinkWorld() {
        return this._currentLodIndex < this._lastLodIndex;
    }

    canExpandWorld() {
        return this._currentLodIndex > 0;
    }

    private reevaluateData(newLod: number) {
        this._currentLodIndex += newLod;
        this._currentLodIndex = Utils.clamp(this._currentLodIndex, 0, this._lastLodIndex);
        this.mapChunkData.evaluateData(this._data.get(this._currentLodIndex));
        this.viewportData.evaluateData(this._data.get(this._currentLodIndex));
    }
}