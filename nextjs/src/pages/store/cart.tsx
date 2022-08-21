import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Card, Container, Button, Row, Col } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Header from 'components/Header';
import Footer from 'components/Footer';
import CheckoutForm from 'components/Checkout/CheckoutContainer';

import dbQuery from 'utils/db_fetch';
import { currencyFormater } from 'utils/constants';
import { appendCart, getCart } from 'utils/cart';

import type { product } from 'utils/types';
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import CartItem from 'components/CartItem';

import EmptyCart from 'assets/empty_cart.svg';

const SHIPPING_COST = 150;
const VAT_PERCENT = 0.14;


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const cartCount = getCart(ctx);
    let cartItems: product[] = [];

    if (Object.keys(cartCount).length) {
        const cartKeys = Object.keys(cartCount);
        const res = (await dbQuery(`
        SELECT part_no, name, price, img_link FROM products
        WHERE part_no IN (${cartKeys.map(() => { return '?' })})
        AND price <> 0;
        `, cartKeys) as product[])
        cartItems = res.map((result) => ({ ...result, count: cartCount[result.part_no] }));
    }
    return { props: { cartItems } };

}



export default function Cart(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter();
    const [cartItems, setCartItems] = useState(props.cartItems);
    const [showCheckout, setShowCheckout] = useState(false);

    const subTotal = (() => {
        let sub = 0;
        cartItems.forEach((product) => sub += product.price * (product.count ?? 0));
        return sub;
    })();

    const vat = subTotal * VAT_PERCENT;
    const total = subTotal + vat + SHIPPING_COST;

    const itemCountHandle = useCallback((fieldId: string, count: number) => {
        setCartItems(currCartItems => {
            if (!count) {
                appendCart(fieldId, 0)
                return currCartItems.filter((product) => product.part_no !== fieldId)
            } else {
                return currCartItems.map(item => {
                    return (item.part_no === fieldId) ? { ...item, count: appendCart(fieldId, count) } : item;
                })
            }
        });
    }, [])

    return (
        <>
            <Head>
                <title>DEMAC - Cart</title>
                <meta name='robots' content='noindex' />
            </Head>
            <Navbar activePage='cart' />
            <Header h1='Shopping cart' h2='Lorem ipsum' />
            <main className='py-5 bg-light'>
                <Container fluid='lg'>
                    <Card>
                        <Card.Header className='no-print bg-white py-4 d-flex align-items-center'>
                            <i role='button' className='bi bi-chevron-left mx-2 no-print' style={{ WebkitTextStroke: '2px' }} onClick={() => router.back()} />
                            <h3 className='mx-2 mb-0'>Your items</h3>
                            <strong className='text-muted ms-auto me-4 mb-0'>{cartItems.length || 'No'}&nbsp;item{cartItems.length === 1 ? '' : 's'}</strong>
                        </Card.Header>
                        <Card.Body className='mx-4' style={{ height: cartItems.length ? '100%' : '70vh', overflow: 'scroll' }}>
                            {cartItems.length ? (
                                <>
                                    <Row className='d-none d-md-flex p-0 p-sm-2 justify-content-md-between align-items-center'>
                                        <Col md={{ span: 4, offset: 1 }}>
                                            <span className='h6'>Item Name</span>
                                        </Col>
                                        <Col md={{ span: 2 }} className='text-center'>
                                            <span className='h6'>Qty</span>
                                        </Col>
                                        <Col md={{ span: 2 }}>
                                            <span className='h6'>Price</span>
                                        </Col>
                                        <Col md={{ span: 3 }}>
                                            <span className='h6'>Subtotal</span>
                                        </Col>
                                    </Row>
                                    {cartItems.map((product) => <CartItem key={product.part_no} product={product} itemCountHandle={itemCountHandle} />)}
                                </>
                            ) : (
                                <div className='d-flex flex-column justify-content-center'>
                                    <EmptyCart className='my-5 big-pic' alt='Empty cart picture' />
                                    <strong className='h5 mx-auto text-muted'>Your cart is empty</strong>
                                </div>

                            )}
                        </Card.Body>
                        {Boolean(cartItems.length) && (
                            <Card.Footer className='bg-white py-3'>
                                <Container className='px-5'>
                                    <div className='d-flex'>
                                        <p className='fw-bold mb-0'>Sub total:</p>
                                        <div className='dotted-between ' />
                                        <p className='fw-bold mb-0'>{currencyFormater(subTotal)}</p>
                                    </div>
                                    <div className='d-flex'>
                                        <p className='fw-bold mb-0'>VAT (14%):</p>
                                        <div className='dotted-between ' />
                                        <p className='fw-bold mb-0'>{currencyFormater(vat)}</p>
                                    </div>
                                    <div className='d-flex'>
                                        <p className='fw-bold mb-0'>Shipping:</p>
                                        <div className='dotted-between ' />
                                        <p className='fw-bold mb-0'>{currencyFormater(SHIPPING_COST)}</p>
                                    </div>
                                    <div className='d-flex my-3'>
                                        <strong className='fw-bold mb-0 h3'>Total:</strong>
                                        <div className='dotted-between ' />
                                        <strong className='fw-bold mb-0 h3'>{currencyFormater(total)}</strong>
                                    </div>
                                </Container>
                                <div className='no-print float-md-end d-grid gap-2 d-md-block'>
                                    <Link href='/store' passHref>
                                        <Button variant='outline-dark' size='lg' className='mx-2'>Continue Shopping</Button>
                                    </Link>
                                    <Button variant='primary' size='lg' className='mx-2' onClick={() => setShowCheckout(true)}>Proceed To Checkout</Button>
                                </div>
                            </Card.Footer>
                        )}
                    </Card>
                </Container>
            </main>
            <Footer />

            <CheckoutForm show={showCheckout} setShow={setShowCheckout} />
        </>
    );
}