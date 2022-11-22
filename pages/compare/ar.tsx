import { PhoneQuickSpecs, QuickSpec } from '@prisma/client'
import { GetStaticProps } from 'next'
import React, { Fragment, useEffect, useState } from 'react'
import CompareTable from '../../components/compareTable'
import { prisma } from '../../lib/db'
import { classNames } from '../../lib/functions'
import { useAppSelector } from '../../redux/hooks'
import { ArCategory, ArQuickSpec, DetailedCategory, DetailedPhone } from '../../types'
import { v2 } from '@google-cloud/translate'
import { useRouter } from 'next/router'

type Props = {
    categories: ArCategory[]
    allPhones: { name: string, imgUrl: string }[]
    quickSpecs: ArQuickSpec[]
}

function Compare({ categories, allPhones, quickSpecs }: Props) {
    const router = useRouter()
    const [arLang, setArLang] = useState<boolean>(false)
    useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

    return (
        <div className='ar'>
            <CompareTable categories={categories} allPhones={allPhones} quickSpecs={quickSpecs} arLang={arLang} />
        </div>
    )
}

export default Compare

export const getStaticProps: GetStaticProps = async () => {
    let categories: ArCategory[];
    let allPhones;
    let quickSpecs;
    let arQuickSpecs: ArQuickSpec[] = []
    let arCategories: ArCategory[] = []
    const { Translate } = v2
    async function transArabic(text: string, target: string) {
        const projectId = 'gadgets-hub-368213';
        const credentials = JSON.parse(
            Buffer.from(process.env.TRANSLATE_KEY!, 'base64').toString()
        )
        const translate = new Translate({ projectId, credentials });
        const [translation] = await translate.translate(text, target);
        return translation
    }
    try {
        categories = await prisma.category.findMany({ include: { specs: true } })
        quickSpecs = await prisma.quickSpec.findMany()
        // allPhones = await prisma.phone.findMany({ include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
        allPhones = await prisma.phone.findMany({ select: { name: true, imgUrl: true } })
        for (let i = 0; i < quickSpecs.length; i++) {
            arQuickSpecs.push({ ...quickSpecs[i], arabicName: await transArabic(quickSpecs[i].name, 'ar') })
        }
        for (let i = 0; i < categories.length; i++) {
            // let arSpecs = []
            for (let k = 0; k < categories[i].specs.length; k++) {
                // arSpecs.push({ arabicName: await transArabic(categories[i].specs[k].name, 'ar') })
                categories[i].specs[k].arabicName = await transArabic(categories[i].specs[k].name, 'ar')
            }
            arCategories.push({ ...categories[i], arabicName: await transArabic(categories[i].name, 'ar') })
        }
    } catch (error) {
        console.log(error)
    }

    return { props: { categories: arCategories, allPhones, quickSpecs: arQuickSpecs } }
}