import React from 'react'
import { useSeededColorPalette } from 'features/colorPalette'
import { SketchSize } from 'components/SketchSize'
import { FrameExporter } from 'features/frameExporter'
import { Canvas } from '@react-three/fiber'
import { useSeedStore } from 'features/seed'
import { Box, Html, OrbitControls, Plane } from '@react-three/drei'
import './normalColorMaterial'

const { cos, sin, PI: pi } = Math

const INITIAL_SEED = 100
useSeedStore.setState({ seed: INITIAL_SEED })

function ColorPlanes() {
    const colors = useSeededColorPalette()

    return (
        <group position-y={-0.5 * (colors.length - 1) * 3} position-z={-0}>
            {colors.map((c, i) => (
                <Plane key={i} args={[10, 2.5]} position-y={i * 3}>
                    <meshBasicMaterial color={c} />
                </Plane>
            ))}
        </group>
    )
}
function ColorBoxes() {
    const colors = useSeededColorPalette()

    return (
        <group position-y={-0.5 * (colors.length - 1) * 3}>
            {colors.map((c, i) => (
                <Box
                    key={i}
                    args={[5, 2, 1]}
                    position-x={-3.5}
                    position-y={i * 3}
                >
                    <normalColorMaterial
                        innerStrokeWidth={0}
                        innerStroke={c}
                        outerStrokeWidth={0}
                        outerStroke={c}
                        xColor={c}
                        yColor={c}
                        zColor={c}
                    />
                </Box>
            ))}
        </group>
    )
}

function ColorDom() {
    const colors = useSeededColorPalette()

    return (
        <group position-y={-0.5 * (colors.length - 1) * 3} position-z={-0.5}>
            {colors.map((c, i) => (
                <Html key={i} position-x={4} position-y={i * 3} center>
                    <div
                        style={{ backgroundColor: c, width: 200, height: 100 }}
                    ></div>
                </Html>
            ))}
        </group>
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
                linear
            >
                <color attach="background" args={[colors[2]]} />

                <FrameExporter prefix="CS26-linear" />

                <ColorPlanes />
                <ColorBoxes />
                <ColorDom />

                <OrbitControls />
            </Canvas>
        </SketchSize>
    )
}
