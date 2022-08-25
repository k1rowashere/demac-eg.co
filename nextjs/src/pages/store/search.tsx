import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { Offcanvas } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Header from 'components/Header';
import Categories from 'components/StoreFront/Categories';
import Footer from 'components/Footer';

import Fuse from 'fuse.js';
import dbQuery from 'utils/db_fetch';
import { pathsToTree } from 'utils/constants';
import type { product } from 'utils/types';
import StoreFront from 'components/StoreFront';

const fuseOptions = {
    minMatchCharLength: 3,
    // includeScore: true,
    // includeMatches: true,
    threshold: 0.5,
    keys: ['part_no', 'name', 'decription']
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let { s } = ctx.query;
    const res2 = await dbQuery('SELECT DISTINCT path FROM products;') as { path: string }[];
    let products: product[] = [];

    if (s && !(s.toString().length < 3)) {
        const query = await dbQuery(`
                SELECT part_no, name, price, img_link, description FROM products
                    WHERE price <> 0;
            `) as product[];
        const fuse = new Fuse(query, fuseOptions);

        products = fuse.search(s.toString()).map((el) => ({ ...el.item }));
    }

    return {
        props: {
            products,
            categories: pathsToTree(res2),
        }
    };
}



export default function Search({ products, categories }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    //turn off offcanvase on router change
    useEffect(() => {
        setShowOffcanvas(false);
    }, [router])


    return (
        <>
            <Head>
                <title>DEMAC - Search</title>
                <meta name="description" content="Buy original Siemens spare parts in Egypt." />
                <meta property="og:title" content="DEMAC - Store" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Buy original Siemens spare parts in Egypt." />
                <meta property="og:image" content="https:/demac-eg.co/assets/demac_logo.svg" />
            </Head>
            <Navbar activePage='store' />
            <Header h1='Welcome to DEMAC store' h2='Buy original Siemens parts in Egypt!' classNames={{ child: 'bg bg-img-2' }} showSeperator />
            <main className='container-fluid py-5 bg-light' style={{ overflow: 'hidden' }}>
                <StoreFront url={['search']} categories={categories} products={products} />
            </main>

            <Footer />

            <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Categories:</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Categories categories={categories} activePath={[]} />
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
