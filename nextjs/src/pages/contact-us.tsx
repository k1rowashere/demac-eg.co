import Head from 'next/head';

import { useForm } from 'react-hook-form';

import { Container, Col, Row, Card, Form } from 'react-bootstrap';

import Navbar from 'components/Navbar';
import Header from 'components/Header';
import Footer from 'components/Footer';
import ContactForm from 'components/Checkout/ContactForm';

import type { contactInfo } from 'utils/types';
import { InferGetStaticPropsType } from 'next';

export const getStaticProps = async () => {
    return {
        props: {
            sitekey: process.env.RECAPTCHA_SITE_KEY ?? ''
        }
    }
}

export default function Contact({ sitekey }: InferGetStaticPropsType<typeof getStaticProps>) {
    const form = useForm<contactInfo>();

    return (
        <>
            <Head>
                <title>DEMAC - Constact Us</title>
                <meta name="description" content="Leave us a message demac@demac-egypt.com or call us: +20 1099 747 581" />
                <meta name='robots' content='index, follow' />
                <meta property="og:title" content="DEMAC - Contact Us" />
                <meta property="og:type" content="website" />
                <meta property="og:description" content="Leave us a message demac@demac-egypt.com or call us: +20 1099 747 581" />
                <meta property="og:image" content="https:/demac-eg.co/assets/demac_logo.svg" />
            </Head>
            <Navbar activePage='contact_us' />
            <Header h1='Contact Us' h2='Leave us a message and we will get intouch as soon as possible.' />
            <main className='py-5 bg-light'>
                <Container fluid='lg'>
                    <Card>
                        <Card.Body>
                            <Row xs={1} md={2}>
                                <Col className='d-flex flex-column mb-sm-3'>
                                    <span>
                                        <h3>Send us a message</h3>
                                        <hr />
                                    </span>
                                    <Form.Control
                                        as="textarea"
                                        placeholder='Type your message here, or leave blank.'
                                        rows={8}
                                        maxLength={500}
                                        style={{ resize: 'none' }}
                                        {...form.register('message')}
                                    />
                                    <span className='text-end'>{`${form.watch('message')?.length || 0}/500 characters`}</span>
                                    <picture className='d-none d-md-block text-center my-auto'>
                                        <source srcSet='/assets/paper_plane.svg' type='image/svg+xml' />
                                        <img src='/assets/paper_plane.svg' alt='' style={{ opacity: '0.5' }} />
                                    </picture>
                                </Col>
                                <Col>
                                    <ContactForm form={form} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </main>
            <Footer />

        </>
    );
}