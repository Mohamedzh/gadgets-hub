import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import Link from 'next/link'
import SearchBar from '../../components/brandSearchBar'

export type Brand = {
    name: string
    phonesNum: number
    gsmArenaUrl: string
    phones: { name: string }[]
    Reviews: { name: string }[]
}

function Phones({ dbBrands }: { dbBrands: Brand[] }) {

    return (
        <div className='mx-10 my-5'>
            <p className='m-2 text-white text-base'>Brand search by name</p>
            <SearchBar dbBrands={dbBrands} />
            <div className='mx-10 grid grid-cols-3'>
                {dbBrands.map((brand, idx) =>
                    (brand.phones.length > 0 || brand.Reviews.length > 0) &&
                    <div
                        className='m-3'
                        key={idx}
                    >
                        <Link href={`/brands/${brand.name.toLowerCase()}`}>
                            <a
                                className='text-3xl font-semibold text-slate-400 font-mono'
                            >
                                {brand.name.toUpperCase()}
                            </a>
                        </Link>
                        {brand.phones.length > 0 && <p className='text-white'>{brand.phones.length} {brand.phones.length === 1 ? 'phone' : 'phones'}</p>}
                        {brand.Reviews.length > 0 && <p className='text-white'>{brand.Reviews.length} {brand.Reviews.length === 1 ? 'review' : 'reviews'}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    let dbBrands = await prisma.brand.findMany({ include: { phones: { select: { name: true } }, Reviews: { select: { title: true } } } })
    dbBrands = dbBrands.map(brand => {
        return { ...brand, createdAt: JSON.parse(JSON.stringify(brand.createdAt)), updatedAt: JSON.parse(JSON.stringify(brand.updatedAt)) }
    })

    return { props: { dbBrands } }
}