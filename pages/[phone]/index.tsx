import { GetStaticPaths, GetStaticProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import React from 'react'
import { prisma } from '../../lib/db'
import { PhoneSummary } from '../brands/[brand]'

type Props = {
    currentPhone: PhoneSummary
}

function Index({ currentPhone }: Props) {
    return (
        <div>
            {/* <p>{currentPhone.name}</p> */}
            <p>Phone</p>

        </div>
    )
}

export default Index

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ include: { phones: { select: { name: true } } } })
    console.log(brands[5]);

    let paths: { params: { phone: string } }[];
    for (let i = 0; i < brands.length; i++) {
        paths = brands[i].phones.map(phone => ({
            params: { phone: phone.name.toLowerCase() }
        }))
    }
    // const paths = brands.map(brand => ({
    //     params: { brand: brand.name.toLowerCase() }
    // }))
    return { paths: paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let newPhone = params?.phone as string
    newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
    console.log(newPhone, 123);

    let currentPhone = await prisma.phone.findFirst({ where: { name: 'Chromebook Tab 10' } })
    console.log(currentPhone, 456);


    return { props: { phone: params?.phone } }
}