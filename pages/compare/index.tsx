import { QuickSpec } from '@prisma/client'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { Fragment, useEffect, useState } from 'react'
import CompareTable from '../../components/compareTable'
import { prisma } from '../../lib/db'
import { classNames } from '../../lib/functions'
import { useAppSelector } from '../../redux/hooks'
import { ArCategory, DetailedCategory, DetailedPhone } from '../../types'

type Props = {
    categories: ArCategory[]
    allPhones: { name: string, imgUrl: string }[]
    quickSpecs: any[]
}

function Compare({ categories, allPhones, quickSpecs }: Props) {
    const comparePhones = useAppSelector(state => state.compare)
    const router = useRouter()
    const [arLang, setArLang] = useState<boolean>(false)
    useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

    return (
        <div>
            <CompareTable categories={categories} allPhones={allPhones} quickSpecs={quickSpecs} arLang={arLang} />
        </div>
    )
}

export default Compare

export const getStaticProps: GetStaticProps = async () => {
    let categories;
    let allPhones;
    let quickSpecs;
    try {
        categories = await prisma.category.findMany({ include: { specs: true } })
        quickSpecs = await prisma.quickSpec.findMany()
        // allPhones = await prisma.phone.findMany({ include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
        allPhones = await prisma.phone.findMany({ select: { name: true, imgUrl: true } })

    } catch (error) {
        console.log(error)
    }

    return { props: { categories, allPhones, quickSpecs } }
}