import axios from 'axios'
import { GetStaticProps, GetStaticPaths } from 'next'
import React, { useEffect } from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { useRouter } from 'next/router'
import Page404 from '../../components/page404'
import { ParsedUrlQuery } from 'querystring'
import PhoneFilter from '../../components/phoneFilter'
import _ from 'lodash'

export type PhoneSummary = {
    name: string
    imgUrl: string
    brandName: string
}

function PhoneDetails({ phones, brand, specs }: { phones: PhoneSummary[], brand: string, specs: any[] }) {
    // let s = _.uniqWith(specs, _.isEqual)
    // const router = useRouter()
    // useEffect(() => { console.log(router.isFallback) }, [router.isFallback])
    return (
        <div>
            {/* {phones.length === 0 ? <Page404 /> : */}
            <PhoneFilter phones={phones} brand={brand} />
            {/* } */}
        </div>
    )
    // }
}

export default PhoneDetails

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ select: { name: true } })
    const paths = brands.map(brand => ({
        params: { brand: brand.name.toLowerCase() }
    }))
    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let newBrand = params?.brand as string
    // newBrand = newBrand.slice(0, 1).toUpperCase() + params?.brand?.slice(1)

    let phones = []
    phones = await prisma.phone.findMany({ where: { brandName: newBrand }, include: { GBPPrice: true, USDPrice: true, EURPrice: true, PhoneQuickSpecs: true } })

    const specs = await prisma.phoneQuickSpecs.findMany({ select: { quickspecName: true, value: true } })
    // console.log(new Set(specs))

    return { props: { phones, brand: params?.brand, specs } }
}