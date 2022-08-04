import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import ImageWithFallback from '../components/image_fallback';
import AddToCart from '../components/add_to_cart';

import { Pagination, Card, Row, Col } from 'react-bootstrap';
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { product } from '../utils/types';
import { currencyFormater } from '../utils/constants';



function MyPagination({ pageCount = 0, currentPage = 1, onPageChange = (x: number) => { } }) {
    let items = [];
    for (let i = 1; i <= pageCount; i++) {
        items.push(
            <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>{i}</Pagination.Item>
        );
    }

    if (items.length > 8) {
        // DO NOT TOUCH THIS: pagination splitting logic
        return (
            <Pagination className='align-self-end justify-content-center'>
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {items[0]}
                {!(currentPage - 2 <= 1) && <Pagination.Ellipsis disabled />}
                {items.slice(
                    (currentPage + 2 > pageCount - 1) ? (currentPage + (pageCount - currentPage - 4)) : Math.max(currentPage - 2, 1),
                    (currentPage - 4 < 1) ? (currentPage + (1 - currentPage + 4)) : Math.min(currentPage + 1, pageCount - 1)
                )}

                {!(currentPage + 2 >= pageCount) && <Pagination.Ellipsis disabled />}
                {items[pageCount - 1]}

                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} />
            </Pagination>
        );
    } else {
        return (
            <Pagination className='align-self-end justify-content-center'>
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {items}
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === pageCount} />
            </Pagination>
        );
    }


}

function ProductCard({ product }: { product: product }) {
    return (
        <Col className='mb-3' key={product.part_no}>
            <Card className='card-hover' style={{ textAlign: 'center' }}>
                <Link href={`product/${product.part_no}`} scroll passHref>
                    <a>
                        <div style={{ display: 'inline-block', width: '70%', aspectRatio: '1' }}>
                            <ImageWithFallback className='card-img-top' src={product.img_link} fallbackSrc={'/assets/no_img.svg'} alt={product.name} />
                        </div>
                    </a>
                </Link>
                <Card.Body className='p-3 align-items-end'>
                    <div className='text-center'>
                        <h6 className='card-title truncate fw-bolder' style={{ height: '2.4em' }} data-bs-toggle='tooltip' data-bs-placement='bottom' title={product.name}>
                            <Link href={`product/${product.part_no}`} scroll={true} passHref>
                                <a className=''>{product.img_link}</a>
                            </Link>
                        </h6>
                        <p className='small text-muted text-truncate'><span style={{ borderBottom: '1px dotted gray' }}>{product.part_no}</span></p>
                        <p className='text-primary card-subtitle h6'>{currencyFormater(+product.price)}</p>
                    </div>
                </Card.Body>
                <Card.Footer className='p-4 pt-0 border-top-0 bg-transparent text-center'>
                    <AddToCart id={product.part_no} count={1} />
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default function ProductDisplay({ products }: { products: product[] }) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);


    //resets page to 1 on router change
    useEffect(() => {
        const vw = window.innerWidth;
        if (vw < 576) {
            setItemsPerPage(5);
        } else if (vw <= 576) {
            setItemsPerPage(5);
        } else if (vw <= 768) {
            setItemsPerPage(5);
        } else if (vw <= 992) {
            setItemsPerPage(5);
        } else if (vw <= 1400) {
            setItemsPerPage(8);
        } else {
            setItemsPerPage(12);
        }
        setCurrentPage(1);
    }, [router]);

    let itemsCount = products.length;
    let pages = [];
    for (let i = 1; i <= Math.ceil(itemsCount / itemsPerPage); i++) {
        pages.push(
            <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={6} key={i}>{
                products.slice((i - 1) * itemsPerPage, i * itemsPerPage).map((product) => (
                    <ProductCard key={product.part_no} product={product} />
                ))}
            </Row>
        );
    }


    return (
        pages.length ? (
            <>
                <SwitchTransition mode='out-in'>
                    <CSSTransition
                        key={currentPage}
                        addEndListener={(node, done) => {
                            node.addEventListener("transitionend", done, false);
                        }}
                        classNames="fade"
                    >
                        {pages[currentPage - 1]}
                    </CSSTransition>
                </SwitchTransition>
                <MyPagination pageCount={Math.ceil(itemsCount / itemsPerPage)} currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
            </>
        ) : (
            <div className='d-flex flex-column justify-content-center'>
                <picture className='text-center'>
                    <source srcSet='/assets/no_products.svg' type='image/svg+xml' />
                    <img className='my-5 big-pic' src='/assets/no_products.svg' alt='No products image' />
                </picture>
                <h5 className='mx-auto text-muted'>No products matches your search</h5>
            </div>
        )
    );
}