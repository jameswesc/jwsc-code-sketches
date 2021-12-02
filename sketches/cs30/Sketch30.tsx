import React, { Suspense, useMemo, useRef } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSeed, useSeedStore } from 'features/seed'
import {
    Box,
    Environment,
    OrbitControls,
    Plane,
    Sphere,
} from '@react-three/drei'
import { IsometricRotation } from 'components/IsometricRotation'
import { IRandom, Smush32 } from '@thi.ng/random'
import { BoxBufferGeometry, DoubleSide, Mesh, Vector3 } from 'three'

import { XYZ } from 'types/xyz'
import { useControls } from 'leva'

const { cos, sin, PI: pi } = Math

const INITIAL_SEED = 15236161
useSeedStore.setState({ seed: INITIAL_SEED })

const colors = ['0a0908', '22333b', 'f2f4f3', 'a9927d', '5e503f'].map(
    (s) => '#' + s,
)

function abs(v: Vector3) {
    return new Vector3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z))
}

// length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
// lmq0 + min(max(q.x,max(q.y,q.z)),0.0)
// lmq0 + min(max(q.x,mqyz),0.0)
// lmq0 + min(mqxyz,0.0)
// lmq0 + mmqxyz

function sdfBox(pos: Vector3, bounds: Vector3) {
    const q: Vector3 = abs(pos).sub(bounds)

    const lmq0: number = q.clone().max(new Vector3()).length()
    const mmqxyz: number = Math.min(Math.max(q.x, Math.max(q.y, q.z)), 0)

    return lmq0 + mmqxyz
}

// a^2 + b^2 + c^2 = r^2
// 3 * a^2 = r^2
// a^2 = r^2 / 3
// a = sqrt(r^2 / 3)

function cubeInSphere(radius: number) {
    return Math.abs(Math.sqrt((radius * radius) / 3))
}

const BOUNDS = 5
const boundsVector = new Vector3(BOUNDS, BOUNDS, BOUNDS)

interface IBox {
    position: Vector3
    bounds: Vector3
    distance: number
    withinItem?: boolean
}

// 6379912

function generateBoxes(trials: number, rnd: IRandom, bounds: Vector3) {
    const rndPosition = () =>
        new Vector3(
            rnd.minmax(-bounds.x, bounds.x),
            rnd.minmax(-bounds.y, bounds.y),
            rnd.minmax(-bounds.z, bounds.z),
        )

    const boxes: IBox[] = []

    for (let i = 0; i < trials; i++) {
        const position = rndPosition()
        const negPosition = new Vector3().sub(position)
        // The distance to the whole bounding box will always be negative
        let distance = Math.abs(sdfBox(negPosition, bounds))
        let withinItem = false
        console.log({ distance })

        for (let box of boxes) {
            const d = sdfBox(negPosition, box.bounds)
            console.log({ box, d, position })
            if (d < 0) {
                withinItem = true
                break
            } else {
                distance = Math.min(distance, d)
            }
        }

        if (!withinItem) {
            let size = cubeInSphere(distance) * 2
            boxes.push({
                position,
                bounds: new Vector3(size, size, size),
                distance,
                withinItem,
            })
        }
    }

    console.log(boxes)

    return boxes
}

function Sketch() {
    const seed = useSeed()
    const rnd = new Smush32(seed)

    const colors = useSeededColorPalette()
    const { trials } = useControls('Sketch 28', {
        trials: 100,
    })

    const boxes = generateBoxes(trials, rnd, boundsVector)

    return (
        <group>
            <Box args={[BOUNDS * 2, BOUNDS * 2, BOUNDS * 2, 4, 4, 4]}>
                <meshBasicMaterial wireframe color="#fff" />
            </Box>
            {boxes.map((box, i) => (
                <group key={i}>
                    <Box
                        position={box.position}
                        scale={box.bounds}
                        onClick={() => console.log(box)}
                    >
                        <meshStandardMaterial
                            color={colors[1 + (i % (colors.length - 1))]}
                        />
                    </Box>
                    <Sphere args={[box.distance]} position={box.position}>
                        <meshBasicMaterial
                            color={colors[1 + (i % (colors.length - 1))]}
                            wireframe
                        />
                    </Sphere>
                </group>
            ))}
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
                linear
            >
                <color attach="background" args={[colors[0]]} />

                <FrameExporter prefix="CS30" />

                <Suspense fallback={null}>
                    <Environment preset="forest" />
                </Suspense>

                <IsometricRotation>
                    <Sketch />
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}

export default SketchCanvas
