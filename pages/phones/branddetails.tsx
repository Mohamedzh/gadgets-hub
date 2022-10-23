import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { Page, PageData } from '../../types'
import { getPages } from '../../lib/cheerio'

type Phone = {
    name: string
    imgUrl: string
    url: string
    description: string
}

function PhoneDetails({ allPhones }: { allPhones: any[] }) {
    // console.log(allPhones);

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

export const getStaticProps: GetStaticProps = async () => { //working but needs less requests

    let brands = await prisma.brand.findMany()
    let urls = brands.map(item => { return item.gsmArenaUrl })

    let allPhones: any = []

    for (let i = 75; i < 100; i++) {
        let timeoutFunc = setTimeout(async () => {
            const res = await axios.get(`https://www.gsmarena.com/${urls[i]}.php`)
            let html = res.data

            const $ = cheerio.load(html)
            // ////
            // const pagesData: { number: number }[] = []
            // const pages = $('.review-nav .nav-pages').find('a, strong')
            // pages.each((i, el) => {
            //     const page: Page = {
            //         number: parseInt($(el).text()),
            //     }
            //     if (el.name !== 'strong') {
            //         page.url = $(el).attr('href')?.replace('.php', '')
            //     } else {

            //         page.url = `${urls[i]}`

            //         page.active = true
            //     }
            //     pagesData.push(page)
            // })

            // let nextPage = $('a.pages-next').attr('href')
            // if (nextPage) {
            //     if (nextPage.indexOf('#') >= 0) {
            //         nextPage = ''
            //     } else {
            //         nextPage = nextPage.replace('.php', '')
            //     }
            // }

            // let prevPage = $('a.pages-prev').attr('href')
            // if (prevPage) {
            //     if (prevPage.indexOf('#') >= 0) {
            //         prevPage = ''
            //     } else {
            //         prevPage = prevPage.replace('.php', '')
            //     }
            // }

            // const data: PageData = {
            //     prev: '',
            //     next: '',
            //     pages: []
            // }

            // if (prevPage) {
            //     data.prev = prevPage
            // }
            // if (nextPage) {
            //     data.next = nextPage
            // }

            // if (pagesData.length) {
            //     data.pages = pagesData
            // }
            const data: PageData = await getPages(urls[i])
            // return data
            // console.log(data.pages)
            ////
            const json: Phone[] = []

            if (data.pages.length > 0) {
                for (let j = 0; j < data.pages.length; j++) {
                    setTimeout(async () => {
                        const res = await axios.get(`https://www.gsmarena.com/${data.pages[j].url}.php`)
                        let html = res.data

                        const $ = cheerio.load(html)


                        const phones = $('.makers').find('li')
                        phones.each((l, el) => {
                            const imgBlock = $(el).find('img')
                            const phone = {
                                name: $(el).find('span').text(),
                                imgUrl: imgBlock.attr('src')!,
                                url: $(el).find('a').attr('href')!.replace('.php', ''),
                                description: imgBlock.attr('title')!
                            }
                            json.push(phone)
                        })

                        if (j === data.pages.length - 1) {
                            let brandArray = urls[i].split("-")
                            brandArray.splice(-2)
                            const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)
                            // let brandString = capitalize(brandArray.join())
                            let brandString = brandArray.join()


                            let detailedPhone = json.map(phone => { return { ...phone, brandName: brandString } })
                            // allPhones.push(detailedPhone)
                            // for (let i = 0; i < detailedPhone.length; i++) {
                            console.log(json.length);

                            await prisma.phone.createMany({ data: detailedPhone, skipDuplicates: true })
                        }

                    }, 1000 * (i + 2))
                }
            }
            else {
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
                let brandArray = urls[i].split("-")
                brandArray.splice(-2)
                const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)
                // let brandString = capitalize(brandArray.join())
                let brandString = brandArray.join()


                let detailedPhone = json.map(phone => { return { ...phone, brandName: brandString } })
                // allPhones.push(detailedPhone)
                // for (let i = 0; i < detailedPhone.length; i++) {
                await prisma.phone.createMany({ data: detailedPhone, skipDuplicates: true })
            }

            // let brandString = urls[i].split("-").splice(-2).join("-")


            // }

        }, 1000 * (i + 10));
    }
    return { props: { name: 'trial', allPhones } }
}