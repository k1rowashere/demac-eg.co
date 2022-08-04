import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';
import { InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import {Button, Offcanvas} from 'react-bootstrap';

import Navbar from '../../components/navigation';
import Footer from '../../components/footer';
import ProductDisplay from '../../components/product_display';
import Categories from '../../components/categories';
import Breadcrumb from '../../components/breadcrumb';

import dbQuery from '../../utils/db_fetch';
import { pathsToTree } from '../../utils/constants';
import type { categories, product } from '../../utils/types';

export const getStaticPaths: GetStaticPaths = async() => {
    const res = await dbQuery('SELECT DISTINCT path FROM products;') as {path: string}[];
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
    const res2 = await dbQuery('SELECT DISTINCT path FROM products;') as {path: string}[];


    return {
        props: {
            //fix 'error serializing' bug
            products: res1.map((result) => ({ ...result })),
            categories: pathsToTree(res2),
            url,
        }
    };
}

export default function Store({products, categories, url}: InferGetStaticPropsType<typeof getStaticProps> ) {
    const router = useRouter();
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    //turn off offcanvase on router change
    useEffect(() => {
        setShowOffcanvas(false);
    }, [router])

    return (
        <>
            <Head><title>DEMAC - Store</title></Head>
            <Navbar activePage='store' />

            <header className='bg-dark'>
                <div className='py-3 bg bg-img-1'>
                    <div className='container px-4 px-lg-5 my-5'>
                        <div className='text-white'>
                            <h1 className='display-4 fw-bolder'>Welcome To DEMAC Store</h1>
                            <h2 className='lead fw-normal text-white-50 mb-0'>Lorem ipsum</h2>
                        </div>
                    </div>
                </div>
            </header>

            <section className='container-fluid py-5 bg-light' style={{ overflow: 'hidden' }}>
                <div className='px-4 px-lg-5 d-flex'>
                    <Button variant='outline-dark' className='d-block d-xl-none' onClick={() => setShowOffcanvas(true)}>
                        <i className='bi bi-funnel-fill' />
                    </Button>
                    <Breadcrumb className='mx-2 my-auto' activePath={url} />
                </div>
                <div className='row px-4 px-lg-5 mt-3'>
                    <div id='categories' className='card col-2 d-none d-xl-block p-0 mb-3'>
                        <div className='py-3 px-1'>
                            <div className='card-body p-0'>
                                <h3 className='card-title p-2 px-3'>Categories:</h3>
                                <Categories categories={categories} activePath={url} />
                            </div>
                        </div>
                    </div>
                    <div id='offers' className='col' style={{ minHeight: '75vh' }}>
                        <ProductDisplay products={products} />
                    </div>
                </div>
            </section>

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
