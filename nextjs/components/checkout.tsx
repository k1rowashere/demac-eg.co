import { useForm } from "react-hook-form";

import { Container, Modal } from 'react-bootstrap';
import ContactForm from './contact_form';

import type { contactInfo } from '../utils/types';

export default function CheckoutForm({ show, setShow }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) {
    const form = useForm<contactInfo>();

    const handleClose = () => {
        setShow(false);
    }

    return (<>
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Checkout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className='px-3 px-md-5 my-2' style={{ maxHeight: '73vh', overflow: 'scroll' }} >
                    <ContactForm handleClose={handleClose} showCancel form={form} />
                    <small className='text-muted'>Upon submit, your information will be recorded; an agent will contact you shortly.</small>
                </Container>
            </Modal.Body>
        </Modal>
    </>);
}
