
uniform vec2 size;
varying vec2 vSize;


uniform vec3 color;
uniform vec3 stroke;

uniform float strokeWidth;

void main() {

    vec2 inner = step(vec2(strokeWidth), fract(vSize));
    vec2 outer = step(vec2(strokeWidth), fract(size - vSize));

    gl_FragColor.rgb = mix(stroke, color, inner.x * inner.y * outer.x * outer.y);
    gl_FragColor.a = 1.0;
}