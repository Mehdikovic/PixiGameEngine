import { ILodData } from "./DataTypes";

export class MapChunkData {
    scaleFactor: number;
    space: number;
    globalOffset: number;
    viewDistance: number;
    totalGalaxy: number;
    columns: number;
    rows: number;
    size: number;

    evaluateData(currentLod: ILodData) {
        this.totalGalaxy = currentLod.totalGalaxy;
        this.columns = currentLod.columns;
        this.rows = currentLod.rows;
        this.scaleFactor = currentLod.scaleFactor;
        this.space = currentLod.space * currentLod.scaleFactor;
        this.size = currentLod.space * currentLod.columns; // or this.space * this.rows
        this.globalOffset = currentLod.globalOffset;
    }
}