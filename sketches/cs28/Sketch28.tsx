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

import './strokedMaterial/vert'

const { cos, sin, PI: pi } = Math

const INITIAL_SEED = 15236161
useSeedStore.setState({ seed: INITIAL_SEED })

const colors = ['#442b48', '#bbbdf6', '#9893da', '#da4167', '#dbff76']

function Sketch() {
    return (
        <group>
            <Box rotation={[1.5, 1, 0.5]} scale={2}>
                <strokedColorMaterial
                    color={colors[3]}
                    stroke={colors[4]}
                    strokeWidth={0.01}
                />
            </Box>
        </group>
    )
}

function SketchCanvas() {
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
                linear
            >
                <color attach="background" args={[colors[0]]} />

                <FrameExporter prefix="CS28" />

                <IsometricRotation>
                    <Sketch />
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}

export default SketchCanvas
