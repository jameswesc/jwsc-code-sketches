import React, { Suspense, useMemo, useRef } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSeed, useSeedStore } from 'features/seed'
import {
    Box,
    Environment,
    Instance,
    Instances,
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

function sdfSphere(point: Vector3, spherePosition: Vector3, radius: number) {
    return new Vector3().subVectors(spherePosition, point).length() - radius
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
    radius: number
}

// 6379912

function generateSpheres(trials: number, rnd: IRandom, bounds: Vector3) {
    const rndPosition = () =>
        new Vector3(
            rnd.minmax(-bounds.x, bounds.x),
            rnd.minmax(-bounds.y, bounds.y),
            rnd.minmax(-bounds.z, bounds.z),
        )

    const spheres: IBox[] = []

    for (let i = 0; i < trials; i++) {
        const position = rndPosition()
        // The distance to the whole bounding box will always be negative
        let radius = Math.abs(sdfBox(new Vector3().sub(position), bounds))
        let withinItem = false

        for (let sphere of spheres) {
            const r = sdfSphere(position, sphere.position, sphere.radius)

            if (r < 0) {
                withinItem = true
                break
            } else {
                radius = Math.min(radius, r)
            }
        }

        if (!withinItem) {
            spheres.push({
                position,
                radius,
            })
        }
    }

    console.log(spheres)

    return spheres
}

function Sketch() {
    const seed = useSeed()
    const rnd = new Smush32(seed)

    const colors = useSeededColorPalette()
    const { trials } = useControls('Sketch 28', {
        trials: 100,
    })

    const spheres = generateSpheres(trials, rnd, boundsVector)

    return (
        <group>
            <Instances>
                <sphereBufferGeometry args={[1, 64, 64]} />
                <meshPhysicalMaterial roughness={1} />
                {spheres.map((sphere, i) => (
                    <Instance
                        key={i}
                        position={sphere.position}
                        scale={sphere.radius}
                        // @ts-ignore
                        color={colors[i % colors.length]}
                    />
                ))}
            </Instances>
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

                <FrameExporter prefix="CS31" />

                <Suspense fallback={null}>
                    <Environment preset="dawn" />
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
