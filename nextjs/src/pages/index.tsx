import Head from 'next/head';

Home.navbarProps = { activePage: 'home', bg: 'nah' };
Home.headerProps = {
    h1: 'Development in Electro-Mechanical Automation',
    h2: 'A Consultancy and Engineering Agency.',
    classNames: { parent: '' },
};

Home.layoutProps = {
    className: 'bg-home-gradient bg bg-triangles text-white',
    navbarProps: { activePage: 'home', bg: 'nah' },
    headerProps: {
        h1: 'Development in Electro-Mechanical Automation',
        h2: 'A Consultancy and Engineering Agency.',
        classNames: { parent: '' },
        showSeperator: false,
    },
} as LayoutProps;

export default function Home() {
    return (
        <>
            <Head>
                <title>DEMAC: Development in Electro-Mechanical Engigneering - Home</title>
                <meta
                    name='description'
                    content='Development in Electro-Mechanical Engigneering | Siemens PLC Automation | Buy Spare Parts'
                />
                <meta name='robots' content='index, follow' />
                <meta
                    property='og:title'
                    content='Development in Electro-Mechanical Engigneering'
                />
                <meta property='og:type' content='website' />
                <meta
                    property='og:description'
                    content='Development in Electro-Mechanical Engigneering | Siemens PLC Automation | Buy Spare Parts'
                />
                <meta property='og:image' content='https:/demac-eg.co/assets/demac_logo.svg' />
            </Head>
            <main className='py-5'>
                <div className='row px-4 px-lg-5 mt-5'>
                    <div id='categories' className='col-2 d-none d-lg-block'></div>
                    <div id='offers' className='col'></div>
                </div>
            </main>
        </>
    );
}
