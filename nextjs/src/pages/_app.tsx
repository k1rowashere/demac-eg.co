import 'react-phone-input-2/lib/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'nprogress/nprogress.css'
import '../../styles/globals.css';
import '../../styles/styles.css';
import '../../styles/print.css';

import NProgress from 'nprogress'
import Head from 'next/head'
import Router from 'next/router'
import type { AppProps } from 'next/app'

// Loading bar things
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description" content="Demac: Developent in Electro-Mechanical Auomation Co. | Spare Parts | Sciemens | PLC Automation" />
        <meta name="author" content="Demac-egypt" />
        <link rel="icon" type="image/x-icon" href="/assets/favicon.svg" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
export default MyApp
