import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'

export type Brand = {
    name: string
    devices: string
    url: string
}

function Phones({ name, json }: { name: string, json: Brand[] }) {
    console.log(json);

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
                    <p>no. of phones {brand.devices}</p>
                    <p>{brand.url}</p>
                </div>
            )}
            <h1>Trial</h1>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get('https://www.gsmarena.com/makers.php3')
    console.log(res.data);
    let html = res.data
    const $ = cheerio.load(html)
    const json: Brand[] = []
    const brands = $('table').find('td')
    brands.each((i, el) => {
        const aBlock = $(el).find('a')
        const brand = {
            name: aBlock.text().replace(' devices', '').replace(/[0-9]/g, ""),
            devices: $(el).find('span').text().replace(' devices', ''),
            url: aBlock.attr('href')!.replace('.php', '')
        }
        json.push(brand)
    })

    return { props: { name: 'trial', json } }
}