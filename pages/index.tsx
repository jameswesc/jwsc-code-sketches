import { amberDark } from '@radix-ui/colors'
import { Inter } from 'components/Typography'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { styled } from 'stitches.config'

const Main = styled('main', {
    bg: '$slate1',
    width: '100%',
    minHeight: '100vh',
    pt: '2rem',
    px: '1rem',
    display: 'grid',
    gap: '2rem',
    justifyContent: 'start',
    alignContent: 'start',
})

const P = styled(Inter, {
    fontSize: '2rem',
    fontWeight: 300,
    color: amberDark.amber12,
})

const Name = styled(P, {
    fontWeight: 600,
    color: amberDark.amber10,
})

const UL = styled('ul', P)
const LI = styled('ul', P)

const A = styled(styled('a', P), { textDecoration: 'underline' })

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>
                    james wesc | designer, creative developer and generative
                    artist
                </title>
                <meta
                    name="description"
                    content="James Wesc is a designer, creative developer and generative artist mostly working with web technologies."
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Main>
                {/* <Title>James Wesc</Title> */}
                <P>👋 hi</P>
                <P>
                    {`i'm`} <Name as="span">james wesc</Name> 🦘
                </P>
                <P>
                    {`i'm`} a designer, creative developer and generative artist
                    mostly working with web technologies
                </P>
                <UL>
                    <LI>
                        outputs {`-> `}
                        <A
                            className="underline text-indigo-700 hover:text-pink-700"
                            href="https://www.instagram.com/james.wesc/"
                            target="__blank"
                        >
                            instagram
                        </A>
                    </LI>
                    <LI>
                        process {`-> `}
                        <A
                            className="underline text-indigo-700 hover:text-pink-700"
                            href="https://james-wesc.super.site/"
                            target="__blank"
                        >
                            notion
                        </A>
                    </LI>
                    <LI>
                        undefined {`-> `}
                        <A
                            className="underline text-indigo-700 hover:text-pink-700"
                            href="https://twitter.com/james_wesc"
                            target="__blank"
                        >
                            twitter
                        </A>
                    </LI>
                    <LI>
                        time-lapses {`-> `}
                        <A
                            className="underline text-indigo-700 hover:text-pink-700"
                            href="https://www.youtube.com/channel/UC-5DynlFZsSLmFeX3IH1uDw"
                            target="__blank"
                        >
                            youtube
                        </A>
                    </LI>
                    <LI>
                        code {`-> `}
                        <A
                            className="underline text-indigo-700 hover:text-pink-700"
                            href="https://www.instagram.com/james.wesc/"
                            target="__blank"
                        >
                            github
                        </A>
                    </LI>
                </UL>
                <P>
                    by day, i look after design engineering at{' '}
                    <A
                        className="underline text-indigo-700 hover:text-pink-700"
                        href="https://smashdelta.com"
                        target="__blank"
                    >
                        smash delta
                    </A>
                </P>
            </Main>

            <footer></footer>
        </div>
    )
}

export default Home
