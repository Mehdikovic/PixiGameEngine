import * as PIXI from 'pixi.js';
import * as PixiWrapper from "../../lib/PixiWrapper";
import { PixelateFilter } from '@pixi/filter-pixelate';
import { assets } from "../../../assets/assetLoader";
import { ViewportController } from "./ViewportController";
import { App } from '../../../Engine/Application';
import { Time } from '../../../Engine/Time';

export class Background {
    viewport: ViewportController;
    starsFilter: PIXI.Filter;
    nebulaFilter: PIXI.Filter;
    normalizedCameraPosition: PIXI.Point;

    constructor(viewport: ViewportController) {
        this.viewport = viewport;
        this.normalizedCameraPosition = new PIXI.Point();

        this.renderNebula();
        this.renderStars();
    }

    private renderNebula() {
        this.nebulaFilter = new PIXI.Filter(
            null,
            assets.nebulaFragment,
            {
                uTime: Time.time,
                offset: [Math.random() * 100, Math.random() * 100],
                scale: (Math.random() * 10 + 1) / 2000.,
                falloff: Math.random() * .2 + 3.0,
                color: [Math.random(), Math.random(), Math.random()],
                density: Math.random() * 0.3,
                tNoise: PixiWrapper.generateNoiseTexture(64),
                tNoiseSize: 64
            }
        );
        let bgNebula = new PIXI.Container();
        bgNebula.filterArea = App.instance.pixi.screen;
        //bgNebula.filters = [this.nebulaFilter, new PixelateFilter(15)];
        this.viewport.addChild(bgNebula);
    }

    private renderStars() {
        this.starsFilter = new PIXI.Filter(
            assets.starVertex,
            assets.starsFragment,
            { uCamera: this.viewport.center, uScale: this.viewport.scaled, uTime: Time.time }
        );
        let bgStar = new PIXI.Container();
        bgStar.filterArea = App.instance.pixi.screen;
        bgStar.filters = [this.starsFilter/*, new PixelateFilter(5)*/];
        this.viewport.addChild(bgStar);
    }

    onUpdate() {
        this.normalizedCameraPosition.set(
            this.viewport.center.x / this.viewport.viewData.worldConfinedArea,
            this.viewport.center.y / this.viewport.viewData.worldConfinedArea
        )
        this.starsFilter.uniforms.uCamera = this.normalizedCameraPosition;
        this.starsFilter.uniforms.uTime = Time.time;
        this.starsFilter.uniforms.uScale = this.viewport.scaled + this.viewport.lodManager.layer;

        this.nebulaFilter.uniforms.uTime = Time.time;
    }
}