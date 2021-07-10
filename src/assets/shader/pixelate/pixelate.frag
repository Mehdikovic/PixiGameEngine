#ifdef GL_ES
precision mediump float;
#else
precision highp float;
#endif

uniform sampler2D uSamplers[%count%];

varying vec2 vTextureCoord;
varying vec4 vColor;
varying float vTextureId;

vec2 pixelate(vec2 coord, vec2 resolution, float size) {
    float onePixelSizeX = 1.0 / resolution.x;
    float onePixelSizeY = 1.0 / resolution.y;
    
    float cellSizeX = size * onePixelSizeX;
    float cellSizeY = size * onePixelSizeY;
    
    float x = cellSizeX * floor(coord.x / cellSizeX);
    float y = cellSizeY * floor(coord.y / cellSizeY);
    return vec2(x, y);
}

void main(void) {
    vec4 color = vec4(0.);
    %forloop%
    color = vec4(vec3(0.), 1.);
    for (int k = 0; k < %count%; ++k) {
        if (int(vTextureId) == k) {
            color = texture2D(uSamplers[k], vTextureCoord) * vColor;
	        vec2 coord = pixelate(vTextureCoord, vec2(64.), 16.);
            color.rbg = mix(color.rgb, vec3(.7) * color.rgb, mix(.5, .0, coord.x));
            color.rbg = mix(color.rgb, vec3(.7) * color.rgb, mix(.5, .0, coord.y));
        }
    }
    gl_FragColor = vec4(color.rgb, 1.);
}