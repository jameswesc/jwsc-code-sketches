import React, { useMemo } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas } from '@react-three/fiber'
import { useSeed, useSeedStore } from 'features/seed'
import { Box, Line, OrbitControls } from '@react-three/drei'
import { IBox, IBoxMinMax, useBoundedAABB2D } from './useAABB2D'
import './normalColorMaterial'
import { IsometricRotation } from 'components/IsometricRotation'
import { Smush32 } from '@thi.ng/random'

const { cos, sin, PI: pi } = Math

const INITIAL_SEED = 100
useSeedStore.setState({ seed: INITIAL_SEED })

function OutlineBox({
    min: { x: x1, y: y1 },
    max: { x: x2, y: y2 },
    lineWidth = 1,
    color = '#ffffff',
}: IBoxMinMax & {
    lineWidth?: number
    color?: string
}) {
    return (
        <Line
            points={[
                [x1, 0, y1],
                [x1, 0, y2],
                [x2, 0, y2],
                [x2, 0, y1],
                [x1, 0, y1],
            ]}
            lineWidth={lineWidth}
            color={color}
        />
    )
}

function MyBox({ box, index }: { box: IBox; index: number }) {
    const colors = useSeededColorPalette()

    const seed = useSeed()
    const rnd = useMemo(() => new Smush32((seed + index) / 10), [seed, index])

    const height = rnd.minmax(
        1,
        (20 - Math.max(Math.abs(box.position.x), Math.abs(box.position.y))) * 3,
    )

    const themes = [
        [0, 1, 2, 3],
        [3, 2, 0, 1],
        [4, 1, 3, 0],
    ]

    const [xi, yi, zi, si] = themes[index % themes.length]

    const x = colors[xi]
    const y = colors[yi]
    const z = colors[zi]
    const stroke = colors[si]

    return (
        <Box
            scale-x={box.size.x}
            scale-z={box.size.y}
            scale-y={height}
            position-y={0 * height}
            position-x={box.position.x}
            position-z={box.position.y}
        >
            <normalColorMaterial
                xColor={x}
                yColor={y}
                zColor={z}
                innerStrokeWidth={0.04}
                outerStrokeWidth={0}
                innerStroke={stroke}
                outerStroke={stroke}
            />
        </Box>
    )
}

function Boxes() {
    const boxes = useBoundedAABB2D()

    return (
        <>
            <group>
                {boxes.map((b, i) => (
                    <MyBox box={b} key={i} index={i} />
                ))}
            </group>
        </>
    )
}

export function Sketch() {
    const colors = useSeededColorPalette()

    return (
        <SketchSize>
            <Canvas
                dpr={[1, 2]}
                orthographic
                camera={{
                    position: [0, 0, 100],
                    near: 0.1,
                    far: 1000,
                    zoom: 50,
                }}
            >
                <color attach="background" args={[colors[5]]} />
                <FrameExporter prefix="CS25" />

                <IsometricRotation>
                    <Boxes />
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}
