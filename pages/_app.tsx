import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { SessionContextProvider, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

function MyApp({ Component, pageProps }: AppProps) {
  // const supabaseClient = useSupabaseClient();

  return (
    <Provider store={store}>
      {/* <SessionContextProvider
        supabaseClient={supabaseClient}> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </SessionContextProvider> */}
    </Provider>
  )
}

export default MyApp
