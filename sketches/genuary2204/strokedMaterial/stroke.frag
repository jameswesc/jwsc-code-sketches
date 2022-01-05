
varying vec2 vSize;
varying vec2 vSizeMax;

uniform vec3 color;
uniform vec3 stroke;

uniform float strokeWidth;

varying vec3 vColor;

void main() {

    vec2 inner = step(vec2(strokeWidth), fract(vSize));
    vec2 outer = step(vec2(strokeWidth), fract(vSizeMax - vSize));

    // gl_FragColor.rgb = mix(stroke, color, inner.x * inner.y * outer.x * outer.y);
    
    gl_FragColor.rgb = vColor;
    gl_FragColor.a = 1.0;
}