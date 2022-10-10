import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'

function Phones({ name, ips }: { name: string, ips: string }) {
    console.log(name);

    return (
        <div className='mx-10 text-2xl'>
            <p>{ips}</p>
        </div>
    )
}

export default Phones

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get('https://www.whatismyip-address.com', {
        proxy: {
            host: '127.0.0.1',
            port: 3000,
        }
    })
    let html = res.data
    const $ = cheerio.load(html)
    // console.log(html);

    const ips = $('div.divTableCell').find('strong').text()
    console.log(ips);

    return { props: { name: 'trial', ips } }
}