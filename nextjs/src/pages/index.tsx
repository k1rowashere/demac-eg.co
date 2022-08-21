import Head from 'next/head'

import Navbar from 'components/Navbar'
import Header from 'components/Header';
import Footer from 'components/Footer';

export default function Home() {
    return (
        <>
            <Head>
                <title>DEMAC: Development in Electro-Mechanical Engigneering - Home</title>
                <meta name="description" content="Development in Electro-Mechanical Engigneering | Siemens PLC Automation | Buy Spare Parts" />
                <meta name='robots' content='index, follow'/>
                <meta property="og:title" content="Development in Electro-Mechanical Engigneering" />
                <meta property="og:type" content="website" />
                <meta property="og:description"content="Development in Electro-Mechanical Engigneering | Siemens PLC Automation | Buy Spare Parts" />
                <meta property="og:image" content="https:/demac-eg.co/assets/demac_logo.svg" />
            </Head>
            <div className='bg-home-gradient text-white'>
                <Navbar activePage="home" bg='nah' />
                <Header h1='Development in Electro-Mechanical Automation' h2='A Consultancy and Engineering Agency.' classNames={{ parent: '' }} />
                <main className="py-5 h-100" style={{ minHeight: '50vh' }} >
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
