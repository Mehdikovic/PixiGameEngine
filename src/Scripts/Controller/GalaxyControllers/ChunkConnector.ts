import * as PixiWrapper from '../../lib/PixiWrapper';
import * as PIXI from 'pixi.js';
import { MapChunk } from './MapChunk';
import { Spatial } from '../../View/Spatial';
import { Global } from "../../configuration/Global";

export class ChunkConnector {
    container: PIXI.Container;
    ctx: PIXI.Graphics;
    topChunk: MapChunk = null;
    rightChunk: MapChunk = null;
    bottomChunk: MapChunk = null;
    leftChunk: MapChunk = null;

    constructor() {
        this.container = new PIXI.Container();
        this.ctx = new PIXI.Graphics();
        this.container.addChild(this.ctx);
    }

    connectCurrentToTop(bottom: MapChunk, top: MapChunk): void {
        this.bottomChunk = bottom;
        this.topChunk = top;

        bottom.topConnector = this;
        top.bottomConnector = this;

        this.connectLines(bottom.topGalaxies, top.bottomGalaxies);
    }

    connectCurrentToRight(left: MapChunk, right: MapChunk) {
        this.leftChunk = left;
        this.rightChunk = right;

        left.rightConnector = this;
        right.leftConnector = this;

        this.connectLines(left.rightGalaxies, right.leftGalaxies);
    }

    connectCurrentToBottom(top: MapChunk, bottom: MapChunk) {
        this.topChunk = top;
        this.bottomChunk = bottom;

        top.bottomConnector = this;
        bottom.topConnector = this;

        this.connectLines(top.bottomGalaxies, bottom.topGalaxies);
    }

    connectCurrentToLeft(right: MapChunk, left: MapChunk) {
        this.rightChunk = right;
        this.leftChunk = left;

        right.leftConnector = this;
        left.rightConnector = this;

        this.connectLines(right.leftGalaxies, left.rightGalaxies);
    }

    destroy() {
        if (this.leftChunk && this.rightChunk) {
            this.leftChunk.rightConnector = this.rightChunk.leftConnector = null;
            this.leftChunk = this.rightChunk = null;
        } else if (this.topChunk && this.bottomChunk) {
            this.topChunk.bottomConnector = this.bottomChunk.topConnector = null;
            this.topChunk = this.bottomChunk = null;
        }
        PixiWrapper.destroyContainer(this.container);
        this.container = null;
        this.ctx = null;
    }

    private connectLines(ra: Array<Spatial>, la: Array<Spatial>) {
        for (let i = 0; i < ra.length; ++i) {
            PixiWrapper.drawLinePoint(this.ctx, ra[i].screenPos, la[i].screenPos, Global.lineSize);
        }
    }
}