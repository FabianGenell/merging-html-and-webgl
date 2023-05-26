uniform sampler2D cloudTexture;
uniform float time;

varying float vNoise;
varying vec2 vUv;

// void main() {
//     vec3 color1 = vec3(1.0, 0.0, 0.0);
//     vec3 color2 = vec3(0.0, 0.0, 1.0);

//     vec3 color = mix(color2, color1, 0.5 * (vNoise + 1.0));

//     vec4 cloudTexture = texture2D(cloudTexture, vUv);

//     gl_FragColor = vec4(color, 1.0);
//     gl_FragColor = cloudTexture;
// }

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
    vec2 uv = vUv;

    float itime = time * 0.2;

    for(float i = 1.0; i < 100.0; i++) {
        uv.x += cos(itime * 0.2) / i * sin(i * 1.5 * uv.y + itime * 0.05);
        uv.y += sin(itime * 0.2) / i * cos(i * 1.5 * uv.x + itime * 0.05);
    }
    float pattern = 0.5 / abs(sin(itime - uv.y - uv.x));

    float hue = itime * 0.005 + 0.45;

    vec3 hsv1 = vec3(hue, 0.9, 0.85);
    vec3 hsv2 = vec3(hue + 0.07, 0.85, 0.75);

    vec3 rgb1 = hsv2rgb(hsv1);
    vec3 rgb2 = hsv2rgb(hsv2);

    vec4 color = vec4(mix(rgb1, rgb2, pattern + 0.2), 1.0);

    gl_FragColor = color;
}