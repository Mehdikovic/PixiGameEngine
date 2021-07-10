import * as Utils from '../../lib/Utilities';
import { Point } from '@pixi/math';
import { ViewportController } from '../ViewportControllers/ViewportController';
import { ChunkConnector } from './ChunkConnector';
import { MapChunk } from './MapChunk';
import { MapChunkData } from '../../Model/MapChunkData';
import { Global } from '../../configuration/Global';

export class Galaxy {
    private _mappedChunks: Map<string, MapChunk>;
    private _outRangedChunks: Array<MapChunk>;
    viewport: ViewportController;
    mapChunkData: MapChunkData;

    constructor(viewportController: ViewportController) {
        this._mappedChunks = new Map();
        this._outRangedChunks = [];

        this.viewport = viewportController;
        this.mapChunkData = viewportController.lodManager.mapChunkData;

        this.viewport.on('scale-threshold', () => this.timeToRegenerate());
        this.viewport.on('truncated', () => this.timeToRegenerate());
    }

    onUpdate(): void {
        this.dynamicChunkGenerator(
            this.getLocalCenterOfViewport(this.viewport.center)
        );
    }

    destroy(): void {
        for (let chunk of this._mappedChunks.values()) {
            chunk.destroy();
        }
        this._mappedChunks.clear();
    }

    private timeToRegenerate(): void {
        this.destroy();
    }

    private connectToNeighbors(newChunk): void {
        let top = this.getChunkOfPos({ x: newChunk.pos.x, y: newChunk.pos.y - 1 });
        let right = this.getChunkOfPos({ x: newChunk.pos.x + 1, y: newChunk.pos.y });
        let bottom = this.getChunkOfPos({ x: newChunk.pos.x, y: newChunk.pos.y + 1 });
        let left = this.getChunkOfPos({ x: newChunk.pos.x - 1, y: newChunk.pos.y });

        if (top && !top.bottomConnector) {
            let connector = new ChunkConnector();
            connector.connectCurrentToTop(newChunk, top);
            this.viewport.addChild(connector.container);
        }

        if (right && !right.leftConnector) {
            let connector = new ChunkConnector();
            connector.connectCurrentToRight(newChunk, right);
            this.viewport.addChild(connector.container);
        }

        if (bottom && !bottom.topConnector) {
            let connector = new ChunkConnector();
            connector.connectCurrentToBottom(newChunk, bottom);
            this.viewport.addChild(connector.container);
        }

        if (left && !left.rightConnector) {
            let connector = new ChunkConnector();
            connector.connectCurrentToLeft(newChunk, left);
            this.viewport.addChild(connector.container);
        }
    }

    private getLocalCenterOfViewport(center): Point {
        return new Point(
            Math.floor(center.x / this.mapChunkData.size),
            Math.floor(center.y / this.mapChunkData.size)
        );
    }

    private getChunkOfPos(pos): MapChunk {
        return this._mappedChunks.get(Utils.getId(pos));
    }

    private dynamicChunkGenerator(viewportCenter: Point): void {
        this.clearOutRangedChunks(viewportCenter);

        for (let yoff = -Global.viewDistance; yoff <= Global.viewDistance; yoff++) {
            for (let xoff = -Global.viewDistance; xoff <= Global.viewDistance; xoff++) {
                let newWrappedPos = new Point(viewportCenter.x + xoff, viewportCenter.y + yoff);

                if (newWrappedPos.x < this.viewport.xMinChunkLength || newWrappedPos.x >= this.viewport.xMaxChunkLength ||
                    newWrappedPos.y < this.viewport.yMinChunkLength || newWrappedPos.y >= this.viewport.yMaxChunkLength)
                    continue;

                let pos_id = this.viewport.convertWrappedPositionToGlobal(newWrappedPos);
                if (this._mappedChunks.has(Utils.getId(pos_id))) continue; // SO MUCH SHITTY !IMPORTANT LINE

                const chunk = new MapChunk(this.viewport.lodManager, newWrappedPos, pos_id);
                this._mappedChunks.set(chunk.id, chunk);
                this.connectToNeighbors(chunk);
                this.viewport.addChild(chunk.container);
            }
        }
    }

    private clearOutRangedChunks(pos: Point): void {
        for (let chunk of this._mappedChunks.values()) {
            if (Utils.distanceSq(pos, chunk.wrappedPos) >= 3 * 3) {
                this._outRangedChunks.push(chunk);
            }
        }
        for (let c of this._outRangedChunks) {
            this._mappedChunks.delete(c.id);
            c.destroy();
        }
        this._outRangedChunks = [];
    }
}