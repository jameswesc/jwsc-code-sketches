import { useThree } from '@react-three/fiber'

export function ScaleToFit({
    children,
    size = 10,
    ...props
}: JSX.IntrinsicElements['group'] & {
    size?: number
}) {
    const viewport = useThree((s) => s.viewport)
    const viewportSize = Math.min(viewport.width, viewport.height)
    const scale = viewportSize / size

    return (
        <group {...props} scale={scale}>
            {children}
        </group>
    )
}
