import * as Utils from "../../lib/Utilities";
import { Point } from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import { ViewportGizmos } from './ViewportGizmos';
import { ViewportConfiner } from './ViewportConfiner';
import { ViewportWrapper } from './ViewportWrapper';
import { ViewportLocator } from './ViewportLocator';
import { LodData } from '../../Model/LodManager';
import { ViewportData } from '../../Model/ViewportData';
import { Background } from "./Background";
import { input, app } from "../../../main";

export class ViewportController extends Viewport {
    mustBeTruncated: boolean = false;
    background: Background;
    gizmos: ViewportGizmos = null;
    confiner: ViewportConfiner = null;
    wrapper: ViewportWrapper = null;
    lodManager: LodData;
    viewData: ViewportData;
    locator: ViewportLocator;

    constructor(lodManager: LodData) {
        super({
            screenWidth: app.pixi.screen.width,
            worldWidth: app.pixi.screen.width,
            screenHeight: app.pixi.screen.height,
            worldHeight: app.pixi.screen.height,
            interaction: app.pixi.renderer.plugins.interaction,
            passiveWheel: false,
        });

        this.lodManager = lodManager;
        this.viewData = lodManager.viewportData;

        this.mustBeTruncated = false;

        this.drag({ wheel: false, factor: 0.45, mouseButtons: "all" })
            .pinch()
            .wheel({ percent: 0.1, smooth: 10, })
            .decelerate({ friction: 0.95, });

        this.on("zoomed-end", this.onZoomEnd, this);

        this.background = new Background(this);
        this.gizmos = new ViewportGizmos(this);
        this.confiner = new ViewportConfiner(this);
        this.locator = new ViewportLocator(this);
        this.wrapper = new ViewportWrapper(this, this.locator);

        this.setupViewportState();
        this.locator.putViewportAtCenter();
    }

    onUpdate(): void {
        if (input.isKeyDown(input.KEY.SPACE)) {
            let point = new Point(Utils.getRandomIntExclusive(0, 2 ** 32), Utils.getRandomIntExclusive(0, 2 ** 32));
            this.locator.locateViewportBasedOnStarPosition(point);
        }

        this.background.onUpdate();
        this.wrapper.onUpdate();
        this.confiner.onUpdate();
        this.gizmos.onUpdate();
    }

    private onZoomEnd(): void {
        if (this.lodManager.canShrinkWorld() && this.scaled <= this.viewData.minScale) {
            let prevWorldStars = this.viewData.stars;
            this.lodManager.shrinkWorld();
            this.setupViewportState();
            this.locator.locateViewportRelativeToPrevWorld(prevWorldStars, this.wrapper.wrappedx, this.wrapper.wrappedy);
            this.emit("scale-threshold", 1);
        } else if (this.lodManager.canExpandWorld() && this.scaled >= this.viewData.maxScale) {
            let prevWorldStars = this.viewData.stars;
            this.lodManager.expandWorld();
            this.setupViewportState();
            this.locator.locateViewportRelativeToPrevWorld(prevWorldStars, this.wrapper.wrappedx, this.wrapper.wrappedy);
            this.emit("scale-threshold", -1);
        }
        this.plugins.pause("wheel");
        setTimeout(() => this.plugins.resume("wheel"), 100);
    }

    private setupViewportState(): void {
        this.scaled = this.viewData.scale;
        this.mustBeTruncated = this.viewData.maxWrapper > 1;
        this.worldWidth = this.worldHeight = this.viewData.worldConfinedArea;
        this.clampZoom({ minScale: this.viewData.minScale, maxScale: this.viewData.maxScale });
    }

    get xMinChunkLength(): number {
        if (!this.mustBeTruncated) return 0;
        return this.wrapper.wrappedx > 0 ? -2 : 0;
    }

    get xMaxChunkLength(): number {
        if (!this.mustBeTruncated) return this.viewData.chunkCountInWorld;
        return this.wrapper.wrappedx + 1 < this.viewData.maxWrapper ? this.viewData.chunkCountInWorld + 2 : this.viewData.chunkCountInWorld;
    }

    get yMinChunkLength(): number {
        if (!this.mustBeTruncated) return 0;
        return this.wrapper.wrappedy > 0 ? -2 : 0;
    }

    get yMaxChunkLength(): number {
        if (!this.mustBeTruncated) return this.viewData.chunkCountInWorld;
        return this.wrapper.wrappedy + 1 < this.viewData.maxWrapper ? this.viewData.chunkCountInWorld + 2 : this.viewData.chunkCountInWorld;
    }

    convertWrappedPositionToGlobal(wrappedPos: Point): Point {
        return new Point(
            wrappedPos.x + (this.wrapper.wrappedx * this.viewData.chunkCountInWorld),
            wrappedPos.y + (this.wrapper.wrappedy * this.viewData.chunkCountInWorld)
        );
    }
}