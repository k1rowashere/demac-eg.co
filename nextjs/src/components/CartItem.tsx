import Link from 'next/link';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CloseButton from 'react-bootstrap/CloseButton';

import NumField from 'components/NumField';
import ImageWithFallback from 'components/ImageWithFallback';

import { currencyFormater } from 'utils/constants';
import type { products } from '@prisma/client';

type CartItem = {
    product: Pick<products, 'part_no' | 'name' | 'img_link'> & { qty: number; price: number };
    itemCountHandle: (fieldId: string, qty: number) => void;
};

export default function CartItem({ product, itemCountHandle }: CartItem) {
    return (
        <Row className={'mb-3 p-0 p-sm-2 align-items-center'}>
            <Col xs={{ span: 4, order: 0 }} sm={5} md={{ span: 1, order: 0 }} className='p-0'>
                <Link href={`product/${product.part_no}`} scroll={true} passHref>
                    <a>
                        <ImageWithFallback
                            className='img-fluid rounded-3'
                            src={product.img_link}
                            fallbackSrc={'/assets/no_img.svg'}
                            alt={product.name}
                        />
                    </a>
                </Link>
            </Col>
            <Col xs={{ span: 6, order: 1 }} md={{ span: 4, order: 1 }} className='pe-0'>
                <p
                    className='truncate fw-bolder h6'
                    data-bs-toggle='tooltip'
                    data-bs-placement='bottom'
                    title={product.name}
                >
                    <Link href={`product/${product.part_no}`} scroll={true} passHref>
                        <a className=''>{product.name}</a>
                    </Link>
                </p>
                <p className='small text-muted text-truncate'>{product.part_no}</p>
            </Col>
            <Col
                xs={{ span: 4, order: 3 }}
                sm={5}
                md={{ span: 2, order: 2 }}
                className='d-flex justify-content-center'
            >
                <NumField initValue={product.qty} id={product.part_no} onChange={itemCountHandle} />
            </Col>
            <Col
                xs={{ span: 4, order: 4 }}
                sm={{ span: 3, offset: 1 }}
                md={{ span: 2, order: 3, offset: 0 }}
                style={{ overflow: 'scroll' }}
            >
                <span className='text-primary text-truncate'>
                    {currencyFormater(product.price)}
                </span>
            </Col>
            <Col
                xs={{ span: 4, order: 5 }}
                sm={3}
                md={{ span: 2, order: 4 }}
                style={{ overflow: 'scroll' }}
            >
                <b className='text-secondary text-truncate'>
                    {currencyFormater(product.price * (product.qty || 1))}
                </b>
            </Col>
            <Col xs={{ span: 1, order: 2 }} md={{ span: 1, order: 5 }}>
                <CloseButton onClick={() => itemCountHandle(product.part_no, 0)} />
            </Col>
        </Row>
    );
}
