import Component404 from '../components/page404'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

function Page404() {
    const router = useRouter()
    const [arLang, setArLang] = useState<boolean>(false)
    useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

    return (
        <div>
            <Component404 arLang={arLang} />
        </div>
    )
}

export default Page404