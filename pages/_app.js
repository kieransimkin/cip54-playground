import '../styles/globals.css'
import Layout from '../components/Layout'
import React from "react";
import App from "next/app";
import { PageTransition } from "next-page-transitions";
import CircularProgress from '@material-ui/core/CircularProgress';
import {useRouter} from 'next/router';
import { GoogleAnalytics } from "nextjs-google-analytics";
const TIMEOUT = 400;
function CIP54Playground({ Component, pageProps }) {
  
  const router = useRouter();
    return (
      <>
      <GoogleAnalytics trackPageViews />
      <Layout>
        <PageTransition
          timeout={TIMEOUT}
          classNames="page-transition"
          loadingComponent={<CircularProgress />}
          loadingDelay={500}
          loadingTimeout={{
            enter: TIMEOUT,
            exit: 0
          }}
          loadingClassNames="loading-indicator"
        >
          <Component key={router.route} {...pageProps} />
        </PageTransition>
      </Layout>
        <style>{`
          .page-transition-enter {
            opacity: 0;
            
          }
          .page-transition-enter-active {
            opacity: 1;
            
            transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
            opacity: 0;
            transition: opacity ${TIMEOUT}ms;
          }
          .loading-indicator-appear,
          .loading-indicator-enter {
            opacity: 0;
          }
          .loading-indicator-appear-active,
          .loading-indicator-enter-active {
            opacity: 1;
            transition: opacity ${TIMEOUT}ms;
          }
        `}</style>
      </>
    );
}
export default CIP54Playground;
