// These are already defined
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// attribute vec3 position;

uniform vec3 size;
varying vec2 vSize;
varying vec2 vSizeMax;


uniform vec3 xColor;
uniform vec3 yColor;
uniform vec3 zColor;

varying vec3 vColor;


void main() {

    float isX = abs(normal.x);
    float isY = abs(normal.y);
    float isZ = abs(normal.z);

    vColor = isX * xColor + isY * yColor + isZ * zColor;

    vSizeMax = isX * size.zy + isY * size.xz + isZ * size.xy;
    vSize = uv * vSizeMax;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}