import Head from 'next/head';

import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

// dynamic import ContactForm with noSSR
import dynamic from 'next/dynamic';
const ContactForm = dynamic(() => import('components/Checkout/ContactForm'), { ssr: false });

import PaperPlane from 'assets/paper_plane.svg';

import type { contactInfo } from 'utils/types';
import SuccessModal from 'components/SuccessModal';
import { useEffect, useState } from 'react';

Contact.layoutProps = {
    navbarProps: { activePage: 'contact_us' },
    headerProps: {
        h1: 'Contact us',
        h2: 'Leave us a message and we will get intouch as soon as possible.',
        showSeperator: true,
    },
} as LayoutProps;

export default function Contact() {
    // state for showing the success modal
    const [showSuccessModal, setShowSuccessModal] = useState({
        show: false,
        status: 0,
    });
    const [initialValues, setInitialValues] = useState<contactInfo | undefined>();
    const [message, setMessage] = useState('');

    const handleSubmit = async (data: contactInfo) => {
        // store data in local storage
        localStorage.setItem('contactInfo', JSON.stringify(data));

        // append message to data
        data.message = message;

        // send data to backend
        const res = await fetch('/api/contact-us', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // show success modal
        setShowSuccessModal({ show: true, status: res.status });
        setInitialValues(undefined);
        setMessage('');
    };

    useEffect(() => {
        const data = localStorage.getItem('contactInfo');
        setInitialValues(data ? JSON.parse(data) : undefined);
    }, []);

    return (
        <>
            <Head>
                <title>DEMAC - Constact Us</title>
                <meta
                    name='description'
                    content='Leave us a message demac@demac-egypt.com or call us: +20 1099 747 581'
                />
                <meta name='robots' content='index, follow' />
                <meta property='og:title' content='DEMAC - Contact Us' />
                <meta property='og:type' content='website' />
                <meta
                    property='og:description'
                    content='Leave us a message demac@demac-egypt.com or call us: +20 1099 747 581'
                />
                <meta property='og:image' content='https:/demac-eg.co/assets/demac_logo.svg' />
            </Head>
            <main className='py-5'>
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
                                        as='textarea'
                                        placeholder='Type your message here, or leave blank.'
                                        rows={8}
                                        maxLength={500}
                                        style={{ resize: 'none' }}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <span className='text-end'>
                                        {`${message.length || 0}/500 characters`}
                                    </span>
                                    <PaperPlane
                                        className='d-none d-md-block text-center my-auto'
                                        style={{ opacity: '0.5' }}
                                        alt='Paper plane decoration'
                                    />
                                </Col>
                                <Col>
                                    <ContactForm
                                        handleSubmit={handleSubmit}
                                        initialValues={initialValues}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Container>
            </main>

            <SuccessModal showState={[showSuccessModal, setShowSuccessModal]} />
        </>
    );
}
