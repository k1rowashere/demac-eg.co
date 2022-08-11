import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { InferGetStaticPropsType } from 'next';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { Button, Card, Col, Form, InputGroup, Offcanvas, Row } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Header from 'components/Header';
import Categories from 'components/Categories';
import StoreFront from 'components/StoreFront';
import Footer from 'components/Footer';

import dbQuery from 'utils/db_fetch';
import { pathsToTree } from 'utils/constants';
import type { categories, product } from 'utils/types';



export const getStaticPaths: GetStaticPaths = async () => {
    const res = await dbQuery('SELECT DISTINCT path FROM products;') as { path: string }[];
    const categoryTree = pathsToTree(res);
    let paths: { params: { url: string[] } }[] = [{ params: { url: [] } }];

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
        fallback: false, // can also be true or 'blocking'
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
        }
    };
}



export default function Store({ products, categories, url }: InferGetStaticPropsType<typeof getStaticProps>) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const router = useRouter();

    //turn off offcanvase on router change
    useEffect(() => {
        setShowOffcanvas(false);
    }, [router])

    return (
        <>
            <Head>
                <title>DEMAC - Store</title>
                <meta name="description" content="Buy original Siemens spare parts in Egypt." />
                <meta property="og:title" content="DEMAC - Store" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Buy original Siemens spare parts in Egypt." />
                <meta property="og:image" content="https:/demac-eg.co/assets/demac_logo.svg" />
            </Head>
            <Navbar activePage='store' />
            <Header h1='Welcome to demac store' h2='Lorem ipsum' classNames={{ child: 'bg bg-img-1' }} />
            <main className='container-fluid py-5 bg-light' style={{ overflow: 'hidden' }}>
                <StoreFront setShowOffcanvas={setShowOffcanvas} url={url} categories={categories} products={products} />
            </main>

            <Footer />

            <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Categories:</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Categories categories={categories} activePath={url} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
