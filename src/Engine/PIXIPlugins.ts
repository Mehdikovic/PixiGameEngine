import * as PIXI from 'pixi.js';
import { assets } from '../assets/assetLoader';

export function registerPixelatePlugin() {
    const InvertPlugin = PIXI.BatchPluginFactory.create({ fragment: assets.pixelateFragment });
    PIXI.Renderer.registerPlugin('pixelate', InvertPlugin);
}
