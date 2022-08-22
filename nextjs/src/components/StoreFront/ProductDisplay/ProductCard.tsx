import Link from 'next/link';
import { useMemo } from 'react';
import ImageWithFallback from '../../ImageWithFallback';
import AddToCart from '../../AddToCartButton';
import { Card, Col } from 'react-bootstrap';
import { currencyFormater } from 'utils/constants';
import { product } from 'utils/types';

export default function ProductCard({ product }: { product: product; }) {
    return useMemo(() => <>
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
                        <span className='h6 card-title truncate fw-bolder' style={{ height: '2.4em' }} data-bs-toggle='tooltip' data-bs-placement='bottom' title={product.name}>
                            <Link href={`product/${product.part_no}`} scroll={true} passHref>
                                <a className=''>{product.name}</a>
                            </Link>
                        </span>
                        <p className='small text-muted text-truncate'><span style={{ borderBottom: '1px dotted gray' }}>{product.part_no}</span></p>
                        <p className='text-primary card-subtitle h6'>{currencyFormater(product.price)}</p>
                    </div>
                </Card.Body>
                <Card.Footer className='p-4 pt-0 border-top-0 bg-transparent text-center'>
                    <AddToCart id={product.part_no} />
                </Card.Footer>
            </Card>
        </Col>
    </>, [product]);
}
