import React, { useMemo, useRef } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSeed, useSeedStore } from 'features/seed'
import { Box, OrbitControls, Plane } from '@react-three/drei'
import { IsometricRotation } from 'components/IsometricRotation'
import { Smush32 } from '@thi.ng/random'
import { BoxBufferGeometry, DoubleSide, Mesh } from 'three'

import './strokedMaterial'
import { XYZ } from 'types/xyz'

const { cos, sin, PI: pi } = Math

const INITIAL_SEED = 15236161
useSeedStore.setState({ seed: INITIAL_SEED })

function MyBox({
    size: [sx, sy, sz],
    strokeWidth = 0.025,
    ryFactor = 0.01,
    colors,
    ...props
}: {
    size: XYZ
    colors: string[]
    ryFactor?: number
    strokeWidth?: number
} & JSX.IntrinsicElements['mesh']) {
    const [, c1, c2, c3] = colors
    const ref = useRef<Mesh>(null!)

    useFrame(() => {
        ref.current.rotation.y += ryFactor
    })

    return (
        <Box {...props} args={[sx, sy, sz]} ref={ref}>
            <strokedColorMaterial
                attachArray="material"
                size={[sz, sy]}
                color={c1}
                stroke={c2}
                strokeWidth={strokeWidth}
            />
            <strokedColorMaterial
                attachArray="material"
                size={[sz, sy]}
                color={c1}
                stroke={c2}
                strokeWidth={strokeWidth}
            />
            <strokedColorMaterial
                attachArray="material"
                size={[sx, sz]}
                color={c2}
                stroke={c3}
                strokeWidth={strokeWidth}
            />
            <strokedColorMaterial
                attachArray="material"
                size={[sx, sz]}
                color={c2}
                stroke={c3}
                strokeWidth={strokeWidth}
            />
            <strokedColorMaterial
                attachArray="material"
                size={[sx, sy]}
                color={c3}
                stroke={c1}
                strokeWidth={strokeWidth}
            />
            <strokedColorMaterial
                attachArray="material"
                size={[sx, sy]}
                color={c3}
                stroke={c1}
                strokeWidth={strokeWidth}
            />
        </Box>
    )
}

function Sketch() {
    const colors = useSeededColorPalette()

    const seed = useSeed()
    const rnd = useMemo(() => new Smush32(seed), [seed])
    const gap = rnd.float(2)

    const size: XYZ = [6, 2, 6]

    return (
        <group>
            <MyBox
                rotation-y={rnd.float(2 * Math.PI)}
                position-y={-2 - gap}
                size={size}
                colors={colors}
                strokeWidth={0.03}
                ryFactor={rnd.minmax(-0.02, 0.02)}
            />
            <MyBox
                rotation-y={rnd.float(2 * Math.PI)}
                position-y={0}
                size={size}
                colors={colors}
                strokeWidth={0.03}
                ryFactor={rnd.minmax(-0.02, 0.02)}
            />
            <MyBox
                rotation-y={rnd.float(2 * Math.PI)}
                position-y={2 + gap}
                size={size}
                colors={colors}
                strokeWidth={0.03}
                ryFactor={rnd.minmax(-0.02, 0.02)}
            />
            {/* <Plane args={[4, 2]}>
                <strokedColorMaterial size={[4, 2]} />
            </Plane> */}
        </group>
    )
}

function SketchCanvas() {
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
                <color attach="background" args={[colors[0]]} />

                <FrameExporter prefix="CS27" />

                <IsometricRotation>
                    <Sketch />
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}

export default SketchCanvas
