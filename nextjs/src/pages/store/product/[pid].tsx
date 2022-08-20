import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { CloseButton } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';
import ImageWithFallback from 'components/ImageWithFallback';
import Breadcrumb from 'components/StoreFront/Breadcrumb';
import AddToCart from 'components/StoreFront/ProductDisplay/AddToCart';

import dbQuery from 'utils/db_fetch';

import type { product } from 'utils/types';
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';



export const getStaticPaths: GetStaticPaths = async () => {
    const res = await dbQuery(`
        SELECT part_no 
            FROM products 
            WHERE price <> 0;
    `) as { part_no: string }[];

    const paths = res.map((item) => {
        return { params: { pid: item.part_no } }
    })

    return {
        paths,
        fallback: 'blocking',
    }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    let { pid } = ctx.params as { pid: string };
    const res = await dbQuery(`
        SELECT path, part_no, name, price, description, img_link, manufacturer_link 
            FROM products 
            WHERE part_no = ?;
    `, [pid]) as product[];

    if (res.length === 0) {
        return {
            notFound: true,
            props: {
                product: {} as product,
                pid,
                structuredData: {},
            }
        }
    }

    const product = { ...res[0] }

    //JSON LD Schema
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.img_link,
        "description": product.description,
        "brand": {
            "@type": "Brand",
            "name": "Siemens"
        },
        "sku": product.part_no,
        "offers": {
            "@type": "Offer",
            "url": "https://demac-eg.co/store/product/" + pid,
            "priceCurrency": "EGP",
            "price": +product.price,
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    }

    return {
        props: {
            //fix 'error serializing' bug
            product,
            pid,
            structuredData,
        },
        revalidate: 60,
    };
}



export default function Product(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    const { product, pid, structuredData } = props;
    return (
        <>
            <Head>
                <title>{'DEMAC - Products |' + product.name}</title>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />
                <meta name="description" content={`Buy: ${product.name}`} />
                <meta name='robots' content='index, follow' />
                <meta property="og:title" content={`Demac - Products | ${product.name}`} />
                <meta property="og:description" content={`Buy original Siemens spare parts from DEMAC Store!`} />
                <meta property="og:image" content={product.img_link} />
            </Head>
            <Navbar activePage='store' />
            <main className='container-fluid py-5 bg-light'>
                <div className='px-4 px-lg-5 d-flex align-items-center'>
                    <Link href={'/store' + product.path.replace(/(\/[^\/]+)$/, '').replaceAll(/\s/g, '-').toLowerCase()}>
                        <a>
                            <i role='button' className='bi bi-chevron-left mx-2' style={{ WebkitTextStroke: '2px' }} />
                        </a>
                    </Link>
                    <Breadcrumb className='mx-2 mb-0' activePath={product.path.split('/').filter(el => { return el != ''; })} pid={pid} />
                    <CloseButton className='ms-auto' onClick={() => router.back()} />
                </div>
                <div className='container px-4 px-lg-5 mt-3'>
                    <div className='row gx-4 gx-lg-5 align-items-center'>
                        <div className='col-md-6'>
                            <ImageWithFallback width={'100%'} src={product.img_link} fallbackSrc={'/assets/no_img.svg'} alt={product.name} />
                        </div>
                        <div className='col-md-6'>
                            <div className='small mb-1'>Part No.: {product.part_no}</div>
                            <h1 className='display-5 fw-bolder'>{product.name}</h1>
                            <div className='fs-5 mb-5'>
                                <span>{Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(product.price)}</span>
                            </div>
                            <p className='text-muted text-truncate' style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                                <a href={product.manufacturer_link}><small>{product.manufacturer_link}</small></a>
                            </p>
                            <p className='lead'>{product.description}</p>
                            <div className='d-flex'>
                                <AddToCart id={product.part_no} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
