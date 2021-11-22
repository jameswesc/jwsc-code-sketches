// These are already defined
// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
// attribute vec3 position;
varying vec2 vUv;

uniform vec3 xColor;
uniform vec3 yColor;
uniform vec3 zColor;

varying vec3 vColor;
uniform vec3 size;

varying float vMinSize;
varying vec2 vSize;

varying vec3 vC;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    vec3 v = abs(normal);
    
    // Make it so the UV for each face has 0
    // at the outer edge. Only works for the faces 
    // facing the screen
    vUv = v.x * vec2(1.0 - uv.x, uv.y) * size.zy + 
        v.y * vec2(uv.x, 1.0 - uv.y) * size.xz + 
        v.z * uv * size.xy;

    vC = normal;

    vSize = v.x * size.zy + 
        v.y * size.xz + 
        v.z * size.xy;

    // send the colour through depending on the normal
    vColor = v.x * xColor + v.y * yColor + v.z * zColor;

    vMinSize = min(size.x, min(size.y, size.z));
}