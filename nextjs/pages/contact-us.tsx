import Head from 'next/head';

import { useForm } from 'react-hook-form';

import { Container, Col, Row, Card, Breadcrumb, Stack, Form } from 'react-bootstrap';

import Navbar from '../components/navigation';
import Footer from '../components/footer';
import ContactForm from '../components/contact_form';

import { contactInfo } from '../utils/types';


export default function Contact() {
    const form = useForm<contactInfo>();
    
    return (
        <>
            <Head><title>DEMAC - Contact Us</title></Head>
            <Navbar activePage='contact_us' />
            <header className='bg-dark'>
                <Container className='px-4 px-lg-5 py-5'>
                    <div className='text-white'>
                        <h1 className='display-4 fw-bolder'>Contact Us</h1>
                        <h2 className='lead fw-normal text-white-50 mb-0'>Leave us a message and we will get in touch as soon as possible</h2>
                    </div>
                </Container>
            </header>
            <section className='py-5 bg-light'>
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
                                        <img src='/assets/paper_plane.svg' alt='' style={{opacity: '0.5'}}/>
                                    </picture>
                                </Col>
                                <Col>
                                    <ContactForm form={form} />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </section>
            <Footer />

        </>
    );
}