import { Viewport } from 'pixi-viewport';
import { Point, Graphics } from 'pixi.js';
import * as PixiWrapper from '../../lib/PixiWrapper';

export class ViewportGizmos {
    viewport: Viewport;
    ctx: Graphics;

    constructor(viewport: Viewport) {
        this.viewport = viewport;
        this.ctx = new Graphics();
        this.viewport.addChild(this.ctx);
    }

    onUpdate(): void {
        this._drawGuideLines();
    }

    _drawGuideLines(): void {
        this.ctx.clear();
        let l1p1 = new Point(this.viewport.left + this.viewport.worldScreenWidth / 3, this.viewport.center.y);
        let l1p2 = new Point(this.viewport.right - this.viewport.worldScreenWidth / 3, this.viewport.center.y);

        let l2p1 = new Point(this.viewport.center.x, this.viewport.top + this.viewport.worldScreenHeight / 4.5);
        let l2p2 = new Point(this.viewport.center.x, this.viewport.bottom - this.viewport.worldScreenHeight / 4.5);

        PixiWrapper.drawLinePoint(this.ctx, l1p1, l1p2, 2 / this.viewport.scaled, 0xffff00);
        PixiWrapper.drawLinePoint(this.ctx, l2p1, l2p2, 2 / this.viewport.scaled, 0xffff00);
    }
}