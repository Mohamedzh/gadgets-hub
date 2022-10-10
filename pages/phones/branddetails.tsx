import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'

type Phone = {
    name: string
    img: string
    url: string
    description: string
}

function PhoneDetails({ json }: { json: Phone[] }) {
    return (
        <div>
            {json.map((phone, idx) =>
                <div
                    className='grid grid-cols-3'
                    key={idx}>
                    <p>{phone.name}</p>
                    <img src={phone.img} />
                    <p>{phone.url}</p>
                    <p>{phone.description}</p>

                </div>
            )}
        </div>
    )
}

export default PhoneDetails

export const getStaticProps: GetStaticProps = async () => {
    const res = await axios.get('https://www.gsmarena.com/apple-phones-48.php')
    let html = res.data
    console.log(res.data);

    const $ = cheerio.load(html)
    const json: Phone[] = []
    const phones = $('.makers').find('li')
    phones.each((i, el) => {
        const imgBlock = $(el).find('img')
        const phone = {
            name: $(el).find('span').html()!.split('<br>').join(' '),
            img: imgBlock.attr('src')!,
            url: $(el).find('a').attr('href')!.replace('.php', ''),
            description: imgBlock.attr('title')!
        }
        json.push(phone)
    })
    return { props: { name: 'trial', json } }
}