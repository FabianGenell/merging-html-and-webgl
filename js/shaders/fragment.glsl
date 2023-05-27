uniform sampler2D uImage;
uniform float time;
uniform vec2 hover;

varying float vNoise;
varying vec2 vUv;

void main() {

    vec4 imageTexture = texture2D(uImage, vUv);

    float mouseDist = distance(hover, vec2(0.5));
    float dist = distance(vUv, hover);

    gl_FragColor = imageTexture;
    gl_FragColor.rgb += 0.3 * vec3(vNoise);
    //gl_FragColor = vec4(vNoise, 0.0, 0.0, 1.0);
}
