import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'

type Phone = {
    name: string
    imgUrl: string
    url: string
    description: string
}

function PhoneDetails({ allPhones }: { allPhones: any[] }) {
    console.log(allPhones);

    // const recordBrandPhones = async () => {

    // }



    return (
        <div>
            {/* {json.map((phone, idx) =>
                <div
                    className='grid grid-cols-3'
                    key={idx}>
                    <p>{phone.name}</p>
                    <img src={phone.imgUrl} />
                    <p>{phone.url}</p>
                    <p>{phone.description}</p>

                </div>
            )} */}
            {allPhones.map((phone, i) =>
                <div key={i}>
                    <p>{phone.name}</p>
                    <p>{phone.brandName}</p>
                    <p>{phone.imgUrl}</p>
                </div>
            )}
        </div>
    )
}

export default PhoneDetails

export const getStaticProps: GetStaticProps = async () => {
    // const res = await axios.get('https://www.gsmarena.com/apple-phones-48.php')
    // let html = res.data

    // const $ = cheerio.load(html)
    // const json: Phone[] = []
    // const phones = $('.makers').find('li')
    // phones.each((i, el) => {
    //     const imgBlock = $(el).find('img')
    //     const phone = {
    //         name: $(el).find('span').text(),
    //         imgUrl: imgBlock.attr('src')!,
    //         url: $(el).find('a').attr('href')!.replace('.php', ''),
    //         description: imgBlock.attr('title')!
    //     }
    //     json.push(phone)
    // })

    let brands = await prisma.brand.findMany()
    let urls = brands.map(item => { return item.gsmArenaUrl })
    console.log(urls);

    let allPhones: any = []

    for (let i = 0; i < urls.length; i++) {
        let timeoutFunc = setTimeout(async () => {
            const res = await axios.get(`https://www.gsmarena.com/${urls[i]}.php`)
            let html = res.data

            const $ = cheerio.load(html)
            const json: Phone[] = []
            const phones = $('.makers').find('li')
            phones.each((i, el) => {
                const imgBlock = $(el).find('img')
                const phone = {
                    name: $(el).find('span').text(),
                    imgUrl: imgBlock.attr('src')!,
                    url: $(el).find('a').attr('href')!.replace('.php', ''),
                    description: imgBlock.attr('title')!
                }
                json.push(phone)
            })
            // let brandString = urls[i].split("-").splice(-2).join("-")
            let brandArray = urls[i].split("-")
            brandArray.splice(-2)
            const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)
            let brandString = capitalize(brandArray.join())

            let detailedPhone = json.map(phone => { return { name: phone.name, imgUrl: phone.imgUrl, brandName: brandString } })
            // console.log(detailedPhone);

            // allPhones.push(detailedPhone)
            console.log(detailedPhone);
            // console.log(allPhones);
            for (let i = 0; i < detailedPhone.length; i++) {
                await prisma.phone.create({ data: detailedPhone[i] })
            }
            // await prisma.phone.createMany({ data: detailedPhone })
        }, 1000 * (i + 1));

    }
    return { props: { name: 'trial', allPhones } }
}