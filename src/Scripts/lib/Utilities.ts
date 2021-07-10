export type point = { x: number, y: number }
export interface IVertex {
    x: number;
    y: number;
}


export function isInsideCircle(rx: number, ry: number, r: number, x: number, y: number): boolean {
    let xdiff = Math.abs(x - rx);
    xdiff *= xdiff;
    let ydiff = Math.abs(y - ry);
    ydiff *= ydiff;
    return xdiff + ydiff < (r * r);
}

export function getPosition(index: number, width: number): point {
    return {
        x: index % width,
        y: Math.floor(index / width)
    }
}

export function getAngle(a: point, b: point): number {
    return Math.atan2(b.y - a.y, b.x - a.x);
}

export function getIndexOfPos(pos: point, width: number): number {
    return getIndex(pos.x, pos.y, width);
}

export function getIndex(x: number, y: number, width: number): number {
    return y * width + x;
}

export function getId(pos: point): string {
    return `${pos.x},${pos.y}`;
}

export function mapPos2ScreenSimple(x: number, y: number, space: number = 10, offset: number = 0): point {
    return mapPos2Screen(x, y, space, space, offset, offset);
}

export function mapPos2Screen(x: number, y: number, xSpace: number = 10, ySpace: number = 10, xoffset: number = 0, yoffset: number = 0): point {
    return {
        x: x * xSpace + xoffset,
        y: y * ySpace + yoffset,
    };
}

export function getRandomIntExclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

export function clamp01(value: number): number {
    return clamp(value, 0, 1);
}

export function distanceSq(from: point, to: point): number {
    let x = (from.x - to.x);
    x *= x;
    let y = (from.y - to.y);
    y *= y;
    return x + y;
}

export function distance(from: point, to: point): number {
    return Math.sqrt(distanceSq(from, to));
}

export function mapToRange(value: number, from1: number, to1: number, from2: number, to2: number): number {
    value = clamp(value, from1, to1);
    return (value - from1) / (to1 - from1) * (to2 - from2) + from2;
}

export function lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end
}