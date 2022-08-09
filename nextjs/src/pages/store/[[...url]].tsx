import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Head from 'next/head';

import { Button, Card, Col, Offcanvas, Row } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Header from 'components/Header';
import Breadcrumb from 'components/Breadcrumb';
import Categories from 'components/Categories';
import ProductDisplay from 'components/ProductDisplay';
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
            <Header h1='Welcome to demac store' h2='Lorem ipsum' classNames={{ child: 'bg bg-img-1' }} />
            <main className='container-fluid py-5 bg-light' style={{ overflow: 'hidden' }}>
                <div className='px-4 px-lg-5 d-flex'>
                    <Button variant='outline-dark' className='d-block d-xl-none' onClick={() => setShowOffcanvas(true)}>
                        <i className='bi bi-funnel-fill' />
                    </Button>
                    <Breadcrumb className='mx-2 my-auto' activePath={url} />
                </div>
                <Row className='px-4 px-lg-5 mt-3'>
                    <Card id='categories' className='col-2 d-none d-xl-block p-0 mb-3'>
                        <Card.Body className='py-3 px-1'>
                            <Card.Title><h3 className='p-2 px-3'>Categories:</h3></Card.Title>
                            <Categories categories={categories} activePath={url} />
                        </Card.Body>
                    </Card>
                    <Col id='offers' style={{ minHeight: '75vh' }}>
                        <ProductDisplay products={products} />
                    </Col>
                </Row>
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
