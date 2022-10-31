import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { SessionContextProvider, useSupabaseClient } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  // const supabaseClient = useSupabaseClient();
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <Provider store={store}>
      <SessionContextProvider
        supabaseClient={supabaseClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionContextProvider>
    </Provider>
  )
}

export default MyApp
