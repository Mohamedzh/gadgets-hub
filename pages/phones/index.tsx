import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'

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
            <h1>Trial</h1>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get('https://www.gsmarena.com/makers.php3')
    let html = res.data
    const $ = cheerio.load(html)
    const json: Brand[] = []
    const brands = $('table').find('td')
    brands.each((i, el) => {
        const aBlock = $(el).find('a')
        const brand = {
            name: aBlock.text().replace(' devices', '').replace(/[0-9]/g, ""),
            phonesNum: Number($(el).find('span').text().replace(' devices', '')),
            gsmArenaUrl: aBlock.attr('href')!.replace('.php', '')
        }
        json.push(brand)
    })

    let allBrands = json.map(brand => { return { ...brand, name: brand.name.toLowerCase() } })
    console.log(allBrands);


    const dbBrands = await prisma.brand.createMany({ data: allBrands, skipDuplicates: true })


    return { props: { name: 'trial', json } }
}