import Link from 'next/link';
import Demac from '/public/assets/demac_logo.svg';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import footer from './footer.module.css';
import demac from 'styles/demac.module.scss';

export default function Footer({ showDivider }: { showDivider?: boolean }) {
    return (
        <footer className={showDivider ? footer.spikes : ''}>
            <Container fluid className='pt-4 pb-2 px-4 px-md-5 bg-dark bg bg-gears text-white'>
                <Row xs={1} sm={2} md={3} className='justify-content-between'>
                    <Col md={4} lg={3} className='mt-1'>
                        <Demac className={demac.wrapper + ' mb-3'} style={{ height: '1.5em' }} />
                        <Breadcrumb
                            style={{ '--bs-breadcrumb-divider': '"|"' } as React.CSSProperties}
                        >
                            <Link href='/' passHref>
                                <Breadcrumb.Item>Home</Breadcrumb.Item>
                            </Link>
                            <Link href='/store' passHref>
                                <Breadcrumb.Item>Store</Breadcrumb.Item>
                            </Link>
                            <Link href='/about' passHref>
                                <Breadcrumb.Item>About</Breadcrumb.Item>
                            </Link>
                            <Link href='/contact-us' passHref>
                                <Breadcrumb.Item>Contact</Breadcrumb.Item>
                            </Link>
                        </Breadcrumb>
                        <small className='text-white-50'>demac-egypt.com © 2022</small>
                    </Col>
                    <Col md={3} lg={4} className='d-none d-lg-block text-white-50'>
                        <span className='text-white h4'>About Us</span>
                        <p>
                            Established in 2010. We provide complete engineering solutions for
                            industrial automation.
                        </p>
                        <p>
                            In addition, we source orginal Siemens spare parts at reasonable
                            pricing.
                        </p>
                    </Col>
                    <Col as='address' md={5} lg={4} className='mt-3 mt-sm-0'>
                        <ul className={footer.contact}>
                            <li>
                                <a
                                    href='https://goo.gl/maps/XWLV5Q1jb4qkRZRJ8'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    <i className='bi bi-geo-alt-fill me-2' />
                                    <p>
                                        <span>274 Abdel Salam Aref, El Saray</span>
                                        <br />
                                        Alexandria, Egypt
                                    </p>
                                </a>
                            </li>
                            <li>
                                <a href='tel:+201099747581' target='_blank' rel='noreferrer'>
                                    <i className='bi bi-telephone-fill me-2' />
                                    <p>+20-10-9974-7581</p>
                                </a>
                            </li>
                            <li>
                                <a
                                    href='mailto:demac@demac-egypt.com'
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    <i className='bi bi-envelope-fill me-2' />
                                    <p>demac@demac-egypt.com</p>
                                </a>
                            </li>
                            <Breadcrumb
                                as='li'
                                style={{ '--bs-breadcrumb-divider': '"·"' } as React.CSSProperties}
                            >
                                <Breadcrumb.Item
                                    href='https://www.facebook.com/demac.company/'
                                    target='_blank'
                                    title='Facebook'
                                >
                                    <i className='h5 mx-1 bi bi-facebook' />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href='' title='linkedIn'>
                                    <i className='h5 mx-1 bi bi-linkedin' />
                                </Breadcrumb.Item>
                                <Breadcrumb.Item
                                    href='https://api.whatsapp.com/send?phone=201099747581'
                                    title='Whatsapp'
                                >
                                    <i className='h5 mx-1 bi bi-whatsapp' />
                                </Breadcrumb.Item>
                                {/* <Breadcrumb.Item href='mailto:demac@demac-egypt.com'><i className='h5 mx-1 bi bi-envelope-fill' /></Breadcrumb.Item> */}
                            </Breadcrumb>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
