import { amberDark } from '@radix-ui/colors'
import { getDatabase, NOTION_DB_ID } from 'lib/notion'
import { NextPage } from 'next'
import { styled } from 'stitches.config'

type NotionResponse = {
    posts: any[]
}

const Pre = styled('pre', {
    color: amberDark.amber12,
})

const Sketches: NextPage<NotionResponse> = ({ posts }) => {
    // console.log(props)
    return (
        <main>
            {posts.map((p, i) => (
                <Pre key={i}>{JSON.stringify(p, null, 4)}</Pre>
            ))}
        </main>
    )
}

export default Sketches

export const getStaticProps = async () => {
    const database = await getDatabase(NOTION_DB_ID)

    return {
        props: {
            posts: database,
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every second
        revalidate: 1, // In seconds
    }
}
