#ifdef GL_ES
precision mediump float;
#else
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform vec2 uCamera;
uniform float uScale;
uniform float uTime;

vec2 random2(vec2 p, float seed) {
    return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * seed);
}

vec2 random2(vec2 p) {
    return random2(p, 232536.5453);
}

float getAlphaBasedOnColor(in vec3 color, float threshold) {
    float ret = 0.;
    ret += step(threshold, color.r);
    ret += step(threshold, color.g);
    ret += step(threshold, color.b);
    return clamp(0., 1., ret);
}

void main() {
    vec2 pxl = vTextureCoord;
    vec3 color = vec3(.0);
    pxl *= 20.;

    vec2 iPxl = floor(pxl);
    vec2 fPxl = fract(pxl);

    float minDistance = 1.;

    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(iPxl + neighbor);
            vec2 diffOfCamera = abs(log(10. + uCamera * uScale / 5.));
            point = 0.5 + 0.5 * sin((uTime / 40. + diffOfCamera) + 6.2831 * point);
            minDistance = min(minDistance, length(neighbor + point - fPxl));
        }
    }
    color += 1. - smoothstep(.005, .02, minDistance);
    color = color * vec3(sin(iPxl.x * iPxl.y), sin(3544.3445 * iPxl.x * iPxl.y) / 2., sin(44.3445 * iPxl.x * iPxl.y));
    gl_FragColor = vec4(color, getAlphaBasedOnColor(color, .999));
}
