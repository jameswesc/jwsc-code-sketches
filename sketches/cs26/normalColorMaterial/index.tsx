// @ts-ignore
import vert from './normalColors.vert'
// @ts-ignore
import frag from './normalColors.frag'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { Color, Vector3 } from 'three'

const NormalColorMaterial = shaderMaterial(
    {
        xColor: new Color('#ff0000'),
        yColor: new Color('#00ff00'),
        zColor: new Color('#0000ff'),
        outerStroke: new Color('#000000'),
        outerStrokeWidth: 0.1,
        innerStroke: new Color('#ffffff'),
        innerStrokeWidth: 0.05,
        size: new Vector3(1, 1, 1),
    },
    vert,
    frag,
)

export type INormalColorMaterial = {
    xColor?: Color | string
    yColor?: Color | string
    zColor?: Color | string
    outerStroke?: Color | string
    outerStrokeWidth?: number
    innerStroke?: Color | string
    innerStrokeWidth?: number
    size?: Vector3 | number[]
} & JSX.IntrinsicElements['shaderMaterial']

extend({ NormalColorMaterial })

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            normalColorMaterial: INormalColorMaterial
        }
    }
}
