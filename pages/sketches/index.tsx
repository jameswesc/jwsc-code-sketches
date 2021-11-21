import { getDatabase, NOTION_DB_ID } from 'lib/notion'
import { NextPage } from 'next'

const Sketches: NextPage = (props) => {
    // console.log(props)
    return <main></main>
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
