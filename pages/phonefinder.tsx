import { Brand, PhoneQuickSpecs, QuickSpec } from '@prisma/client'
import { GetStaticProps } from 'next'
import React from 'react'
import Filters from '../components/phoneFinderFilters'
import { prisma } from '../lib/db'

type Props = {
    quickSpecs: PhoneQuickSpecs[]
    brands: { name: string }[]
}

function PhoneFinder({ quickSpecs, brands }: Props) {
    return (
        <div>
            <Filters quickSpecs={quickSpecs} brands={brands} />
        </div>
    )
}

export default PhoneFinder

export const getStaticProps: GetStaticProps = async () => {

    let quickSpecs: PhoneQuickSpecs[] = []
    let brands: { name: string }[] = []
    try {
        quickSpecs = await prisma.phoneQuickSpecs.findMany({ include: { spec: true } })
        brands = await prisma.brand.findMany({ select: { name: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { quickSpecs, brands } }
}