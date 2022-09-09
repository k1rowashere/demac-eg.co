import Head from 'next/head';

import StoreFront from 'components/StoreFront';

import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { categories } from 'utils/types';

import { pathsToTree } from 'utils/constants';
import { prisma } from 'utils/prisma';

export const getStaticPaths: GetStaticPaths = async () => {
    // get paths from db for categories
    const res = await prisma.products.findMany({
        select: {
            path: true,
        },
        distinct: ['path'],
    });

    let paths: { params: ParsedUrlQuery }[] = [];

    // add paths to array recursively
    function getAllPaths(categoryTree: categories, currPath: string[] = []) {
        if (!categoryTree) return;
        // add current path to paths array
        for (let [name, children] of Object.entries(categoryTree)) {
            const newPath = currPath.concat(name.replaceAll(/\s/g, '-').toLowerCase());
            paths.push({ params: { url: newPath } });
            // add children paths to paths array
            getAllPaths(children, newPath);
        }
    }

    getAllPaths(pathsToTree(res));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    // finds all products that match the path in the url
    let { url = [] } = ctx.params as { url: string[] };
    let pathStr = `/${url.length ? url.join('/').replaceAll('-', ' ') + '/' : ''}%`;

    const _products = await prisma.products.findMany({
        where: {
            path: {
                contains: pathStr,
            },
            price: {
                not: 0,
            },
        },
        select: {
            part_no: true,
            name: true,
            price: true,
            img_link: true,
        },
    });

    // convert decimal to number in products to fix serialization error
    const products = _products.map((product) => ({ ...product, price: Number(product.price) }));

    // get paths from db for categories
    const paths = await prisma.products.findMany({
        select: {
            path: true,
        },
        orderBy: {
            path: 'asc',
        },
        distinct: ['path'],
    });

    return {
        props: {
            products,
            categories: pathsToTree(paths),
            url,
        },
        revalidate: 60,
    };
};

Store.layoutProps = {
    navbarProps: { activePage: 'store' },
    headerProps: {
        h1: 'Welcome to DEMAC store',
        h2: 'Buy original Siemens parts in Egypt!',

        showSeperator: true,
    },
} as LayoutProps;

export default function Store({
    products,
    categories,
    url,
}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>DEMAC - Store</title>
                <meta name='description' content='Buy original Siemens spare parts in Egypt.' />
                <meta property='og:title' content='DEMAC - Store' />
                <meta property='og:type' content='website' />
                <meta
                    property='og:description'
                    content='Buy original Siemens spare parts in Egypt.'
                />
                <meta property='og:image' content='https:/demac-eg.co/assets/demac_logo.svg' />
            </Head>
            <main className='container-fluid py-5'>
                <StoreFront url={url} categories={categories} products={products} />
            </main>
            <div id='CategoriesPortalOut' />
        </>
    );
}
