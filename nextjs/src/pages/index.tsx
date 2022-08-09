import Head from 'next/head'

import { Container } from 'react-bootstrap';

import Navbar from 'components/Navbar'
import Header from 'components/Header';
import Footer from 'components/Footer';

export default function Home() {
    return (
        <>
            <Head><title>DEMAC - Home</title></Head>
            <div className='test text-white'>
                <Navbar activePage="home" bg='nah' />
                <Header h1='Development in Electro-Mechanical Automation' h2='A Consultancy and Engineering Agency.' classNames={{parent: ''}} />
                <main className="py-5 h-100" style={{minHeight: '50vh'}} >
                    <div className="row px-4 px-lg-5 mt-5">
                        <div id="categories" className="col-2 d-none d-lg-block">
                        </div>
                        <div id="offers" className="col">
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
