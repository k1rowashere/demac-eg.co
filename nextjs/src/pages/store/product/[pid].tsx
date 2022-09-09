import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';

import ImageWithFallback from 'components/ImageWithFallback';
import Breadcrumb from 'components/StoreFront/Breadcrumb';
import AddToCart from 'components/AddToCartButton';

import type { GetStaticPaths, GetStaticPropsContext } from 'next';
import type InferGetStaticPropsType from 'infer-next-props-type';

import { currencyFormater } from 'utils/constants';
import { prisma } from 'utils/prisma';

export const getStaticPaths: GetStaticPaths = async () => {
    const partNumberList = await prisma.products.findMany({
        where: {
            price: {
                not: 0,
            },
        },
        select: {
            part_no: true,
        },
    });

    const paths = partNumberList.map((item) => {
        return { params: { pid: item.part_no } };
    });

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    const { pid } = ctx.params as { pid: string };

    // get product from db
    const _product = await prisma.products.findUnique({ where: { part_no: pid } });

    // if product not found, redirect to 404
    if (!_product) return { notFound: true };

    // convert decimal to number in products to fix serialization error
    const product = { ..._product, price: Number(_product.price) };

    //JSON LD Schema
    const structuredData = JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: _product.name,
        image: _product.img_link,
        description: _product.description,
        brand: {
            '@type': 'Brand',
            name: 'Siemens',
        },
        sku: _product.part_no,
        offers: {
            '@type': 'Offer',
            url: 'https://demac-eg.co/store/product/' + pid,
            priceCurrency: 'EGP',
            price: +_product.price,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    });

    return {
        props: { product, pid, structuredData },
        revalidate: 60,
    };
};

Product.layoutProps = {
    navbarProps: { activePage: 'store' },
    headerProps: { showSeperator: true },
} as LayoutProps;

export default function Product(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const { product, pid, structuredData } = props;
    return (
        <>
            <Head>
                <title>{'DEMAC - Products |' + product.name}</title>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: structuredData }}
                />
                <meta name='description' content={`Buy: ${product.name}`} />
                <meta name='robots' content='index, follow' />
                <meta property='og:title' content={`Demac - Products | ${product.name}`} />
                <meta
                    property='og:description'
                    content={`Buy original Siemens spare parts from DEMAC Store!`}
                />
                <meta property='og:image' content={product.img_link} />
            </Head>
            <main className='py-5'>
                <Card className='container py-5 px-lg-5 mt-3'>
                    <div className='d-flex align-items-center'>
                        <Link
                            href={
                                '/store' +
                                product.path
                                    .replace(/(\/[^\/]+)$/, '')
                                    .replaceAll(/\s/g, '-')
                                    .toLowerCase()
                            }
                        >
                            <a>
                                <i
                                    role='button'
                                    className='bi bi-chevron-left mx-2'
                                    style={{ WebkitTextStroke: '2px' }}
                                />
                            </a>
                        </Link>
                        <Breadcrumb
                            className='mx-2 mb-0'
                            activePath={product.path.split('/').filter((el) => {
                                return el != '';
                            })}
                            pid={pid}
                        />
                        <CloseButton className='ms-auto' onClick={() => router.back()} />
                    </div>
                    <Card.Body>
                        <Row className='gx-4 gx-lg-5 align-items-center'>
                            <Col>
                                <ImageWithFallback
                                    priority
                                    src={product.img_link}
                                    fallbackSrc={'/assets/no_img.svg'}
                                    alt={product.name}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Col>
                            <Col>
                                <small className='mb-1'>Part No.: {product.part_no}</small>
                                <h1 className='display-5 fw-bolder'>{product.name}</h1>
                                <div className='fs-5 mb-5'>
                                    <span>{currencyFormater(product.price)}</span>
                                </div>
                                <p
                                    className='text-muted text-truncate'
                                    style={{
                                        textDecoration: 'underline',
                                        textDecorationStyle: 'dotted',
                                    }}
                                >
                                    <a href={product.manufacturer_link}>
                                        <small>{product.manufacturer_link}</small>
                                    </a>
                                </p>
                                <p className='lead'>{product.description}</p>
                                <AddToCart id={product.part_no} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </main>
        </>
    );
}
