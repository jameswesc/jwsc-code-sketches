import {
    defn,
    Vec2Sym,
    defMain,
    uniform,
    output,
    input,
    assign,
    vec4,
    mul,
} from '@thi.ng/shader-ast'
import {} from '@thi.ng/shader-ast-stdlib'

const projectionMatrix = uniform('mat4', 'projectionMatrix')
const viewMatrix = uniform('mat4', 'viewMatrix')
const modelMatrix = uniform('mat4', 'modelMatrix')

const position = input('vec3', 'position')

const gl_Position = output('vec4', 'gl_Position')

const vert = defMain(() => [
    assign(
        gl_Position,
        mul(
            projectionMatrix,
            mul(viewMatrix, mul(modelMatrix, vec4(position, 1.0))),
        ),
    ),
])

console.log(vert)
