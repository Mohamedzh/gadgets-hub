import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import Link from 'next/link'

export type Brand = {
    name: string
    phonesNum: number
    gsmArenaUrl: string
}

function Phones({ name, json }: { name: string, json: Brand[] }) {
    // console.log(json);

    return (
        <div className='mx-10 grid grid-cols-3'>
            {json.map((brand, idx) =>
                <div
                    className='m-3'
                    key={idx}
                >
                    <Link href={`/brands/${brand.name.toLowerCase()}`}>
                        <a
                            className='text-3xl font-semibold text-white'
                        >
                            {brand.name}
                        </a>
                    </Link>
                    <p className='text-white'>no. of phones {brand.phonesNum}</p>
                    <p className='text-white'>{brand.gsmArenaUrl}</p>
                </div>
            )}
            <h1>Trial</h1>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    let dbBrands = await prisma.brand.findMany()
    dbBrands = dbBrands.map(brand => {
        return { ...brand, createdAt: JSON.parse(JSON.stringify(brand.createdAt)), updatedAt: JSON.parse(JSON.stringify(brand.updatedAt)) }
    })
    // console.log(dbBrands);

    return { props: { name: 'trial', json: dbBrands } }
}