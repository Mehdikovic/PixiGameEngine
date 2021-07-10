import { CompositionGrid } from "./Grid";
import { ShipSegment } from "./ShipSegment";
import * as Utils from '../../lib/Utilities';

export class ShipSegmentGrid extends CompositionGrid<ShipSegment> {
    constructor(size) {
        super(size);
        globalThis.ship = this;
    }

    addElement(newx: number, newy: number, shipSegment: ShipSegment): boolean {
        let pointsToAdd: Utils.point[] = [];
        for (let point of shipSegment.points) {
            let x = point.x + newx;
            let y = point.y + newy;
            if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
                return false;
            } else if (this.getCell(x, y)) {
                if (shipSegment.isIdentical(this.getElement(x, y))) {
                    pointsToAdd.push({ x, y });
                    continue;
                }
                console.log(newx, newy, " are occupied");
                return false;
            }
            pointsToAdd.push({ x, y });
        }

        this.removeElement(shipSegment);

        console.log(`added to grid at ${newx}, ${newy}`)
        shipSegment.addedToGrid(newx, newy);
        shipSegment.pointsLocalToGrid.push(...pointsToAdd);

        pointsToAdd.forEach(point => {
            this.setCell(point.x, point.y, true);
            this._elements[this.getIndex(point.x, point.y)] = shipSegment;
        });

        this.emit(this.onElementAdded, shipSegment);

        return true;
    }

    removeElement(shipSegment: ShipSegment) {
        if (shipSegment.isInGrid) {
            shipSegment.pointsLocalToGrid.forEach(point => {
                this._elements[this.getIndex(point.x, point.y)] = null;
                this.setCell(point.x, point.y, false);
            })
            console.log(`deleted at ${shipSegment.centerx}, ${shipSegment.centery}`)
            this.emit(this.onElementRemoved, shipSegment);
            shipSegment.removedFromGrid();
        }
    }
}