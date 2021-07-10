import { ILodData } from "./DataTypes";

const VIEWPORT_THRESHOLD = 2 ** 16;

export class ViewportData {
    worldSize: number;
    stars: number;
    screenThreshold: number;
    chunkCountInWorld: number;
    maxWrapper: number;
    worldConfinedArea: number;
    scale: number;
    minScale: number;
    maxScale: number;

    evaluateData(currentLod: ILodData) {
        this.stars = currentLod.allStars;
        this.worldSize = currentLod.allStars * currentLod.space;
        this.screenThreshold = VIEWPORT_THRESHOLD * currentLod.space;
        //this.allStarsInWorld = BigInt(data.allStars * data.allStars);
        this.scale = currentLod.scale;
        this.minScale = currentLod.minScale;
        this.maxScale = currentLod.maxScale;

        if (this.worldSize > this.screenThreshold) { // means the world needs to be truncated because gCtx can not hanlde huge number
            this.chunkCountInWorld = VIEWPORT_THRESHOLD / currentLod.columns;
            this.maxWrapper = currentLod.allStars / VIEWPORT_THRESHOLD;
            this.worldConfinedArea = this.screenThreshold;
        } else {
            this.chunkCountInWorld = currentLod.allStars / currentLod.columns;
            this.worldConfinedArea = this.worldSize;
            this.maxWrapper = 0;
        }
    }
}