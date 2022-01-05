// @ts-ignore
import vert from './stroke.vert'
// @ts-ignore
import frag from './stroke.frag'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Color, Vector3 } from 'three'

const StrokedNormalColorMaterial = shaderMaterial(
    {
        color: new Color('#000'),
        stroke: new Color('#000'),

        xColor: new Color('#f00'),
        yColor: new Color('#0f0'),
        zColor: new Color('#00f'),

        strokeWidth: 0.05,
        size: [1, 1, 1],
    },
    vert,
    frag
)

export type StrokedNormalColorMaterialImpl = {
    stroke?: Color | string

    xColor?: Color | string
    yColor?: Color | string
    zColor?: Color | string

    strokeWidth?: number
    size?: Vector3 | number[]
} & JSX.IntrinsicElements['shaderMaterial']

extend({ StrokedNormalColorMaterial })

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            strokedNormalColorMaterial: StrokedNormalColorMaterialImpl
        }
    }
}
