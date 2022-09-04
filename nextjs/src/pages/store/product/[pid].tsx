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

import dbQuery from 'utils/db_fetch';

import type { product } from 'utils/types';
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import { currencyFormater } from 'utils/constants';

export const getStaticPaths: GetStaticPaths = async () => {
    const res = (await dbQuery(`
        SELECT part_no 
            FROM products 
            WHERE price <> 0;
    `)) as { part_no: string }[];

    const paths = res.map((item) => {
        return { params: { pid: item.part_no } };
    });

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    let { pid } = ctx.params as { pid: string };
    const res = (await dbQuery(
        `
        SELECT path, part_no, name, price, description, img_link, manufacturer_link 
            FROM products 
            WHERE part_no = ?;
    `,
        [pid]
    )) as product[];

    if (res.length === 0) {
        return {
            notFound: true,
            props: {
                product: {} as product,
                pid,
                structuredData: {},
            },
        };
    }

    const product = { ...res[0] };

    //JSON LD Schema
    const structuredData = {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: product.img_link,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'Siemens',
        },
        sku: product.part_no,
        offers: {
            '@type': 'Offer',
            url: 'https://demac-eg.co/store/product/' + pid,
            priceCurrency: 'EGP',
            price: +product.price,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
        },
    };

    return {
        props: {
            //fix 'error serializing' bug
            product,
            pid,
            structuredData,
        },
        revalidate: 60,
    };
};

Product.layoutProps = {
    navbarProps: { activePage: 'store' },
    headerProps: { showSeperator: true },
} as LayoutProps;

export default function Product(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const {
        product: { path, part_no, name, description, price, img_link, manufacturer_link },
        pid,
        structuredData,
    } = props;
    return (
        <>
            <Head>
                <title>{'DEMAC - Products |' + name}</title>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <meta name='description' content={`Buy: ${name}`} />
                <meta name='robots' content='index, follow' />
                <meta property='og:title' content={`Demac - Products | ${name}`} />
                <meta
                    property='og:description'
                    content={`Buy original Siemens spare parts from DEMAC Store!`}
                />
                <meta property='og:image' content={img_link} />
            </Head>
            <main className='py-5'>
                <Card className='container py-5 px-lg-5 mt-3'>
                    <div className='d-flex align-items-center'>
                        <Link
                            href={
                                '/store' +
                                path
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
                            activePath={path.split('/').filter((el) => {
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
                                    src={img_link}
                                    fallbackSrc={'/assets/no_img.svg'}
                                    alt={name}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Col>
                            <Col>
                                <small className='mb-1'>Part No.: {part_no}</small>
                                <h1 className='display-5 fw-bolder'>{name}</h1>
                                <div className='fs-5 mb-5'>
                                    <span>{currencyFormater(price)}</span>
                                </div>
                                <p
                                    className='text-muted text-truncate'
                                    style={{
                                        textDecoration: 'underline',
                                        textDecorationStyle: 'dotted',
                                    }}
                                >
                                    <a href={manufacturer_link}>
                                        <small>{manufacturer_link}</small>
                                    </a>
                                </p>
                                <p className='lead'>{description}</p>
                                <AddToCart id={part_no} />
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </main>
        </>
    );
}
