import Link from 'next/link';
import React from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

export default function _Breadcrumb(props: {activePath: string[], pid?: string, [x: string]: any}) {
    const { activePath, pid, ...rest } = props;
    return (
        <Breadcrumb listProps={{className: 'my-auto', style:{'--bs-breadcrumb-item-padding-x': '0.3rem'} as React.CSSProperties}} {...rest}>
            <Link href='/store' scroll={false} passHref><Breadcrumb.Item className='h4' key='store'>STORE</Breadcrumb.Item></Link>
            {activePath.map((page, index) => {
                return (
                    <Link href={`/store/${activePath.slice(0, index + 1).join('/')}`} key={page} passHref>
                        <Breadcrumb.Item className='h4'>
                            {page.replaceAll('-', ' ').toUpperCase()}
                        </Breadcrumb.Item>
                    </Link>
                );
            })}
            {pid ? <Breadcrumb.Item className='h4' key={pid}>{pid}</Breadcrumb.Item> : <></>}
        </Breadcrumb >
    );
}