import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas } from '@react-three/fiber'
import { useSeed, useSeedStore } from 'features/seed'
import {
    Environment,
    Instance,
    Instances,
    OrbitControls,
} from '@react-three/drei'
import { IsometricRotation } from 'components/IsometricRotation'
import { IRandom, Smush32 } from '@thi.ng/random'
import { Vector3 } from 'three'

import { useControls } from 'leva'

const INITIAL_SEED = 15236161
useSeedStore.setState({ seed: INITIAL_SEED })

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

function cubeInSphere(radius: number) {
    return Math.abs(Math.sqrt((radius * radius) / 3))
}

interface IItem {
    position: Vector3
    radius: number
    colourIndex?: number
    lifeIndex: number
}

function findNewSphere(
    spheres: IItem[],
    bounds: Vector3,
    rnd: IRandom,
    maxTrials = 10000,
) {
    const rndPosition = () =>
        new Vector3(
            rnd.minmax(-bounds.x, bounds.x),
            rnd.minmax(-bounds.y, bounds.y),
            rnd.minmax(-bounds.z, bounds.z),
        )

    let newSphere: IItem = {
        position: new Vector3(),
        radius: 1,
        lifeIndex:
            spheres.length > 0 ? spheres[spheres.length - 1].lifeIndex + 1 : 0,
    }
    const boundingSphere: IItem = {
        position: new Vector3(),
        radius: bounds.x + 1,
        lifeIndex: 0,
    }

    // DANGER
    while (true) {
        newSphere.position = rndPosition()
        newSphere.radius = Math.abs(
            sdfSphere(
                newSphere.position,
                boundingSphere.position,
                boundingSphere.radius,
            ),
        )
        newSphere.colourIndex = rnd.float(10)

        let withinItem = false

        for (let sphere of spheres) {
            const r = sdfSphere(
                newSphere.position,
                sphere.position,
                sphere.radius,
            )

            if (r < 0) {
                withinItem = true
                break
            } else {
                newSphere.radius = Math.min(newSphere.radius, r)
            }
        }

        if (!withinItem) {
            return newSphere
        }
    }
}

function Sketch() {
    const seed = useSeed()
    const rnd = useMemo(() => new Smush32(seed), [seed])
    const colors = useSeededColorPalette()

    const { maxSpheres, bounds } = useControls('Sketch 28', {
        maxSpheres: 100,
        bounds: [4, 4, 4],
    })

    const boundsVector = useMemo(() => new Vector3(...bounds), [bounds])

    const [spheres, setSpheres] = useState<IItem[]>([])

    useEffect(() => {
        if (spheres.length >= maxSpheres) {
            spheres.shift()
        }
        const t = setTimeout(() => {
            const newSphere = findNewSphere(spheres, boundsVector, rnd)
            setSpheres((s) => [...s, newSphere])
        }, 10)
        return () => clearTimeout(t)
    }, [spheres, setSpheres, boundsVector, rnd, maxSpheres])

    return (
        <group>
            {spheres.map((sphere) => (
                <mesh
                    key={sphere.lifeIndex}
                    position={sphere.position}
                    scale={sphere.radius}
                >
                    <sphereBufferGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        color={colors[sphere.lifeIndex % colors.length]}
                    />
                </mesh>
            ))}
        </group>
    )
}

function SketchCanvas() {
    const colors = useSeededColorPalette()
    const seed = useSeed()

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

                <FrameExporter prefix="CS32" />

                <Suspense fallback={null}>
                    <Environment preset="dawn" />
                </Suspense>

                <IsometricRotation>
                    {/* Force a full refresh of sketch on seed */}
                    <Sketch key={seed} />
                </IsometricRotation>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}

export default SketchCanvas
