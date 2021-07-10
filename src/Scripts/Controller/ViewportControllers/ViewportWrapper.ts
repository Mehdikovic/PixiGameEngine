import { Point } from '@pixi/math';
import { ViewportData } from '../../Model/ViewportData';
import { ViewportController } from './ViewportController';
import { ViewportLocator } from './ViewportLocator';

const diameter = 256;

export class ViewportWrapper {
    viewport: ViewportController;
    viewData: ViewportData
    locator: ViewportLocator;
    wrappedx: number;
    wrappedy: number;

    constructor(viewport: ViewportController, locator: ViewportLocator) {
        this.viewport = viewport;
        this.viewData = viewport.viewData;
        this.locator = locator;
        this.wrappedx = 0;
        this.wrappedy = 0;

        this.locator.on(this.locator.onLocationChanged, () => {
            this.viewport.center = this.wrapViewportAtNewWorld();
        });
    }

    onUpdate(): void {
        if (!this.viewport.mustBeTruncated) return;
        this.wrapMovedViewport();
    }

    private wrapViewportAtNewWorld(): Point {
        this.wrappedx = this.wrappedy = 0;
        if (!this.viewport.mustBeTruncated) return this.viewport.center;

        this.wrappedx = Math.floor(this.viewport.center.x / this.viewData.screenThreshold);
        this.wrappedy = Math.floor(this.viewport.center.y / this.viewData.screenThreshold);

        let centerx, centery: number = 0;

        if (this.wrappedx > this.viewData.maxWrapper - 1) {
            this.wrappedx = this.viewData.maxWrapper - 1;
            centerx = this.viewData.screenThreshold;
        } else if (this.wrappedx < 0) {
            this.wrappedx = 0;
            centerx = 0;
        } else {
            centerx = this.viewport.center.x % this.viewData.screenThreshold;
        }

        if (this.wrappedy > this.viewData.maxWrapper - 1) {
            this.wrappedy = this.viewData.maxWrapper - 1;
            centery = this.viewData.screenThreshold;
        } else if (this.wrappedy < 0) {
            this.wrappedy = 0;
            centery = 0;
        } else {
            centery = this.viewport.center.y % this.viewData.screenThreshold;
        }
        return new Point(centerx, centery);
    }

    private wrapMovedViewport(): void {
        if (this.viewport.center.x >= this.viewData.screenThreshold && this.wrappedx + 1 < this.viewData.maxWrapper) {
            this.wrappedx += 1;
            this.viewport.center = new Point(diameter, this.viewport.center.y);
            this.viewport.emit("truncated");
        } else if (this.viewport.center.x <= 0 && this.wrappedx > 0) {
            this.wrappedx -= 1;
            this.viewport.center = new Point(this.viewData.screenThreshold - diameter, this.viewport.center.y);;
            this.viewport.emit("truncated");
        }

        if (this.viewport.center.y >= this.viewData.screenThreshold && this.wrappedy + 1 < this.viewData.maxWrapper) {
            this.wrappedy += 1;
            this.viewport.center = new Point(this.viewport.center.x, diameter);
            this.viewport.emit("truncated");
        } else if (this.viewport.center.y <= 0 && this.wrappedy > 0) {
            this.wrappedy -= 1;
            this.viewport.center = new Point(this.viewport.center.x, this.viewData.screenThreshold - diameter);
            this.viewport.emit("truncated");
        }
    }
}