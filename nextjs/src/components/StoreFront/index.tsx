import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Card, Col, Form, InputGroup, Offcanvas, Row } from 'react-bootstrap';

import Breadcrumb from './Breadcrumb';
import ProductDisplay from './ProductDisplay';
import Categories from 'components/StoreFront/Categories';
import { categories, product } from 'utils/types';


type StoreFront = {
    url: string[],
    categories: categories,
    products: product[],
}

export default function StoreFront({ url, categories, products }: StoreFront) {
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const router = useRouter();
    const Categories_ = <Categories categories={categories} activePath={url} />;
    const searchRef = useRef<HTMLInputElement>(null);
    const handleSearch = () => {
        if (!searchRef.current?.value) return;
        router.push({
            pathname: '/store/search',
            query: {
                s: (searchRef.current?.value || ''),
            }
        }, undefined, { scroll: false });
    }
    const handleSearchEnter = (e: React.KeyboardEvent<Element>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        handleSearch();
    }

    // turn off offcanvase on router change
    useEffect(() => {
        setShowOffcanvas(false);
    }, [url])

    return <>
        <Row xs={1} lg={2} className='px-4 px-lg-5'>
            <Col lg={9} className='d-flex'>
                <Button variant='outline-dark' className='d-block d-xl-none' onClick={() => { setShowOffcanvas(true) }} title='categories menu'>
                    <i className='bi bi-funnel-fill' />
                </Button>
                <Breadcrumb className='mx-2 my-auto' activePath={url} />
            </Col>
            <Col lg={3} className='mt-3 mt-lg-0 d-flex'>
                <Form className='my-auto flex-grow-1'>
                    <InputGroup>
                        <Button variant='success' id='search' title='search' onClick={handleSearch}>
                            <i className='bi bi-search' />
                        </Button>
                        <Form.Control
                            ref={searchRef}
                            defaultValue={router.query.s || ''}
                            aria-label='search'
                            aria-describedby='search'
                            type='search'
                            placeholder='Search'
                            onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                            onKeyDown={handleSearchEnter}
                        />
                    </InputGroup>
                </Form>
            </Col>
        </Row>
        <Row className='px-4 px-lg-5 mt-4'>
            <Card id='categories' className='col-2 d-none d-xl-block p-0 mb-3'>
                <Card.Body className='py-3 px-1'>
                    <Card.Title><h3 className='p-2 px-3'>Categories:</h3></Card.Title>
                    {Categories_}
                </Card.Body>
            </Card>
            <Col className='d-flex flex-column' id='offers' style={{ minHeight: '100vh' }}>
                <ProductDisplay key={url.toString()} products={products} />
            </Col>
        </Row>
        <Offcanvas id='Offcanvas' show={showOffcanvas} onHide={() => { setShowOffcanvas(false) }} >
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Categories:</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>{Categories_}</Offcanvas.Body>
        </Offcanvas>
    </>;
}
