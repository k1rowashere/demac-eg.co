import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/future/image';
import ImageInCircle from 'assets/touch-screen.png';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Card from 'react-bootstrap/Card';

About.layoutProps = {
    className: 'bg-home-gradient bg bg-triangles text-white',
    navbarProps: { activePage: 'about', bg: 'nah' },
    headerProps: {
        h1: 'About us',
        classNames: { parent: '' },
        showSeperator: false,
    },
} as LayoutProps;

export default function About() {
    return (
        <>
            <Head>
                <title>DEMAC - About</title>
                <meta
                    name='description'
                    content='Since 2010, we have provided complete engineering solutions in Egypt and the surrounding region.'
                />
                <meta name='robots' content='index, follow' />
                <meta property='og:title' content='DEMAC - About' />
                <meta property='og:type' content='website' />
                <meta
                    property='og:description'
                    content='Since 2010, we have provided complete engineering solutions in Egypt and the surrounding region.'
                />
                <meta property='og:image' content='https:/demac-eg.co/assets/demac_logo.svg' />
            </Head>
            <main className='pb-5'>
                <Container>
                    <Row xs={1} lg={2}>
                        <Col
                            xs={{ order: 1 }}
                            lg={{ order: 0 }}
                            className='d-flex flex-column about-p'
                        >
                            <AboutCard />
                        </Col>
                        <Col className='mt-5 mt-lg-0 d-flex flex-column justify-content-start'>
                            <Image
                                src={ImageInCircle}
                                className='about-img'
                                alt='boiler decorative image'
                            />
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
}

function AboutCard() {
    return (
        <Card className='bg-glass'>
            <Card.Body className='indent'>
                <p className='dropcap'>
                    Since 2010, we have been providing complete engineering solutions in Egypt and
                    the surrounding region. Through our <b>experience</b> and proven{' '}
                    <b>technical skills</b>, we strive to attain a leading position among the
                    distinguished providers of industrial automation.
                </p>
                <p>
                    We work closely with our clients to fully accomplish their goals and deliver the
                    best solution possible—often ­exceeding customer expectations—while applying the
                    latest innovations and state-of-the-art automation technologies.
                </p>
                <p>
                    We deliver <b>customised solutions</b> to industrial sectors with <b>quality</b>{' '}
                    adhearing to <b>international standards </b>
                    while offering a competitive price-to-value proposition and delivering in a{' '}
                    <b>timely fashion</b>.
                </p>
                <Breadcrumb
                    style={
                        {
                            '--bs-breadcrumb-divider': '"·"',
                        } as React.CSSProperties
                    }
                >
                    <Breadcrumb.Item
                        href='https://www.facebook.com/demac.company/'
                        target='_blank'
                        title='facebook'
                    >
                        <i className='h5 mx-1 bi bi-facebook' />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href='' title='linkedin'>
                        <i className='h5 mx-1 bi bi-linkedin' />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item
                        href='https://api.whatsapp.com/send?phone=201099747581'
                        title='whatsapp'
                    >
                        <i className='h5 mx-1 bi bi-whatsapp' />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href='mailto:demac@demac-egypt.com' title='email'>
                        <i className='h5 mx-1 bi bi-envelope-fill' />
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Stack className='mt-mb-auto mt-5 pb-5' direction='horizontal' gap={4}>
                    <Link href='/projects' passHref>
                        <Button variant='outline-light'>Learn about our Projects</Button>
                    </Link>
                    <Link href='/store' passHref>
                        <Button variant='outline-light'>Go to our Store</Button>
                    </Link>
                </Stack>
            </Card.Body>
        </Card>
    );
}
