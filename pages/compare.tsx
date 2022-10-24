import { GetStaticProps } from 'next'
import React, { Fragment } from 'react'
import CompareTable from '../components/compareTable'
import CompareTable2 from '../components/compareTable2'
import { prisma } from '../lib/db'
import { classNames } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'

type Props = {
    categories: DetailedCategory[]
    phones: DetailedPhone[]
}

function Compare({ categories, phones }: Props) {
    const comparePhones = useAppSelector(state => state.compare)

    return (
        <div>
            {/* <CompareTable2 categories={categories} phones={phones} /> */}
            <CompareTable categories={categories} phones={phones} />
        </div>
    )
}

export default Compare

export const getStaticProps: GetStaticProps = async () => {
    let phones;
    let categories;
    try {
        phones = await prisma.phone.findMany({ where: { OR: [{ id: 5555 }, { id: 5556 }, { id: 5557 }] }, include: { PhoneSpecs: { include: { spec: { include: { category: true } } }}}})
        categories = await prisma.category.findMany({ include: { specs: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { phones, categories } }
}