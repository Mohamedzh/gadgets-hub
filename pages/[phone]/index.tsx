import { Category, Phone, PhoneQuickSpecs, PhoneSpecs, Spec } from '@prisma/client'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import React, { useEffect, useState } from 'react'
import Loading from '../../components/loading'
import PhoneDetails from '../../components/phoneDetails'
import { prisma } from '../../lib/db'
import { DetailedCategory } from '../../types'

type Props = {
    currentPhone?: any
    categories: DetailedCategory[]
    otherPhones: Phone[]
}

function Index({ currentPhone, categories, otherPhones }: Props) {
    const router = useRouter()
    const [arLang, setArLang] = useState<boolean>(false)
    useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

    return (
        <div>
            {currentPhone ?
                <PhoneDetails currentPhone={currentPhone} categories={categories} otherPhones={otherPhones} arLang={arLang} />
                :
                <Loading />
            }
        </div>
    )
}

export default Index

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({
        where: {
            OR: [
                { name: 'apple' },
                { name: 'samsung' },
                { name: 'oneplus' },
                { name: 'xiaomi' }
            ]
        }, include: { phones: { select: { name: true } } }
    })

    let paths: { params: { phone: string } }[] = []
    for (let i = 0; i < brands.length; i++) {
        for (let j = 0; j < brands[i].phones.length; j++) {
            paths.push({ params: { phone: brands[i].phones[j].name } })
        }
        // paths = brands[i].phones.map(phone => {
        //     return {
        //         params: { phone: phone.name }
        //     }
        // })
    }

    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let currentPhone: Phone & { PhoneSpecs: (PhoneSpecs & { spec: Spec & { category: Category; }; })[]; PhoneQuickSpecs: PhoneQuickSpecs[]; } | null = null;
    let categories: (Category & { specs: Spec[] })[] = [];
    let otherPhones: Phone[] = []
    try {
        let newPhone = params?.phone as string
        // newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
        currentPhone = await prisma.phone.findFirst({ where: { name: newPhone }, include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })

        otherPhones = await prisma.phone.findMany({ where: { brandName: currentPhone?.brandName }, take: 4, skip: 1, cursor: { id: currentPhone?.id }, orderBy: { id: 'desc' } })

        categories = await prisma.category.findMany({ include: { specs: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { phone: params?.phone, currentPhone, categories, otherPhones }, revalidate: 604800 }
}