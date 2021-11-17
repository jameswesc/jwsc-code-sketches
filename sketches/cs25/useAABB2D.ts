import { IRandom, Smush32 } from '@thi.ng/random'
import { useControls } from 'leva'
import { useMemo } from 'react'
import { useSeed } from 'features/seed'

interface IXY {
    x: number
    y: number
}

export interface IBox {
    position: IXY
    size: IXY
}

export interface IBoxMinMax {
    min: IXY
    max: IXY
}

export function boxToMinMax(box: IBox): IBoxMinMax {
    return {
        min: {
            x: box.position.x - 0.5 * box.size.x,
            y: box.position.y - 0.5 * box.size.y,
        },
        max: {
            x: box.position.x + 0.5 * box.size.x,
            y: box.position.y + 0.5 * box.size.y,
        },
    }
}

function isBoxWithinBounds(a: IBox, b: IBoxMinMax) {
    return isAWithinBMinMax(boxToMinMax(a), b)
}

function isAWithinBMinMax(a: IBoxMinMax, b: IBoxMinMax) {
    return (
        a.min.x >= b.min.x &&
        a.max.x <= b.max.x &&
        a.min.y >= b.min.y &&
        a.max.y <= b.max.y
    )
}

function intersectBoxes(a: IBox, b: IBox) {
    return intersectMinMax(boxToMinMax(a), boxToMinMax(b))
}

function intersectMinMax(a: IBoxMinMax, b: IBoxMinMax) {
    return (
        a.min.x <= b.max.x &&
        a.max.x >= b.min.x &&
        a.min.y <= b.max.y &&
        a.max.y >= b.min.y
    )
}

function generateBoxes(
    trials: number,
    rnd: IRandom,
    bounds: IBoxMinMax,
    size: IBoxMinMax,
    boxes: IBox[] = [],
    stayInBounds = false,
) {
    for (let i = 0; i < trials; i++) {
        const box: IBox = {
            position: {
                x: rnd.minmax(bounds.min.x, bounds.max.x),
                y: rnd.minmax(bounds.min.y, bounds.max.y),
            },
            size: {
                x: rnd.minmax(size.min.x, size.max.x),
                y: rnd.minmax(size.min.y, size.max.y),
            },
        }

        const intersectsWithNewBox = (b: IBox) => intersectBoxes(box, b)

        if (!boxes.find(intersectsWithNewBox)) {
            if (stayInBounds) {
                if (isBoxWithinBounds(box, bounds)) {
                    console.log('checking in bounds')

                    boxes.push(box)
                }
            } else {
                console.log('checkout out bounds')
                boxes.push(box)
            }
        }
    }
    return boxes
}

export function useBoundedAABB2D(id = 'Bounded AABB2D') {
    const seed = useSeed()

    const {
        layers,
        trials,
        // size
        minSize,
        maxSize,
        // bounds
        minBounds,
        maxBounds,
        // ...
        sizeFactor,
        trialsFactor,
        stayWithinBounds,
    } = useControls(
        id,
        {
            layers: {
                value: 1,
                min: 1,
                max: 10,
                step: 1,
            },
            trials: {
                value: 40,
                min: 1,
            },
            // Size
            minSize: { x: 0.5, y: 0.5 },
            maxSize: { x: 5, y: 5 },
            // Bounds
            minBounds: { x: -10, y: -10 },
            maxBounds: { x: 10, y: 10 },
            // factors
            sizeFactor: {
                value: 1,
                min: 0,
            },
            trialsFactor: {
                value: 1,
                min: 0,
            },
            stayWithinBounds: false,
        },
        { collapsed: true },
    )

    return useMemo(() => {
        const rnd = new Smush32(seed)
        let boxes: IBox[] = []
        for (let i = 0; i < layers; i++) {
            generateBoxes(
                trials * trialsFactor ** i,
                rnd,
                { min: minBounds, max: maxBounds },
                {
                    min: {
                        x: minSize.x * sizeFactor ** i,
                        y: minSize.y * sizeFactor ** i,
                    },
                    max: {
                        x: maxSize.x * sizeFactor ** i,
                        y: maxSize.y * sizeFactor ** i,
                    },
                },
                boxes,
                stayWithinBounds,
            )
        }
        return boxes
    }, [
        layers,
        trials,
        trialsFactor,
        minSize,
        maxSize,
        minBounds,
        maxBounds,
        sizeFactor,
        seed,
        stayWithinBounds,
    ])
}
