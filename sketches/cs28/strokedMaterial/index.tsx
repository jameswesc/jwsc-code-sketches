// @ts-ignore
import vert from './stroke.vert'
// @ts-ignore
import frag from './stroke.frag'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Color, Vector2 } from 'three'

const StrokedColorMaterial = shaderMaterial(
    {
        color: new Color('#000'),
        stroke: new Color('#000'),
        strokeWidth: 0.05,
        size: [1, 1],
    },
    vert,
    frag,
)

export type IStrokedColorMaterial = {
    stroke?: Color | string
    strokeWidth?: number
    size?: Vector2 | number[]
} & JSX.IntrinsicElements['shaderMaterial']

extend({ StrokedColorMaterial })

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            strokedColorMaterial: IStrokedColorMaterial
        }
    }
}
