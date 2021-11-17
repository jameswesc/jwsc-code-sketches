import React from 'react'
import { SeedRandom, SeedReset, SeedInput } from 'features/seed'
import { DownloadFrameButton } from 'features/frameExporter'
import { styled } from 'stitches.config'

export const ControlsRoot = styled('div', {
    padding: '$1',
    width: '30ch',
})

const ControlGrid = styled('div', {
    display: 'grid',
    gridAutoFlow: 'column',
    gridTemplateColumns: 'auto auto 1fr auto',
    gap: '$1',
})

export function DefaultControls() {
    return (
        <ControlsRoot>
            <ControlGrid>
                <SeedReset />
                <SeedRandom />
                <SeedInput />
                <DownloadFrameButton />
            </ControlGrid>
        </ControlsRoot>
    )
}
