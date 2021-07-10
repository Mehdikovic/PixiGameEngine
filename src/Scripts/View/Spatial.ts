import { Point, Sprite } from 'pixi.js';
import { Global } from '../configuration/Global';
import { MapChunk } from '../Controller/GalaxyControllers/MapChunk';
import { MakeSprite } from "../lib/PixiWrapper";
import * as Utils from '../lib/Utilities';

interface ISpatialOption {
    color?: number;
    rotation?: number;
}

const defaultOption: ISpatialOption = {
    color: 0xffffff,
    rotation: 0,
};

export abstract class Spatial {
    option: ISpatialOption;
    mapChunkData: MapChunk;

    protected _index: number;
    protected _pos: Point;
    protected _gpos: Point;
    protected _screenPos: Point;

    protected _sprite: Sprite;

    constructor(index: number, chunk: MapChunk, option = defaultOption) {
        this.option = option;
        this._index = index;
        this._pos = new Point(
            index % chunk.mapChunkData.columns,
            Math.floor(index / chunk.mapChunkData.columns)
        );

        let screenPos = Utils.mapPos2ScreenSimple(
            this._pos.x,
            this._pos.y,
            chunk.mapChunkData.space,
            chunk.mapChunkData.globalOffset,
        );

        this._gpos = new Point(
            chunk.pos.x * chunk.mapChunkData.columns + this._pos.x,
            chunk.pos.y * chunk.mapChunkData.columns + this._pos.y,
        );

        this._screenPos = new Point(
            chunk.screenWrappedPos.x + screenPos.x + (0 * ((chunk.mapChunkData.space) / 3)),
            chunk.screenWrappedPos.y + screenPos.y + (0 * ((chunk.mapChunkData.space) / 3)),
        )
    }

    get sprite(): Sprite {
        return this._sprite;
    }

    get pos(): Point {
        return this._pos;
    }

    get screenPos(): Point {
        return this._screenPos;
    }

    get gpos(): Point {
        return this._gpos;
    }

    update(delta: number): void { };
    destroy(): void { };
}

export class Star extends Spatial {
    constructor(index: number, chunk: MapChunk, option = defaultOption) {
        super(index, chunk, option);
        this._sprite = MakeSprite(this._screenPos, Global.spriteSize * 2, 0xff0000);

        this._sprite.pluginName = "pixelate";

        this._sprite.interactive = true;
        this._sprite.on("mousedown", () => console.log(`clicked on ${this.gpos}`))
    }

    destroy(): void {
        this._sprite.removeListener("mousedown");
        this._sprite.removeAllListeners();
    }
}

export class Cluster extends Spatial {
    constructor(index: number, chunk: MapChunk, option = defaultOption) {
        super(index, chunk, option);
        this._sprite = MakeSprite(this._screenPos, Global.spriteSize, /* this.option.color */0xffffff, this.option.rotation);
    }
}