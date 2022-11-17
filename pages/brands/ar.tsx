import { GetStaticProps } from 'next'
import React from 'react'
import { prisma } from '../../lib/db'
import Link from 'next/link'
import SearchBar from '../../components/brandSearchBar'
import { v2 } from '@google-cloud/translate'

type Brand = {
    name: string
    arabicName: string
    phonesNum: number
    gsmArenaUrl: string
    phones: { name: string }[]
    Reviews: { name: string }[]
}

function Phones({ dbBrands }: { dbBrands: Brand[] }) {

    return (
        <div className='mx-10 my-5 ar'>
            <p className='m-2 text-white text-base'>بحث باسم الماركة</p>
            <SearchBar dbBrands={dbBrands} />
            <div className='lg:mx-10 grid grid-cols-3'>
                {dbBrands.map((brand, idx) =>
                    (brand.phones.length > 0 || brand.Reviews.length > 0) &&
                    <div
                        className='m-3'
                        key={idx}
                    >
                        <Link href={`/brands/${brand.name.toLowerCase()}`}>
                            <a
                                className={`text-lg lg:text-3xl font-semibold text-slate-400 font-mono`}
                            >
                                {brand.arabicName}
                            </a>
                        </Link>
                        <br></br>
                        {brand.phones.length > 0 &&
                            <Link href={`/brands/${brand.name.toLowerCase()}/ar`}>
                                <a className='text-white text-sm lg:text-base hover:underline cursor-pointer hover:text-blue-600'>
                                    {brand.phones.length} جهاز
                                </a>
                            </Link>}
                        <br></br>
                        {brand.Reviews.length > 0 &&
                            <Link href={`/reviews/${brand.name.toLowerCase()}/ar`}>
                                <a className='text-white text-sm lg:text-base hover:underline cursor-pointer hover:text-blue-600'>
                                    {brand.Reviews.length} تقييم
                                </a>
                            </Link>}
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

    return { props: { dbBrands }, revalidate: 172800 }
}