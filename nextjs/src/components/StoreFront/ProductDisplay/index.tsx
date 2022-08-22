import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import ProductCard from './ProductCard';
import Pagination from './Pagination';

import { Row } from 'react-bootstrap';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import type { product } from 'utils/types';

import NoProducts from 'assets/no_products.svg'

import styles from './productDisplay.module.scss'


export default function ProductDisplay({ products }: { products: product[] }) {
    //TODO: Fix double render
    // Due to a bug? with next/router: router.query is unreliable (doesn't get params while using )
    const router = useRouter();
    let page = Number((router.asPath.match(/\?page=((?!0)\d+)/) || [])[1]) || 1;
    page = isNaN(page) ? 1 : page;

    const [currentPage, setCurrentPage] = useState(page);
    const [itemsPerPage, setItemsPerPage] = useState(12);


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



    const itemsCount = products.length;
    const pageCount = Math.ceil(itemsCount / itemsPerPage);
    const pages = useMemo(() => {
        let pages = [];
        for (let i = 1; i <= pageCount; i++) {
            const currProducts = products.slice((i - 1) * itemsPerPage, i * itemsPerPage);
            pages.push(
                <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={6} key={i}>{
                    currProducts.map((product) => (
                        <ProductCard key={product.part_no} product={product} />
                    ))}
                </Row>
            );
        }

        return pages;
    }, [itemsPerPage, pageCount, products])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        router.replace({ query: { url: router.query.url } }, { query: { page: newPage } }, { scroll: false, shallow: true });
    }

    return (
        pages.length ? (
            <>
                <SwitchTransition mode='out-in'>
                    <CSSTransition
                        key={Math.min(currentPage, pageCount)}
                        addEndListener={(node, done) => {
                            node.addEventListener('transitionend', done, false);
                        }}
                        className={styles.wrapper}
                        classNames='fade'
                    >
                        {pages[Math.min(currentPage, pageCount) - 1]}
                    </CSSTransition>
                </SwitchTransition>
                <Pagination pageCount={pageCount} currentPage={Math.min(currentPage, pageCount)} onPageChange={handlePageChange} />
            </>
        ) : (
            <div className='d-flex flex-column justify-content-center'>
                <NoProducts className='my-5 big-pic' />
                <h5 className='mx-auto text-muted'>No product matches your search</h5>
            </div>
        )
    );
}