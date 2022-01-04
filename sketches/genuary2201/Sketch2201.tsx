import React, { Suspense, useMemo, useRef } from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useSeed } from 'features/seed'
import { Environment, OrbitControls, shaderMaterial } from '@react-three/drei'
import { IRandom, Smush32 } from '@thi.ng/random'
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Color,
    Group,
    TorusKnotBufferGeometry,
} from 'three'

import { ScaleToFit } from 'components/ScaleToFit'
import { useControls } from 'leva'

const RADIUS = 1
const TUBE = 0.3
const TUBE_SEGMENTS = 256
const RADIAL_SEGMENTS = 32

const PS = [1, 2, 3, 4, 5, 6]
const QS = [1, 2, 3, 4, 5, 6]

function pick<T>(arr: T[], number: number, rnd: IRandom): T[] {
    const arrayCopy = arr.slice()
    const returnArray: T[] = []

    if (number < 1 || number > arr.length) {
        console.warn('Invalid number in pick')
        return []
    }

    for (let i = 0; i < number; i++) {
        let ndx = Math.floor(rnd.float(arrayCopy.length))
        const [picked] = arrayCopy.splice(ndx, 1)
        returnArray.push(picked)
    }

    return returnArray
}

function shuffle<T>(arr: T[], rnd: IRandom) {
    var i: number,
        n = arr.length,
        p: number
    for (i = n - 1; i > 0; i--) {
        p = Math.floor(rnd.float(i))
        arr.splice(i, 1, arr.splice(p, 1, arr[i]).pop())
    }

    return arr
}

function makeTorus(p: number, q: number) {
    return new TorusKnotBufferGeometry(
        RADIUS,
        TUBE,
        TUBE_SEGMENTS,
        RADIAL_SEGMENTS,
        p,
        q
    )
}

const ITEMS = 10_000

const CustomPointsMaterial = shaderMaterial(
    { t: 0, color1: new Color(), color2: new Color(), size: 1 },
    `
    uniform float t;
    uniform float size;

    attribute vec3 aPos1;
    attribute vec3 aPos2;


    void main()
    {
        /**
        * Position
        */
        
        vec3 pos = mix(aPos1, aPos2, t);

        vec4 viewPosition = modelViewMatrix * vec4(pos, 1.0);

        vec4 projectedPosition = projectionMatrix * viewPosition;

        gl_Position = projectedPosition;

        /**
        * Size
        */
        gl_PointSize = size * 100.0;
        gl_PointSize *= (1.0 / - viewPosition.z);

    }
    
    `,
    `
    uniform float t;
    uniform vec3 color1;
    uniform vec3 color2;
    
    
    void main() {
        float strength = distance(gl_PointCoord, vec2(0.5));
        strength *= 2.0;
        strength = 1.0 - strength;
    
        vec3 c = mix(color1, color2, t);

        gl_FragColor = vec4(c, strength);
    }
    `
)

export type CustomPointsMaterialImpl = {
    t: number
    size?: number
    color1: string | Color
    color2: string | Color
} & JSX.IntrinsicElements['shaderMaterial']

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            customPointsMaterial: CustomPointsMaterialImpl
        }
    }
}

extend({ CustomPointsMaterial })

const LOOP_DURATION = 10

function Sketch() {
    const seed = useSeed()
    const rnd = useMemo(() => new Smush32(seed), [seed])

    const colors = useSeededColorPalette()

    const data = useMemo(() => {
        const ps = pick(PS, 2, rnd)
        const qs = pick(QS, 2, rnd)

        const torus1 = makeTorus(ps[0], qs[0])
        const t1p = torus1.getAttribute('position')

        const torus2 = makeTorus(ps[1], qs[1])
        const t2p = torus2.getAttribute('position')

        const geometry = new BufferGeometry()

        const p1Array: [number, number, number][] = []
        const p2Array: [number, number, number][] = []

        for (let i = 0; i < ITEMS; i++) {
            p1Array.push([
                t1p.getX(i % t1p.count),
                t1p.getY(i % t1p.count),
                t1p.getZ(i % t1p.count),
            ])
            p2Array.push([
                t2p.getX(i % t2p.count),
                t2p.getY(i % t2p.count),
                t2p.getZ(i % t2p.count),
            ])
        }
        shuffle(p1Array, rnd)
        shuffle(p2Array, rnd)

        const p1Float = new Float32Array(p1Array.flat())
        const p2Float = new Float32Array(p2Array.flat())

        geometry.setAttribute('position', new BufferAttribute(p1Float, 3))
        geometry.setAttribute('aPos1', new BufferAttribute(p1Float, 3))
        geometry.setAttribute('aPos2', new BufferAttribute(p2Float, 3))

        return {
            geometry,
        }
    }, [rnd])

    const material = useRef<CustomPointsMaterialImpl>(null!)
    const group = useRef<Group>(null!)

    useFrame(({ clock: { elapsedTime } }) => {
        const time = elapsedTime % LOOP_DURATION
        const t = time / LOOP_DURATION

        group.current.rotation.y = 2 * Math.PI * t

        material.current.t = Math.sin(t * 2 * Math.PI)
    })

    const { size, color1Index, color2Index } = useControls('Points', {
        size: 3,
        color1Index: {
            value: 1,
            options: [1, 2, 3, 4],
        },
        color2Index: {
            value: 2,
            options: [1, 2, 3, 4],
        },
    })

    return (
        <group ref={group}>
            <points geometry={data.geometry}>
                <customPointsMaterial
                    ref={material}
                    color1={colors[color1Index]}
                    color2={colors[color2Index]}
                    t={0}
                    transparent
                    depthTest={false}
                    depthWrite={false}
                    size={size}
                    blending={AdditiveBlending}
                />
            </points>
        </group>
    )
}

export function Sketch2201() {
    const colors = useSeededColorPalette()

    return (
        <SketchSize>
            <Canvas
                dpr={[1, 2]}
                camera={{
                    position: [0, 0, 40],
                    near: 0.1,
                    far: 1000,
                }}
                linear
            >
                <color attach="background" args={[colors[0]]} />

                <FrameExporter prefix="G2201" />

                <Suspense fallback={null}>
                    <Environment preset="dawn" />
                </Suspense>

                <ScaleToFit size={5}>
                    <Sketch />
                </ScaleToFit>

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}
