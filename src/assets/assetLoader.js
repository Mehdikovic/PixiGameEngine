import nebulaFrag from './shader/bgNebula/nebula.frag';
import starsFrag from './shader/bgStar/bgStars.frag';
import starsVert from './shader/bgStar/bgStars.vert';
import pixelate from './shader/pixelate/pixelate.frag';

export const assets = {
    nebulaFragment: nebulaFrag,
    starsFragment: starsFrag,
    starVertex: starsVert,
    pixelateFragment: pixelate,
}