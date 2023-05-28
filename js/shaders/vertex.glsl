uniform float time;
uniform vec2 hover;
uniform float hoverState;

varying float vNoise;
varying vec2 vUv;

void main() {

    vec3 newPosition = position;
    // float noise = cnoise(vec3(position.x, position.y, position.y + time * 0.2) / 3.0);
    // newPosition.z += 0.1 * noise;
    float dist = distance(uv, hover);

    newPosition.z += hoverState * 0.1 * sin(dist * 10. + time * 0.3);

    // newPosition += normal * noise;

    vNoise = hoverState * 0.1 * sin(dist * 10. - time * 0.3);
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}