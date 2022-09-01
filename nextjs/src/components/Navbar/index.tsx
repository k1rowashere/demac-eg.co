// import styles from './navbar.module.scss';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Demac from '/public/assets/demac_logo.svg';
import demac from 'styles/demac.module.scss';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';

export default function _Navbar({ activePage, bg = 'dark' }: { activePage: string; bg?: string }) {
    const [expand, setExpand] = useState('');
    useEffect(() => {
        setExpand('md');
    }, []);

    return (
        <Navbar variant='dark' bg={bg} expand={expand}>
            <Container fluid className='px-4 px-md-5'>
                <Demac
                    className={demac.wrapper + ' me-4'}
                    style={{ height: '32px' }}
                    alt='demac logo'
                />
                <Navbar.Toggle aria-controls='offcanvasNavbar' />
                <Navbar.Offcanvas placement='end' id='offcanvasNavbar'>
                    <Offcanvas.Header
                        className='bg-dark text-white'
                        closeButton
                        closeVariant='white'
                    >
                        <Offcanvas.Title> Navigation </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className='bg-dark text-white'>
                        <Nav className='me-auto mb-2 mb-md-0'>
                            <Link href='/' passHref>
                                <Nav.Link
                                    disabled={activePage === 'home'}
                                    active={activePage === 'home'}
                                >
                                    Home
                                </Nav.Link>
                            </Link>
                            <Link href='/about' passHref>
                                <Nav.Link
                                    disabled={activePage === 'about'}
                                    active={activePage === 'about'}
                                >
                                    About
                                </Nav.Link>
                            </Link>
                            <Link href='/projects' passHref>
                                <Nav.Link
                                    disabled={activePage === 'projects'}
                                    active={activePage === 'projects'}
                                >
                                    Projects
                                </Nav.Link>
                            </Link>
                            <Link href='/contact-us' passHref>
                                <Nav.Link
                                    disabled={activePage === 'contact_us'}
                                    active={activePage === 'contact_us'}
                                >
                                    Contact&nbsp;us
                                </Nav.Link>
                            </Link>
                            <NavDropdown
                                menuVariant='dark'
                                title='Store'
                                active={activePage === 'store'}
                            >
                                <Link href='/store/' passHref>
                                    <NavDropdown.Item className='dropdown-item'>
                                        All Products
                                    </NavDropdown.Item>
                                </Link>
                                <NavDropdown.Divider />
                                <Link href='/store/siemens' passHref>
                                    <NavDropdown.Item className='dropdown-item'>
                                        Siemens
                                    </NavDropdown.Item>
                                </Link>
                            </NavDropdown>
                        </Nav>
                        <Nav className='mb-2 mb-md-0'>
                            <Link href='/store/cart' passHref>
                                <Button
                                    className='d-flex align-content-center'
                                    variant='outline-light'
                                    active={activePage === 'cart'}
                                >
                                    <i className='bi bi-cart-fill me-1 my-auto' />
                                    <span className='my-auto'>My&nbsp;Cart</span>
                                </Button>
                            </Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
}
