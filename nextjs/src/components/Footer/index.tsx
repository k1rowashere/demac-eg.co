import Link from 'next/link'
import Demac from '/public/assets/demac_logo.svg'
import { Breadcrumb, Col, Container, Row } from 'react-bootstrap'

import footer from './footer.module.css'

export default function Footer() {
    return (
        <footer>
            <Container fluid className='pt-4 pb-2 px-4 px-md-5 bg-dark bg bg-img-0 text-white'>
                <Row xs={1} sm={2} md={3} className='justify-content-between'>
                    <Col md={4} lg={3}>
                        <Demac className='mb-3' style={{ height: '1.5em' }} />
                        <Breadcrumb style={{ '--bs-breadcrumb-divider': '"|"' } as React.CSSProperties}>
                            <Link href='/' passHref><Breadcrumb.Item>Home</Breadcrumb.Item></Link>
                            <Link href='/store' passHref><Breadcrumb.Item>Store</Breadcrumb.Item></Link>
                            <Link href='/about' passHref><Breadcrumb.Item>About</Breadcrumb.Item></Link>
                            <Link href='/contact-us' passHref><Breadcrumb.Item>Contact</Breadcrumb.Item></Link>
                        </Breadcrumb>
                        <small className='text-white-50'>demac-egypt.com © 2022</small>
                    </Col>
                    <Col md={3} lg={4} className='d-none d-md-block text-white-50'>
                        <span className='text-white h4'>About Us</span>
                        <p>
                            Established in 2010.
                            We provide complete engineering solutions for industrial automation.
                        </p>
                        <p>
                            In addition, we source orginal Siemens spare parts at reasonable pricing.
                        </p>
                    </Col>
                    <Col as='address' md={5} lg={4} className='mt-sm-0'>
                        <ul className={footer.contact}>
                            <li><a href='https://goo.gl/maps/XWLV5Q1jb4qkRZRJ8' target='_blank' rel="noreferrer"><i className='bi bi-geo-alt-fill me-2' /><p><span>274 Abdel Salam Aref, El Saray</span><br />Alexandria, Egypt</p></a></li>
                            <li><a href='tel:+201099747581' target='_blank' rel="noreferrer"><i className='bi bi-telephone-fill me-2' /><p>+20-10-9974-7581</p></a></li>
                            <li><a href='mailto:demac@demac-egypt.com' target='_blank' rel="noreferrer"><i className='bi bi-envelope-fill me-2' /><p>demac@demac-egypt.com</p></a></li>
                            <Breadcrumb style={{ '--bs-breadcrumb-divider': '"·"' } as React.CSSProperties}>
                                <Breadcrumb.Item href='https://www.facebook.com/demac.company/' target='_blank'><i className='h5 mx-1 bi bi-facebook' /></Breadcrumb.Item>
                                <Breadcrumb.Item href=''><i className='h5 mx-1 bi bi-linkedin' /></Breadcrumb.Item>
                                <Breadcrumb.Item href='https://api.whatsapp.com/send?phone=2001550200608'><i className='h5 mx-1 bi bi-whatsapp' /></Breadcrumb.Item>
                                {/* <Breadcrumb.Item href='mailto:demac@demac-egypt.com'><i className='h5 mx-1 bi bi-envelope-fill' /></Breadcrumb.Item> */}
                            </Breadcrumb>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer >
    )
}