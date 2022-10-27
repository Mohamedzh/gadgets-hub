import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { getAllBrandNames } from '../../lib/cheerio'

export type Brand = {
    name: string
    phonesNum: number
    gsmArenaUrl: string
}

function Phones({ brands }: { brands: Brand[] }) {

    return (
        <div className='mx-10 grid grid-cols-3'>
            {brands.map((brand, idx) =>
                <div
                    className=''
                    key={idx}>

                    <h1
                        className='text-3xl font-semibold'
                    >
                        {brand.name}
                    </h1>
                    <p>no. of phones {brand.phonesNum}</p>
                    <p>{brand.gsmArenaUrl}</p>
                </div>
            )}
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {

    let brands = await getAllBrandNames()
    await prisma.brand.createMany({ data: brands, skipDuplicates: true })


    return { props: { brands } }
}