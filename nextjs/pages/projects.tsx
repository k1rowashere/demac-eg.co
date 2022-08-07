import Head from 'next/head';

import Navbar from '../components/navigation';
import Footer from '../components/footer';

import Container from 'react-bootstrap/Container';


export default function About() {
    return (
        <>
            <Head><title>DEMAC - About</title></Head>
            <Navbar activePage='projects' />
            <main className='py-5 bg-light'>
                <Container>
                <picture>
                    <source srcSet='https://media.istockphoto.com/vectors/under-construction-site-banner-sign-vector-black-and-yellow-diagonal-vector-id1192837450?k=20&m=1192837450&s=612x612&w=0&h=MpHAjpQ7v_zZmH_2FjcbmVMonTOkjs156B1egVrFViw=' type='image/svg+xml' />
                    <img className='w-100' src='https://media.istockphoto.com/vectors/under-construction-site-banner-sign-vector-black-and-yellow-diagonal-vector-id1192837450?k=20&m=1192837450&s=612x612&w=0&h=MpHAjpQ7v_zZmH_2FjcbmVMonTOkjs156B1egVrFViw=' alt="Landscape picture" />
                </picture>
                </Container>
            </main>
            <Footer />
        </>
    );
}