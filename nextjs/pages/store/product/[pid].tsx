import { useRouter } from 'next/router';

import { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Navbar from '../../../components/navigation';
import Footer from '../../../components/footer';
import ImageWithFallback from '../../../components/image_fallback';
import Breadcrumb from '../../../components/breadcrumb';
import AddToCart from '../../../components/add_to_cart';
import CloseButton from 'react-bootstrap/CloseButton';

import dbQuery from '../../../utils/db_fetch';
import { product } from '../../../utils/types';

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
        fallback: false,
    }
}

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
    let { pid } = ctx.params as { pid: string };
    const res = await dbQuery(`
        SELECT path, part_no, name, price, description, img_link, manufacturer_link 
            FROM products 
            WHERE part_no = ?;
    `, [pid]) as product[];
    return {
        props: {
            //fix 'error serializing' bug
            product: { ...res[0] },
            pid,
        }
    };
}


export default function Product(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter();
    return (
        <>
            <Head><title>DEMAC - Products</title></Head>
            <Navbar activePage='store' />
            <section className='container-fluid py-5 bg-light'>
                <div className='px-4 px-lg-5 d-flex align-items-center'>
                    <Link href={'/store' + props.product.path.replace(/(\/[^\/]+)$/, '').replaceAll(/\s/g, '-').toLowerCase()}>
                        <a>
                            <i role='button' className='bi bi-chevron-left mx-2' style={{ WebkitTextStroke: '2px' }} />
                        </a>
                    </Link>
                    <Breadcrumb className='mx-2 mb-0' activePath={props.product.path.split('/').filter(el => { return el != ''; })} pid={props.pid} />
                    <CloseButton className='ms-auto' onClick={() => router.back()} />
                </div>
                <div className='container px-4 px-lg-5 mt-3'>
                    <div className='row gx-4 gx-lg-5 align-items-center'>
                        <div className='col-md-6'>
                            <ImageWithFallback width={'100%'} src={props.product.img_link} fallbackSrc={'/assets/no_img.svg'} alt={props.product.name} />
                        </div>
                        <div className='col-md-6'>
                            <div className='small mb-1'>Part No.: {props.product.part_no}</div>
                            <h1 className='display-5 fw-bolder'>{props.product.name}</h1>
                            <div className='fs-5 mb-5'>
                                <span>{Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP' }).format(+props.product.price)}</span>
                            </div>
                            <p className='text-muted text-truncate' style={{ textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                                <a href={props.product.manufacturer_link}><small>{props.product.manufacturer_link}</small></a>
                            </p>
                            <p className='lead'>{props.product.description}</p>
                            <div className='d-flex'>
                                <AddToCart id={props.product.part_no} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}
