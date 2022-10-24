import { Category } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import PhoneDetails from '../../components/phoneDetails'
import { prisma } from '../../lib/db'
import { DetailedCategory } from '../../types'
import { PhoneSummary } from '../brands/[brand]'

type Props = {
    currentPhone?: any
    categories: DetailedCategory[]
}

function Index({ currentPhone, categories }: Props) {
    const router = useRouter()

    return (
        <div>
            <PhoneDetails currentPhone={currentPhone} categories={categories} />
            {/* <p>{currentPhone.name}</p> */}
            {/* <p>Phone</p> */}

        </div>
    )
}

export default Index

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ include: { phones: { select: { name: true } } } })


    let paths: { params: { phone: string } }[] = []
    for (let i = 0; i < brands.length; i++) {
        paths = brands[i].phones.map(phone => ({
            params: { phone: phone.name }
        }))
    }

    // const paths = brands.map(brand => ({
    //     params: { brand: brand.name.toLowerCase() }
    // }))
    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let currentPhone;
    let categories;
    try {
        let newPhone = params?.phone as string
        // newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
        // console.log(newPhone, params?.phone);

        currentPhone = await prisma.phone.findFirst({ where: { name: newPhone }, include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
        // console.log(currentPhone);
        categories = await prisma.category.findMany({ include: { specs: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { phone: params?.phone, currentPhone, categories } }
}