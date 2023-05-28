uniform sampler2D uImage;
uniform float time;
uniform vec2 hover;
uniform float hoverState;

varying float vNoise;
varying vec2 vUv;

void main() {

    vec4 imageTexture = texture2D(uImage, vUv);

    vec2 p = vUv;
    float x = hoverState;
    x = smoothstep(.0, 1.0, (x * 2.0 + p.y - 1.0));
    vec4 f = mix(texture2D(uImage, (p - .5) * (1. - x) + .5), texture2D(uImage, (p - .5) * x + .5), x);

    gl_FragColor = f;
    gl_FragColor.rgb += 0.3 * vec3(vNoise);
}
