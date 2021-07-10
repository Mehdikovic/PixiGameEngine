import * as Utils from '../../lib/Utilities';
import * as PixiWrapper from '../../lib/PixiWrapper';
import * as PIXI from 'pixi.js';
import { Point } from 'pixi.js';
import { ChunkConnector } from './ChunkConnector';
import { Star, Cluster, Spatial } from '../../View/Spatial';
import { MapChunkData } from '../../Model/MapChunkData';
import { Global } from '../../configuration/Global';
import { LodData } from '../../Model/LodManager';

export class MapChunk {
    id: string;
    lodManger: LodData;
    mapChunkData: MapChunkData;

    pos: Point;
    gpos: Point;
    wrappedPos: Point;
    screenWrappedPos: Point;

    topConnector: ChunkConnector = null;
    rightConnector: ChunkConnector = null;
    bottomConnector: ChunkConnector = null;
    leftConnector: ChunkConnector = null;

    gContext: PIXI.Graphics;
    container: PIXI.Container;
    spriteContainer: PIXI.Container;

    galaxies: Array<Spatial> = [];
    topGalaxies: Array<Spatial> = [];
    rightGalaxies: Array<Spatial> = [];
    bottomGalaxies: Array<Spatial> = [];
    leftGalaxies: Array<Spatial> = [];

    constructor(lodManger: LodData, wrappedPos: Point, pos: Point) {
        this.lodManger = lodManger;
        this.mapChunkData = lodManger.mapChunkData;

        this.wrappedPos = wrappedPos;
        this.screenWrappedPos = new Point(
            this.wrappedPos.x * this.mapChunkData.size,
            this.wrappedPos.y * this.mapChunkData.size
        );

        this.pos = pos;
        this.id = Utils.getId(this.pos);
        this.gpos = new Point(
            this.pos.x * this.mapChunkData.size,
            this.pos.y * this.mapChunkData.size
        );

        this.container = new PIXI.Container();
        this.gContext = new PIXI.Graphics();
        this.container.addChild(this.gContext);

        this.spriteContainer = new PIXI.Container();
        this.container.addChild(this.spriteContainer);

        this.generate();
    }

    private generate(): void {
        for (let i = 0; i < this.mapChunkData.totalGalaxy; ++i) {
            const spatialObject = this.createSpatialObject(i);
            this.galaxies.push(spatialObject);
            this.getFourSideGalaxies(spatialObject);
            this.spriteContainer.addChild(spatialObject.sprite);
            this.lineConnectionsWith(spatialObject);
        }
    }

    private lineConnectionsWith(spatial: Spatial): void {
        let left = this.getSpatialWithPos(new Point(spatial.pos.x - 1, spatial.pos.y));
        if (left) {
            PixiWrapper.drawLinePoint(this.gContext, spatial.screenPos, left.screenPos, Global.lineSize);
        }
        let top = this.getSpatialWithPos(new Point(spatial.pos.x, spatial.pos.y - 1))
        if (top) {
            PixiWrapper.drawLinePoint(this.gContext, spatial.screenPos, top.screenPos, Global.lineSize);
        }
    }

    private getFourSideGalaxies(spatial: Spatial): void {
        if (spatial.pos.y === 0) this.topGalaxies.push(spatial);
        if (spatial.pos.y === this.mapChunkData.rows - 1) this.bottomGalaxies.push(spatial);
        if (spatial.pos.x === 0) this.leftGalaxies.push(spatial);
        if (spatial.pos.x === this.mapChunkData.columns - 1) this.rightGalaxies.push(spatial);
    }

    private createSpatialObject(index: number): Spatial {
        return (this.lodManger.isAtDeepestLevel() || true) // TODO remove true just for debugging
            ? new Star(index, this)
            : new Cluster(index, this);
    }

    destroy(): void {
        this.galaxies.forEach(galaxy => galaxy.destroy());
        this.galaxies = null;
        this.topGalaxies = null;
        this.rightGalaxies = null;
        this.bottomGalaxies = null;
        this.leftGalaxies = null;

        PixiWrapper.destroyContainer(this.container);
        this.container = null;
        this.gContext = null;

        //destroy connectors
        if (this.topConnector != null) {
            this.topConnector.destroy();
            this.topConnector = null;
        }

        if (this.rightConnector != null) {
            this.rightConnector.destroy();
            this.rightConnector = null;
        }

        if (this.bottomConnector != null) {
            this.bottomConnector.destroy();
            this.bottomConnector = null;
        }

        if (this.leftConnector != null) {
            this.leftConnector.destroy();
            this.leftConnector = null;
        }
    }

    private getSpatialWithPos(pos: Point): Spatial {
        if (pos.x < 0 || pos.x >= this.mapChunkData.columns)
            return null;
        let index = Utils.getIndexOfPos(pos, this.mapChunkData.columns);
        if (index >= this.mapChunkData.totalGalaxy)
            return null;
        return this.galaxies[index];
    }
}