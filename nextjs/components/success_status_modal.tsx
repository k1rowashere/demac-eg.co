import { Modal, Button } from "react-bootstrap";



export default function SuccessModal({ show = false, status = 0, handleClose = () => { } }) {
    return (

        <Modal
            // {...props}
            // size="lg"
            show={show}
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Modal heading
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Centered Modal</h4>
                <p>
                    {status}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}