import fs from 'fs';
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Container from 'react-bootstrap/Container';

import ProjectDisplay from 'components/ProjectDisplay';
import ScrollToTop from 'components/ScrollToTop';

import { markdownOptions } from 'utils/markdownOptions';
import { renderToString } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    // lookup then read all .md files in src/markdown.
    const basePath = 'src/assets/markdown';
    let paths: string[] = [];
    fs.readdirSync(basePath).forEach((el) => {
        // folders in src/markdown
        const path = `${basePath}/${el}`;
        fs.readdirSync(`${basePath}/${el}`).forEach((el) => {
            // all files in each folder
            paths.push(`${path}/${el}`);
        });
    });
    const renderedProjects = paths
        .filter((path) => path.match(/.*\.md$/)) // filter only .md files
        .map((path) => fs.readFileSync(path).toString())
        .map((md) => renderToString(<ReactMarkdown {...markdownOptions}>{md}</ReactMarkdown>));

    return {
        props: {
            renderedProjects,
        },
    };
};

//seperator svg
const svg = (
    <svg
        data-name='Layer 1'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 1200 120'
        preserveAspectRatio='none'
    >
        <path d='M1200 0L0 0 598.97 114.72 1200 0z'></path>
    </svg>
);

Projects.layoutProps = {
    className: 'bg-home-gradient bg bg-triangles text-white',
    navbarProps: { activePage: 'projects', bg: 'nah' },
    headerProps: {
        h1: 'Projects',
        classNames: { parent: '' },
        showSeperator: false,
    },
} as LayoutProps;

type Projects = InferGetStaticPropsType<typeof getStaticProps>;

export default function Projects({ renderedProjects }: Projects) {
    return (
        <>
            <Head>
                <title>DEMAC - About</title>
            </Head>
            {/* TODO: add content table + breifing */}
            <main>
                <Container className='p-0'>
                    <ProjectDisplay renderedProjects={renderedProjects} />
                </Container>
            </main>
            {/* TODO: add client reference */}
            <ScrollToTop />
        </>
    );
}
