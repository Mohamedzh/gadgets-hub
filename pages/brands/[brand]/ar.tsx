import { GetStaticProps, GetStaticPaths } from 'next'
import React, { useEffect } from 'react'
import { prisma } from '../../../lib/db'
import { ParsedUrlQuery } from 'querystring'
import PhoneFilter from '../../../components/phoneFilter'
import _ from 'lodash'
import { PhoneWithPrice } from '../../../types'


export type PhoneSummary = {
    name: string
    imgUrl: string
    brandName: string
}

function PhoneDetails({ phones, brand }: { phones: PhoneWithPrice[], brand: string }) {

    return (
        <div>
            <PhoneFilter phones={phones} brand={brand} />

        </div>
    )
}

export default PhoneDetails

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ select: { name: true } })
    const paths = brands.map(brand => ({
        params: { brand: brand.name.toLowerCase() }
    }))
    return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let newBrand = params?.brand as string
    let phones = await prisma.phone.findMany({ where: { brandName: newBrand }})

    return { props: { phones, brand: params?.brand }, revalidate: 172800 }
}