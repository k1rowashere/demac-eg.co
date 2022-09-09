import Head from 'next/head';
import Link from 'next/link';

import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import SearchBtn from 'components/StoreFront/SearchBtn';

import ImageWithFallback from 'components/ImageWithFallback';

Store.layoutProps = {
    navbarProps: { activePage: 'store' },
    headerProps: {
        h1: 'Welcome to DEMAC store',
        h2: 'Buy original Siemens parts in Egypt!',

        showSeperator: true,
    },
} as LayoutProps;

export default function Store() {
    const mainCategories = [
        {
            name: 'Siemens',
            logo: 'https://new.siemens.com/etc.clientlibs/siemens-sites/components/content/header/clientlibs/resources/logo/siemens-logo-default.svg',
            path: '/store/siemens',
            description: 'PLC | HMI | Memory Cards, and more',
        },
    ];
    return (
        <>
            <Head>
                <title>DEMAC - Store</title>
                <meta
                    name='description'
                    content='Buy original Siemens spare parts from DEMAC Store!'
                />
                <meta name='robots' content='index, follow' />
                <meta property='og:title' content='Demac - Products' />
                <meta
                    property='og:description'
                    content='Buy original Siemens spare parts from DEMAC Store!'
                />
                <meta property='og:image' content='https://demac-eg.co/images/logo.png' />
            </Head>

            <main className='py-5'>
                <Container className='mb-5'>
                    <SearchBtn />
                </Container>
                <Container>
                    <Row xs={1} md={2}>
                        {mainCategories.map((category) => (
                            <Col key={category.name} className='mb-3'>
                                <Link href={category.path} prefetch>
                                    <Card
                                        className='w-100 card-hover'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <ImageWithFallback
                                            src={category.logo}
                                            fallbackSrc='/assets/no_image.svg'
                                            alt={category.name}
                                            className='w-100 px-4 my-3'
                                        />
                                        <Card.Body>
                                            <Card.Title>Buy {category.name} Products</Card.Title>
                                            <Card.Text>{category.description}</Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </main>
        </>
    );
}
