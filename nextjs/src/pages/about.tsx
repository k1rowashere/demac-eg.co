import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import boilerImage from '../../public/assets/boiler.png';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import { Col, Row, Container, Button, Stack, Breadcrumb } from 'react-bootstrap';
import Header from 'components/Header';


export default function About() {
    return (
        <>
            <Head><title>DEMAC - About</title></Head>
            <Navbar activePage='about' />
            <Header h1='About us' />
            <main className='bg-dark text-white'>
                <Container style={{ minHeight: '70vh' }}>
                    <Row xs={1} lg={2}>
                        <Col xs={{ order: 1 }} lg={{ order: 0 }} className='d-flex flex-column about-p'>
                            <p>
                                Since 2010, we have provided complete engineering solutions in Egypt and the surrounding region.
                                Through our <b>experience</b> and proven <b>technical skills</b>,
                                we strive to attain a leading position among the distinguished providers of industrial automation.
                            </p>
                            <p>
                                We work closely with our clients to fully accomplish their goals and deliver the best solution possible—often ­exceeding customer expectations—while
                                applying the latest innovations
                                and state-of-the-art automation technologies.
                            </p>
                            <p>
                                We deliver <b>customised solutions</b> to industrial sectors with <b>quality</b> adhearing to <b>international standards </b>
                                while offering a competitive price-to-value proposition and delivering in a <b>timely fashion</b>.
                            </p>
                            <Breadcrumb style={{ '--bs-breadcrumb-divider': '"·"' } as React.CSSProperties}>
                                <Breadcrumb.Item href='https://www.facebook.com/demac.company/' target='_blank'><i className='h5 mx-1 bi bi-facebook' /></Breadcrumb.Item>
                                <Breadcrumb.Item href=''><i className='h5 mx-1 bi bi-linkedin' /></Breadcrumb.Item>
                                <Breadcrumb.Item href='https://api.whatsapp.com/send?phone=2001550200608'><i className='h5 mx-1 bi bi-whatsapp' /></Breadcrumb.Item>
                                <Breadcrumb.Item href='mailto:demac@demac-egypt.com'><i className='h5 mx-1 bi bi-envelope-fill' /></Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col className='mt-5 mt-lg-0 d-flex flex-column justify-content-center'>
                            <Image src={boilerImage} style={{ clipPath: 'circle(closest-side at 60% 50%)' }} alt='boiler decorative image' />
                        </Col>
                    </Row>
                    <Stack className='mt-mb-auto mt-5 pb-5' direction='horizontal' gap={4}>
                        <Link href='/projects' passHref>
                            <Button variant='outline-light'>Learn about our Projects</Button>
                        </Link>
                        <Link href='/store' passHref>
                            <Button variant='outline-light'>Go to our Store</Button>
                        </Link>
                    </Stack>
                </Container>

            </main>
            <Footer />
        </>
    );
}