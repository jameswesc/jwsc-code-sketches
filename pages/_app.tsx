import 'styles/preflight.css'
import 'styles/globals.css'

import type { AppProps } from 'next/app'
import { styled } from 'stitches.config'
import { sandDark } from '@radix-ui/colors'

const Page = styled('div', {
    bg: sandDark.sand1,
})

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Page>
            <Component {...pageProps} />
        </Page>
    )
}

export default MyApp
