import { distanceSq, IVertex } from "./Utilities";

export default class GrahamScan {
    vertices: IVertex[];

    pivot: IVertex;
    constructor() {
        this.clear();
    }

    clear() {
        this.pivot = { x: 0, y: 0 };
        this.vertices = [];
    }

    addVertices(vertices: IVertex[]) {
        vertices.forEach(vert => {
            this.vertices.push(vert);
        });
    }

    getHull(): IVertex[] {
        let hullPoints: IVertex[] = [],
            points: IVertex[],
            pointsLength: number;

        points = this.sort();
        pointsLength = points.length;

        if (pointsLength < 3) {
            points.unshift(this.pivot);
            return points;
        }

        hullPoints.push(points.shift(), points.shift());

        while (true) {
            let p0: IVertex,
                p1: IVertex,
                p2: IVertex;

            hullPoints.push(points.shift());

            p0 = hullPoints[hullPoints.length - 3];
            p1 = hullPoints[hullPoints.length - 2];
            p2 = hullPoints[hullPoints.length - 1];

            if (this.checkPoints(p0, p1, p2)) {
                hullPoints.splice(hullPoints.length - 2, 1);
            }

            if (points.length == 0) {
                if (pointsLength == hullPoints.length) {
                    let ap = this.pivot;
                    hullPoints = hullPoints.filter(p => !!p);
                    if (!hullPoints.some(p => {
                        return (p.x == ap.x && p.y == ap.y);
                    })) {
                        hullPoints.unshift(this.pivot);
                    }
                    return hullPoints;
                }
                points = hullPoints;
                pointsLength = points.length;
                hullPoints = [];
                hullPoints.push(points.shift(), points.shift());
            }
        }
    }

    sort(): IVertex[] {
        //this.pivot = this.preparePivotPoint();
        this.pivot = this.vertices.shift();
        let res = this.vertices.sort((a: IVertex, b: IVertex) => {
            let polarA = this.findPolarAngle(this.pivot, a);
            let polarB = this.findPolarAngle(this.pivot, b);
            if (polarA < polarB) return -1;
            if (polarA > polarB) return 1;
            if (polarA === polarB) {
                if (b.y === a.y && b.x === a.x) {
                    return 0;
                }
                if (b.y === a.y) {
                    return distanceSq(this.pivot, a) - distanceSq(this.pivot, b);
                } else if (b.x === a.x) {
                    return distanceSq(this.pivot, b) - distanceSq(this.pivot, a);
                }
                return distanceSq(this.pivot, a) - distanceSq(this.pivot, b);
            }
        });
        res.unshift(this.pivot);
        return res;
    }

    private findPolarAngle(right: IVertex, left: IVertex) {
        if (!right || !left) return 0;

        let ONE_RADIAN = 57.295779513082;
        let deltaX, deltaY;

        deltaX = (left.x - right.x);
        deltaY = (left.y - right.y);

        if (deltaX == 0 && deltaY == 0) return 0;
        let angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;
        return angle;
    }

    private checkPoints(p0: IVertex, p1: IVertex, p2: IVertex) {
        let difAngle;
        let cwAngle = this.findPolarAngle(p0, p1);
        let ccwAngle = this.findPolarAngle(p0, p2);
        if (cwAngle > ccwAngle) {
            difAngle = cwAngle - ccwAngle;
            return !(difAngle > 180);
        } else if (cwAngle < ccwAngle) {
            difAngle = ccwAngle - cwAngle;
            return (difAngle > 180);
        }
        return true;
    }

    private preparePivotPoint() {
        let pivot = this.vertices[0];
        for (let i = 1; i < this.vertices.length; i++) {
            const vert = this.vertices[i];
            if (vert.y < pivot.y || vert.y === pivot.y && vert.x < pivot.x) {
                pivot = vert;
            }
        }
        return pivot;
    }
}