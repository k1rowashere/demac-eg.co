import React from 'react';
import Button from 'react-bootstrap/Button';

export default function ScrollToTop() {
    return (
        <Button
            variant='light'
            onClick={(e) => {
                window.scrollTo(0, 0);
                e.currentTarget.blur();
            }}
            style={{
                position: 'fixed',
                bottom: '20vh',
                right: '1vh',
                opacity: '50%',
                padding: '1em',
            }}
        >
            <i className='bi bi-chevron-double-up' />
            {/* <br /> Back to
            <br /> top */}
        </Button>
    );
}
