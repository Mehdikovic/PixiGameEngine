import * as PIXI from 'pixi.js';

export function MakeSprite(pos: PIXI.Point, size: number = 5, color: number = 0xffffff, rotation: number = 0): PIXI.Sprite {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.anchor.set(0.5, 0.5);
    sprite.rotation = rotation;
    sprite.tint = color;
    sprite.width = sprite.height = size;
    sprite.position.set(pos.x, pos.y);
    return sprite;
}

export function drawLinePoint(gContext: PIXI.Graphics, from: PIXI.Point, to: PIXI.Point, size: number = 1, color: number = 0xffffff): void {
    drawLine(gContext, from.x, from.y, to.x, to.y, size, color);
}

export function drawLine(gContext: PIXI.Graphics, fromx: number, fromy: number, tox: number, toy: number, size: number = 1, color: number = 0xffffff): void {
    gContext.lineStyle(size, color);
    gContext.moveTo(fromx, fromy);
    gContext.lineTo(tox, toy);
    gContext.lineStyle();
}

export function destroyContainer(container: PIXI.Container, children: boolean = true, texture: boolean = true, baseTexture: boolean = true): void {
    if (container.parent)
        container.parent.removeChild(container);
    container.destroy({ children: children, texture: texture, baseTexture: baseTexture });
}

export function generatePixiSprite(width: number, height: number, density: number, brightness: number): PIXI.Sprite {
    let data = generateTexture(width, height, density, brightness);
    let texture = new PIXI.Texture(PIXI.BaseTexture.fromBuffer(data, width, height));
    let sprite = new PIXI.Sprite(texture);
    sprite.anchor.set(.5);
    return sprite;
}

export function generateNoiseTexture(size: number): PIXI.Texture {
    let data = new Uint8Array(size * size * 4);
    for (let i = 0; i < data.length; i++) {
        let r = [(Math.random() - .5) * 2, (Math.random() - .5) * 2];
        data[i * 4 + 2] = Math.round(0.5 * (1.0 + r[0]) * 255);
        data[i * 4 + 3] = Math.round(0.5 * (1.0 + r[1]) * 255);
    }
    return new PIXI.Texture(
        PIXI.BaseTexture.fromBuffer(data, size, size, {
            alphaMode: PIXI.ALPHA_MODES.PREMULTIPLY_ALPHA,
            wrapMode: PIXI.WRAP_MODES.REPEAT
        })
    );
}

export function generateTexture(width: number, height: number, density: number, brightness: number): Float32Array {
    let count = Math.round(width * height * density);
    let data = new Float32Array(width * height * 4);
    for (let i = 0; i < count; i++) {
        let r = Math.floor(Math.random() * width * height);
        let color = Math.round(255 * Math.log(1. - Math.random()) * -brightness);
        data[r * 4 + 0] = color;
        data[r * 4 + 1] = color;
        data[r * 4 + 2] = color;
        data[r * 4 + 3] = color;
    }
    return data;
}