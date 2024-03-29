import Link from 'next/link';
import ImageWithFallback from 'components/ImageWithFallback';
import AddToCart from 'components/AddToCartButton';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { currencyFormater } from 'utils/constants';
import type { products } from '@prisma/client';

export type Products = Pick<products, 'part_no' | 'name' | 'img_link'> & { price: number };

type Props = {
    product: Products;
    priority?: boolean;
};

export default function ProductCard({ product, priority }: Props) {
    return (
        <>
            <Col className='mb-3' key={product.part_no}>
                <Card className='card-hover' style={{ textAlign: 'center' }}>
                    <Link href={`product/${product.part_no}`} scroll passHref>
                        <a>
                            <div
                                style={{
                                    display: 'inline-block',
                                    width: '70%',
                                    aspectRatio: '1',
                                }}
                            >
                                <ImageWithFallback
                                    priority={priority}
                                    className='card-img-top'
                                    src={product.img_link}
                                    fallbackSrc={'/assets/no_img.svg'}
                                    alt={product.name}
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </div>
                        </a>
                    </Link>
                    <Card.Body className='p-3 align-items-end'>
                        <div className='text-center'>
                            <span
                                className='h6 card-title truncate fw-bolder'
                                style={{ height: '2.4em' }}
                                data-bs-toggle='tooltip'
                                data-bs-placement='bottom'
                                title={product.name}
                            >
                                <Link href={`product/${product.part_no}`} scroll={true} passHref>
                                    <a className=''>{product.name}</a>
                                </Link>
                            </span>
                            <p className='small text-muted text-truncate'>
                                <span style={{ borderBottom: '1px dotted gray' }}>
                                    {product.part_no}
                                </span>
                            </p>
                            <p className='text-primary card-subtitle h6'>
                                {currencyFormater(product.price)}
                            </p>
                        </div>
                    </Card.Body>
                    <Card.Footer className='p-4 pt-0 border-top-0 bg-transparent text-center'>
                        <AddToCart id={product.part_no} />
                    </Card.Footer>
                </Card>
            </Col>
        </>
    );
}
