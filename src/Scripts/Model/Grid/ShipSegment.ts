import * as Utils from '../../lib/Utilities';

export interface SegmentData {
    data: number[];
    columns: number;
    rows: number;
}

const defaultSegmentData: SegmentData = {
    data: [1],
    columns: 1,
    rows: 1,
}

export class ShipSegment {
    private _isInGrid: boolean;
    private segmentData: SegmentData;
    private localDataIndexes: number[];
    private pointsLocalToCenter: Utils.point[];
    private _x: number = -1;
    private _y: number = -1;

    pointsLocalToGrid: Utils.point[];

    constructor(data?: SegmentData) {
        if (data) {
            this.segmentData = data;
            this.normalizeData();
        }
        else {
            this.segmentData = defaultSegmentData;
            this.localDataIndexes = [0];
            this.pointsLocalToCenter = [{ x: 0, y: 0 }];
        }
    }

    get points() {
        return this.pointsLocalToCenter;
    }

    get isInGrid(): boolean {
        return this._isInGrid;
    }

    get centerx(): number {
        return this._x;
    }

    get centery(): number {
        return this._y;
    }

    get rows(): number {
        return this.segmentData.rows;
    }

    get columns(): number {
        return this.segmentData.columns;
    }

    isIdentical(anotherShipSegment: ShipSegment) {
        if (!anotherShipSegment) return false;
        return this._x === anotherShipSegment._x
            && this._y === anotherShipSegment._y
            && this.localDataIndexes.length === anotherShipSegment.localDataIndexes.length
            && this.pointsLocalToCenter.length === anotherShipSegment.pointsLocalToCenter.length
            && this.pointsLocalToGrid.length === anotherShipSegment.pointsLocalToGrid.length;
    }

    addedToGrid(x: number, y: number) {
        this.pointsLocalToGrid = [];
        this._x = x;
        this._y = y;
        this._isInGrid = true;
    }

    removedFromGrid() {
        if (!this._isInGrid) return;
        this._isInGrid = false;
        this.pointsLocalToGrid = null;
        this._x = this._y = -1;
    }

    rotateRight() {
        if (this.localDataIndexes.length <= 1) return;
        this.segmentData = rotateRightSegmentData(this.segmentData);
        this.normalizeData();
    }

    rotateLeft() {
        if (this.localDataIndexes.length <= 1) return;
        this.segmentData = rotateLeftSegmentData(this.segmentData);
        this.normalizeData();
    }

    private normalizeData() {
        let centerx = Math.ceil(this.segmentData.columns / 2) - 1;
        let centery = Math.ceil(this.segmentData.rows / 2) - 1;
        this.localDataIndexes = [];
        this.pointsLocalToCenter = [];

        this.segmentData.data.forEach((element, index) => {
            if (element) this.localDataIndexes.push(index);
        });

        this.localDataIndexes.forEach(localIndex => {
            let { x, y } = this.coord(localIndex);
            this.pointsLocalToCenter.push({ x: x - centerx, y: y - centery });
        });
    }

    private index = (x: number, y: number) => Utils.getIndex(x, y, this.segmentData.columns);
    private coord = (index: number) => Utils.getPosition(index, this.segmentData.columns);
}

//TODO: make it better, low performance becuase of two for loops
function rotateRightSegmentData(data: SegmentData): SegmentData {
    let ret = { data: null, columns: 0, rows: 0 };

    ret.data = new Array<number>(data.data.length);
    ret.rows = data.columns;
    ret.columns = data.rows;

    let limit = Math.floor(ret.columns / 2);

    for (let row: number = 0; row < data.rows; ++row) {
        for (let col: number = 0; col < data.columns; ++col) {
            ret.data[col * data.rows + row] = data.data[row * data.columns + col];
        }
    }


    for (let row: number = 0; row < ret.rows; ++row) {
        for (let col: number = 0; col < limit; ++col) {
            let temp = ret.data[row * ret.columns + col]
            ret.data[row * ret.columns + col] = ret.data[row * ret.columns + (ret.columns - col - 1)];
            ret.data[row * ret.columns + (ret.columns - col - 1)] = temp;
        }
    }

    return ret;
}

function rotateLeftSegmentData(data: SegmentData): SegmentData {
    let ret = { data: null, columns: 0, rows: 0 };

    ret.data = new Array<number>(data.data.length);
    ret.rows = data.columns;
    ret.columns = data.rows;

    let limit = Math.floor(ret.rows / 2);

    for (let row: number = 0; row < data.rows; ++row) {
        for (let col: number = 0; col < data.columns; ++col) {
            ret.data[col * data.rows + row] = data.data[row * data.columns + col];
        }
    }

    for (let row: number = 0; row < limit; ++row) {
        for (let col: number = 0; col < ret.columns; ++col) {
            let temp = ret.data[row * ret.columns + col];
            ret.data[row * ret.columns + col] = ret.data[(ret.rows - row - 1) * ret.columns + col];
            ret.data[(ret.rows - row - 1) * ret.columns + col] = temp;
        }
    }

    return ret;
}