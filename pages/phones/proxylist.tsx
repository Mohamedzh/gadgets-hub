import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'

function Phones({ name, ips }: { name: string, ips: any }) {
    console.log(name);

    return (
        <div className='mx-10 text-2xl'>
            <p>{ips}</p>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get('https://free-proxy-list.net', {
    })
    let html = res.data
    const $ = cheerio.load(html)
    const ips = $('div.modal-body').find('textarea').text()
    console.log(ips);

    // brands.each((i, el) => {
    //     const aBlock = $(el).find('a')
    //     const brand = {
    //         name: aBlock.text().replace(' devices', '').replace(/[0-9]/g, ""),
    //         devices: $(el).find('span').text().replace(' devices', ''),
    //         url: aBlock.attr('href')!.replace('.php', '')
    //     }
    // })

    return { props: { name: 'trial', ips } }
}