import React, { Suspense, useMemo, useRef } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas } from '@react-three/fiber'
import { useSeed } from 'features/seed'
import { Environment, OrbitControls } from '@react-three/drei'
import { IRandom, Smush32, uniform } from '@thi.ng/random'
import { ScaleToFit } from 'components/ScaleToFit'
import { IsometricRotation } from 'components/IsometricRotation'

import './strokedMaterial'
import { StrokedNormalColorMaterialImpl } from './strokedMaterial'
import { useControls } from 'leva'

type XYZ = [number, number, number]

interface IBox {
    position: XYZ
    size: XYZ
}

interface IMinMax {
    min: XYZ
    max: XYZ
}

function boxToMinMax({
    position: [p0, p1, p2],
    size: [s0, s1, s2],
}: IBox): IMinMax {
    return {
        min: [p0 - 0.5 * s0, p1 - 0.5 * s1, p2 - 0.5 * s2],
        max: [p0 + 0.5 * s0, p1 + 0.5 * s1, p2 + 0.5 * s2],
    }
}

function intersects(b1: IBox, b2: IBox) {
    const a = boxToMinMax(b1)
    const b = boxToMinMax(b2)

    return (
        a.min[0] <= b.max[0] &&
        a.max[0] >= b.min[0] &&
        a.min[1] <= b.max[1] &&
        a.max[1] >= b.min[1] &&
        a.min[2] <= b.max[2] &&
        a.max[2] >= b.min[2]
    )
}

const BOUNDS = 100

type GenBoxOptions = {
    trials: number
    trialsFactor?: number
    octaves?: number
    scaleFactor?: number
    scaleBounds: IMinMax
    allowIntersection?: boolean
}

function generateBoxes(rnd: IRandom, options: GenBoxOptions): IBox[] {
    const boxes: IBox[] = []
    const {
        trials,
        trialsFactor = 1,
        octaves = 1,
        scaleBounds,
        scaleFactor = 1,
        allowIntersection = false,
    } = options

    for (let o = 0; o < octaves; o++) {
        const scaleMultiplier = scaleFactor ** o

        const p = uniform(rnd, -BOUNDS, BOUNDS)
        const pos: () => XYZ = () => [p(), p(), p()]

        const sx = uniform(
            rnd,
            scaleBounds.min[0] * scaleMultiplier,
            scaleBounds.max[0] * scaleMultiplier
        )
        const sy = uniform(
            rnd,
            scaleBounds.min[1] * scaleMultiplier,
            scaleBounds.max[1] * scaleMultiplier
        )
        const sz = uniform(
            rnd,
            scaleBounds.min[2] * scaleMultiplier,
            scaleBounds.max[2] * scaleMultiplier
        )

        const size: () => XYZ = () => [sx(), sy(), sz()]

        for (let i = 0; i < trials * trialsFactor ** o; i++) {
            const newBox: IBox = {
                position: pos(),
                size: size(),
            }
            if (
                !allowIntersection &&
                !boxes.find((box) => intersects(box, newBox))
            ) {
                boxes.push(newBox)
            }
        }
    }

    return boxes
}

const optionsVaraints: { title: string; options: GenBoxOptions }[] = [
    {
        title: 'Uniform Small',
        options: {
            trials: 150,
            scaleBounds: {
                min: [10, 10, 10],
                max: [10, 10, 10],
            },
        },
    },
    {
        title: 'Uniform Large',
        options: {
            trials: 50,
            scaleBounds: {
                min: [50, 50, 50],
                max: [50, 50, 50],
            },
        },
    },
    {
        title: 'Jumbo Shrink',
        options: {
            trials: 5,
            octaves: 6,
            scaleFactor: 0.5,
            trialsFactor: 2.1,
            scaleBounds: {
                min: [60, 60, 60],
                max: [80, 80, 80],
            },
        },
    },
    {
        title: 'Medium Shrink',
        options: {
            trials: 10,
            octaves: 5,
            scaleFactor: 0.75,
            trialsFactor: 2,
            scaleBounds: {
                min: [25, 25, 25],
                max: [75, 75, 75],
            },
        },
    },
    {
        title: 'Packed Shrink',
        options: {
            trials: 20,
            octaves: 6,
            scaleFactor: 0.75,
            trialsFactor: 2,
            scaleBounds: {
                min: [10, 10, 10],
                max: [40, 40, 40],
            },
        },
    },
    {
        title: 'Flat',
        options: {
            trials: 20,
            octaves: 5,
            scaleFactor: 0.5,
            trialsFactor: 1.5,
            scaleBounds: {
                min: [40, 1, 40],
                max: [80, 10, 80],
            },
        },
    },
    {
        title: 'Tall',
        options: {
            trials: 10,
            octaves: 5,
            scaleFactor: 0.5,
            trialsFactor: 2,
            scaleBounds: {
                min: [10, 60, 10],
                max: [20, 120, 20],
            },
        },
    },
    {
        title: 'Long',
        options: {
            trials: 5,
            octaves: 3,
            scaleFactor: 0.25,
            trialsFactor: 4,
            scaleBounds: {
                min: [400, 10, 10],
                max: [800, 20, 20],
            },
        },
    },
]

function Sketch() {
    const seed = useSeed()
    const rnd = useMemo(() => new Smush32(seed), [seed])

    const { variant } = useControls({
        variant: {
            value: optionsVaraints[0].title,
            options: optionsVaraints.map((d) => d.title),
        },
    })

    const boxes = useMemo(
        () =>
            generateBoxes(
                rnd,
                optionsVaraints.find((d) => d.title === variant).options
            ),
        [rnd, variant]
    )

    return (
        <group>
            {boxes.map((box, i) => (
                <mesh key={i} position={box.position} scale={box.size}>
                    <boxBufferGeometry />
                    <strokedNormalColorMaterial
                        xColor="#111"
                        yColor="#b5b5b5"
                        zColor="#555555"
                        strokeWidth={0.02}
                    />
                </mesh>
            ))}
        </group>
    )
}

export function Sketch2204() {
    const colors = useSeededColorPalette(12077497)

    return (
        <SketchSize>
            <Canvas
                dpr={[1, 2]}
                camera={{
                    position: [0, 0, 40],
                    near: 0.1,
                    far: 1000,
                    zoom: 50,
                }}
                orthographic
                linear
            >
                <color attach="background" args={[colors[0]]} />

                <FrameExporter prefix="G2204" />

                <Suspense fallback={null}>
                    <Environment preset="dawn" />
                </Suspense>

                <IsometricRotation>
                    <ScaleToFit size={250}>
                        <Sketch />
                    </ScaleToFit>
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}
