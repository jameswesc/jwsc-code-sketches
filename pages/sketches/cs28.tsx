import { SketchLayout } from 'components/SketchLayout'
import { Leva } from 'leva'
import type { NextPage } from 'next'
import Head from 'next/head'
import Sketch from 'sketches/cs28'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>CS28 | James Wesc</title>
                <meta
                    name="description"
                    content="CS28 - A Generative Art and Code Sketches by James Wesc."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Leva titleBar={false} />

            <SketchLayout sketch={<Sketch />} />

            <footer></footer>
        </div>
    )
}

export default Home
