import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

import Navbar from './navbar'

function Layout({ children }: { children: ReactNode }) {
    return (
        <div className='min-h-full'>
            <Navbar />
            {/* <StoreNav/> */}
            <main >{children}</main>
            {/* <Footer /> */}
            {/* <Footer2 /> */}
        </div>
    )
}

export default Layout