import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { ParsedUrlQuery } from 'querystring';

import Head from 'next/head';


import Navbar from 'components/Navbar';
import Header from 'components/Header';
import StoreFront from 'components/StoreFront';
import Footer from 'components/Footer';

import dbQuery from 'utils/db_fetch';
import { pathsToTree } from 'utils/constants';
import type { categories, product } from 'utils/types';



export const getStaticPaths: GetStaticPaths = async () => {
    const res = await dbQuery('SELECT DISTINCT path FROM products;') as { path: string }[];
    const categoryTree = pathsToTree(res);
    let paths: { params: ParsedUrlQuery }[] = [{ params: { url: [] } }];

    function getAllPaths(categoryTree: categories, currPath: string[] = []) {
        if (!categoryTree) return;
        for (let [key, value] of Object.entries(categoryTree)) {
            const newPath = currPath.concat(key.replaceAll(/\s/g, '-').toLowerCase());
            paths.push({ params: { url: newPath } });
            getAllPaths(value, newPath);
        }
    }

    getAllPaths(categoryTree);
    
    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    let { url = [] } = ctx.params as { url: string[] };
    let pathStr = `/${url.length ? url.join('/').replaceAll('-', ' ') + '/' : ''}%`;
    const res1 = await dbQuery(`
            SELECT part_no, name, price, img_link FROM products
                WHERE UPPER(path) LIKE UPPER(?)
                    AND price <> 0;
        `, [pathStr]) as product[];
    const res2 = await dbQuery('SELECT DISTINCT path FROM products;') as { path: string }[];


    return {
        props: {
            //fix 'error serializing' bug
            products: res1.map((result) => ({ ...result })),
            categories: pathsToTree(res2),
            url,
        },
        revalidate: 60,
    };
}



export default function Store({ products, categories, url }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>DEMAC - Store</title>
                <meta name='description' content='Buy original Siemens spare parts in Egypt.' />
                <meta property='og:title' content='DEMAC - Store' />
                <meta property='og:type' content='website' />
                <meta property='og:description' content='Buy original Siemens spare parts in Egypt.' />
                <meta property='og:image' content='https:/demac-eg.co/assets/demac_logo.svg' />
            </Head>
            <Navbar activePage='store' />
            <Header h1='Welcome to DEMAC store' h2='Buy original Siemens parts in Egypt!' classNames={{ child: 'bg bg-img-2' }} />
            <main className='container-fluid py-5 bg-light' style={{ overflow: 'hidden' }}>
                <StoreFront url={url} categories={categories} products={products} />
            </main>
            <div id='CategoriesPortalOut' />
            <Footer />
        </>
    );
}
