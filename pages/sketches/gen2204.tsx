import { SketchLayout } from 'components/SketchLayout'
import { Leva } from 'leva'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Sketch2204 } from 'sketches/genuary2204'

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Genurary 2022 #1 | James Wesc</title>
                <meta
                    name="description"
                    content="Next Fidenza - Genuary 2022 #4 - A Generative Art and Code Sketches by James Wesc."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Leva titleBar={false} />

            <SketchLayout sketch={<Sketch2204 />} />

            <footer></footer>
        </div>
    )
}

export default Home
