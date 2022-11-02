import { QuickSpec } from '@prisma/client'
import { GetStaticProps } from 'next'
import React, { Fragment } from 'react'
import CompareTable from '../components/compareTable'
import { prisma } from '../lib/db'
import { classNames } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'

type Props = {
    categories: DetailedCategory[]
    phones: DetailedPhone[]
    allPhones: DetailedPhone[]
    quickSpecs: QuickSpec[]
}

function Compare({ categories, phones, allPhones, quickSpecs }: Props) {
    const comparePhones = useAppSelector(state => state.compare)

    return (
        <div>
            <CompareTable categories={categories} phones={phones} allPhones={allPhones} quickSpecs={quickSpecs} />
        </div>
    )
}

export default Compare

export const getStaticProps: GetStaticProps = async () => {
    let phones;
    let categories;
    let allPhones;
    let quickSpecs;
    try {
        phones = await prisma.phone.findMany({ where: { OR: [{ id: 5555 }, { id: 5556 }, { id: 5557 }] }, include: { PhoneSpecs: { include: { spec: { include: { category: true } } } } } })
        categories = await prisma.category.findMany({ include: { specs: true } })
        quickSpecs = await prisma.quickSpec.findMany()
        allPhones = await prisma.phone.findMany({ include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { phones, categories, allPhones, quickSpecs } }
}