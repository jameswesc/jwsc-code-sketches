import React from 'react'
import { IconButton } from 'components/IconButton'
import { DownloadIcon } from '@radix-ui/react-icons'
import { useDownloadNextFrame } from '.'
import { useSeed } from '../seed'

export function DownloadFrameButton() {
    const seed = useSeed()
    const downloadNextFrame = useDownloadNextFrame()

    return (
        <IconButton
            onClick={() => {
                downloadNextFrame()
            }}
        >
            <DownloadIcon />
        </IconButton>
    )
}
