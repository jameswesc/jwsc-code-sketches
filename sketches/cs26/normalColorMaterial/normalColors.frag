uniform vec3 outerStroke;
uniform float outerStrokeWidth;
uniform vec3 innerStroke;
uniform float innerStrokeWidth;
uniform vec3 size;

varying vec3 vColor;
varying vec2 vUv;
varying float vMinSize;
varying vec2 vSize;

void main() {

    float outerStep = 0.5 * vSize.x;
    float innerStep = 0.25 * vSize.y;

    vec2 outer = step(vec2(outerStrokeWidth * vMinSize), vUv);
    vec2 inner = step(vec2(innerStrokeWidth * vMinSize), vSize - vUv);

    vec3 color = vColor;
    color = mix(innerStroke, color, inner.x * inner.y);
    color = mix(outerStroke, color, outer.x * outer.y);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;   

}