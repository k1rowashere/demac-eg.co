import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

import ContactForm from './ContactForm';

type Props = {
    handleSubmit: React.ComponentProps<typeof ContactForm>['handleSubmit'];
    showState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

export default function CheckoutContainer({ handleSubmit, showState: [show, setShow] }: Props) {
    const handleClose = () => setShow(false);
    const [initialValues, setInitialValues] =
        useState<React.ComponentProps<typeof ContactForm>['initialValues']>();

    // get initial values from local storage
    useEffect(() => {
        const data = localStorage.getItem('contactInfo');
        try {
            setInitialValues(data ? JSON.parse(data) : undefined);
        } catch (e) {
            console.error(e);
        }
    }, []);

    return (
        <>
            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Checkout</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container
                        className='px-3 px-md-5 my-2'
                        style={{ maxHeight: '73vh', overflow: 'scroll' }}
                    >
                        <ContactForm
                            initialValues={initialValues}
                            handleSubmit={handleSubmit}
                            handleClose={handleClose}
                            showCancel
                        />
                        <small className='text-muted'>
                            Upon submit, your information will be recorded; an agent will contact
                            you shortly.
                        </small>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}
