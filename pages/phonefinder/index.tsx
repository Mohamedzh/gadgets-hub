import { Brand, Phone, PhoneQuickSpecs, QuickSpec } from '@prisma/client'
import { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'
import Filters from '../../components/phoneFinderFilters'
import { prisma } from '../../lib/db'
import PhoneResultList from '../../components/phoneFinderResultsList'
import { PhoneFilter } from '../../types'
import { useRouter } from 'next/router'

type Props = {
    quickSpecs: PhoneQuickSpecs[]
    brands: { name: string }[]
    phones: PhoneFilter[]
}

function PhoneFinder({ quickSpecs, brands, phones }: Props) {
    const router = useRouter()
    const [arLang, setArLang] = useState<boolean>(false)
    useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

    return (
        <div className='mx-10'>
            <div
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516382799247-87df95d790b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=874&q=80')` }}
                className='text-gray-200 lg:text-black flex bg-[bottom] bg-[length:1269px_450px] lg:h-72 rounded-xl mt-10 pt-20 pb-3 lg:py-10 px-3 lg:px-10 text-2xl lg:text-5xl font-bold font-serif'>
                <p className='mt-auto'>Phone Finder</p>
            </div>
            <Filters quickSpecs={quickSpecs} brands={brands} phones={phones} arLang={arLang} />
        </div>
    )
}

export default PhoneFinder

export const getStaticProps: GetStaticProps = async () => {

    let quickSpecs: PhoneQuickSpecs[] = []
    let brands: { name: string }[] = []
    let phones: PhoneFilter[] = []
    try {
        quickSpecs = await prisma.phoneQuickSpecs.findMany({ include: { spec: true } })
        brands = await prisma.brand.findMany({ select: { name: true } })
        phones = await prisma.phone.findMany({ include: { PhoneQuickSpecs: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { quickSpecs, brands, phones } }
}