import { SketchLayout } from 'components/SketchLayout'
import type { NextPage } from 'next'
import Head from 'next/head'
import Sketch from 'sketches/cs25'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>CS25 | James Wesc</title>
                <meta
                    name="description"
                    content="CS25 - A Generative Art and Code Sketches by James Wesc."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <SketchLayout sketch={<Sketch />} />

            <footer></footer>
        </div>
    )
}

export default Home
