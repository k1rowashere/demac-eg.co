import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, withRouter, NextRouter } from 'next/router';

import ProductCard from './ProductCard';
import Pagination from './Pagination';

import { SwitchTransition, Transition } from 'react-transition-group';
import Row from 'react-bootstrap/Row';

import NoProducts from 'assets/no_products.svg';

import type { Products } from './ProductCard';

function ProductDisplay({ products }: { products: Products[] }) {
    const nodeRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);

    // get page from url
    useEffect(() => {
        let page = Number((router.asPath.match(/\?page=((?!0)\d+)/) || [])[1]) || 1;
        page = isNaN(page) ? 1 : page;
        setCurrentPage(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Event Listener for window resise to calc number of items per page
    useEffect(() => {
        const getItemsPerPage = () => {
            const vw = window.innerWidth;
            if (vw < 576) return 5;
            else if (vw <= 576) return 5;
            else if (vw <= 768) return 5;
            else if (vw <= 992) return 5;
            else if (vw <= 1400) return 8;
            else return 12;
        };

        setItemsPerPage(getItemsPerPage());
        window.addEventListener('resize', () => setItemsPerPage(getItemsPerPage()));
        return () => window.removeEventListener('resize', () => setItemsPerPage(getItemsPerPage()));
    }, []);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.push(
            { query: { url: router.query.url } },
            { query: { page: newPage } },
            { scroll: false, shallow: true }
        );
    };

    const itemsCount = products.length;
    const pageCount = Math.ceil(itemsCount / itemsPerPage);
    const pages = useMemo(() => {
        let pages = [];
        for (let i = 1; i <= pageCount; i++) {
            const currProducts = products.slice((i - 1) * itemsPerPage, i * itemsPerPage);
            pages.push(
                currProducts.map((product, index) => (
                    // gives priority to first product image to improve lcp score
                    <ProductCard key={product.part_no} product={product} priority={index === 0} />
                ))
            );
        }
        return pages;
    }, [itemsPerPage, pageCount, products]);

    const timeout = 150;
    const defaultStyle = {
        transition: `opacity ${timeout}ms ease-in-out`,
        opacity: 0.5,
    };
    const transitionStyles = {
        entering: { opacity: 1 },
        entered: { opacity: 1 },
        exiting: { opacity: 0.5 },
        exited: { opacity: 0.5 },
        unmounted: { opacity: 0.5 },
    };
    const rowSize = { xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 6 };
    return pages.length ? (
        <>
            <SwitchTransition mode='out-in'>
                <Transition
                    nodeRef={nodeRef}
                    key={Math.min(currentPage, pageCount)}
                    timeout={timeout}
                    unmountOnExit
                >
                    {(styles) => (
                        <Row
                            {...rowSize}
                            ref={nodeRef}
                            style={{ ...defaultStyle, ...transitionStyles[styles] }}
                        >
                            {pages[Math.min(currentPage, pageCount) - 1]}
                        </Row>
                    )}
                </Transition>
            </SwitchTransition>
            <Pagination
                pageCount={pageCount}
                currentPage={Math.min(currentPage, pageCount)}
                onPageChange={handlePageChange}
            />
        </>
    ) : (
        <div
            className='d-flex flex-column justify-content-center h-100'
            style={{ background: 'radial-gradient(circle, #fff 0%, #ffffff00 100%)' }}
        >
            <NoProducts className='my-5 big-pic' />
            <h5 className='mx-auto text-muted'>No product matches your search</h5>
        </div>
    );
}

export default ProductDisplay;
