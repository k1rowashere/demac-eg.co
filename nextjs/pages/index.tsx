import Navbar from '../components/navigation'
import Footer from '../components/footer';
import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head><title>DEMAC - Home</title></Head>
            <div className='test text-white'>
                <Navbar activePage="home" bg='nah' />
                {/*Header*/}
                <header>
                    <div className='py-3'>
                        <div className='container px-4 px-lg-5 my-5'>
                            <h1 className='display-4 fw-bolder'>Development in Electro-Mechanical Automation.</h1>
                            <h2 className='lead fw-normal text-white-50 mb-0'>A Consultancy and Engineering Agency.</h2>
                        </div>
                    </div>
                </header>
                {/*Section*/}
                <section className="py-5 h-100" style={{minHeight: '50vh'}} >
                    <div className="row px-4 px-lg-5 mt-5">
                        <div id="categories" className="col-2 d-none d-lg-block">
                        </div>
                        <div id="offers" className="col">
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </>
    );
}
