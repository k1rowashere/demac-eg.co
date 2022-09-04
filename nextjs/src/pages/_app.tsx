import 'styles/bootstrap.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'nprogress/nprogress.css';
import 'styles/globals.scss';
import 'styles/styles.scss';
import 'styles/print.css';

import NProgress from 'nprogress';
import Head from 'next/head';
import Router from 'next/router';
import type { AppProps } from 'next/app';
import SSRProvider from 'react-bootstrap/SSRProvider';
import Layout from 'components/Layout';

// Loading bar things
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());
NProgress.configure({ showSpinner: false });

type _AppProps = AppProps & {
    Component: { layoutProps: React.ComponentProps<typeof Layout> };
};

function MyApp({ Component, pageProps }: _AppProps) {
    return (
        <>
            <Head>
                <meta charSet='utf-8' />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1, shrink-to-fit=no'
                />
                <link rel='icon' type='image/x-icon' href='/assets/favicon.svg' />
            </Head>
            <SSRProvider>
                <Layout {...Component.layoutProps}>
                    <Component {...pageProps} />
                </Layout>
            </SSRProvider>
        </>
    );
}
export default MyApp;
