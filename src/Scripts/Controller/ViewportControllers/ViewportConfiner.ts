import { Point } from "@pixi/math";
import { Viewport } from "pixi-viewport";

const distance: number = 200;

export class ViewportConfiner {
    viewport: Viewport;
    threshold: number;
    point: Point;

    constructor(viewport: Viewport, threshold?: number) {
        this.viewport = viewport;
        this.threshold = threshold || distance;
        this.point = new Point();
    }

    onUpdate(): void {
        if (this.viewport.center.x > this.viewport.worldWidth + this.threshold) {
            this.viewport.center = this.point.set(this.viewport.worldWidth + this.threshold, this.viewport.center.y);
        } else if (this.viewport.center.x < -this.threshold) {
            this.viewport.center = this.point.set(-this.threshold, this.viewport.center.y);
        }

        if (this.viewport.center.y > this.viewport.worldHeight + this.threshold) {
            this.viewport.center = this.point.set(this.viewport.center.x, this.viewport.worldHeight + this.threshold);
        } else if (this.viewport.center.y < -this.threshold) {
            this.viewport.center = this.point.set(this.viewport.center.x, -this.threshold);
        }
    }
}