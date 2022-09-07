import { Modal, Button } from 'react-bootstrap';

type Props<T = { show: boolean; status: number }> = {
    showState: [T, React.Dispatch<React.SetStateAction<T>>];
};

export default function SuccessModal({
    showState: [showSuccessModal, setShowSuccessModal],
}: Props) {
    const handleClose = () => setShowSuccessModal({ show: false, status: showSuccessModal.status });

    return (
        <Modal show={showSuccessModal.show} onHide={handleClose}>
            <Modal.Header closeButton>
                {showSuccessModal.status === 200 ? (
                    <Modal.Title>Success!</Modal.Title>
                ) : (
                    <Modal.Title>Oops!</Modal.Title>
                )}
            </Modal.Header>
            <Modal.Body>
                <p>
                    {showSuccessModal.status === 200
                        ? 'Your information has been recorded; an agent will contact you shortly.'
                        : 'An error has occurred. Please try again later.'}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='secondary' onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
