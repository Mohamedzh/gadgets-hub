import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import Link from 'next/link'
import SearchBar from '../../components/brandSearchBar'
import puppeteer from 'puppeteer';
import { Phone } from '@prisma/client'
import { getAllPhonesDetails, updateSpecs } from '../../lib/cheerio'
import { PhoneSpec, Spec, SpecDetail } from '../../types'

export type Brand = {
    name: string
    phonesNum: number
    gsmArenaUrl: string
    phones: { name: string }[]
    Reviews: { name: string }[]
}

function Phones({ dbBrands }: { dbBrands: Brand[] }) {

    return (
        <div className='mx-10 my-5'>
            <p className='m-2 text-white text-base'>Brand search by name</p>
            <SearchBar dbBrands={dbBrands} />
            <div className='mx-10 grid grid-cols-3'>
                {dbBrands.map((brand, idx) =>
                    (brand.phones.length > 0 || brand.Reviews.length > 0) &&
                    <div
                        className='m-3'
                        key={idx}
                    >
                        <Link href={`/brands/${brand.name.toLowerCase()}`}>
                            <a
                                className='text-xl lg:text-3xl font-semibold text-slate-400 font-mono'
                            >
                                {brand.name.toUpperCase()}
                            </a>
                        </Link>
                        <br></br>
                        {brand.phones.length > 0 &&
                            <Link href={`/brands/${brand.name.toLowerCase()}`}>
                                <a className='text-white text-sm lg:text-base hover:underline cursor-pointer hover:text-blue-600'>{brand.phones.length} {brand.phones.length === 1 ? 'phone' : 'phones'}
                                </a>
                            </Link>}
                        <br></br>
                        {brand.Reviews.length > 0 &&
                            <Link href={`/reviews/${brand.name.toLowerCase()}`}>
                                <a className='text-white text-sm lg:text-base hover:underline cursor-pointer hover:text-blue-600'>{brand.Reviews.length} {brand.Reviews.length === 1 ? 'review' : 'reviews'}
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
    ////
    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();
    // page.setDefaultNavigationTimeout(0)

    const res = await axios.get(`https://www.gsmarena.com`);

    // const bodyHandle = await page.$('body');
    // const html = await page.evaluate(body => body!.innerHTML, bodyHandle);
    let json: { url: string }[] = []
    const $ = cheerio.load(res.data)

    const newPhones = $('.module-phones')
    newPhones.each((l, el) => {
        if (l === 1) {
            const phoneBlock = $(el).find('a')
            phoneBlock.each((j, ele) => {

                const phone = {
                    url: $(ele).attr('href')!.replace('.php', ''),

                }
                json.push(phone)
            })
        }
    })
    const allPhones = await prisma.phone.findMany({ select: { url: true } })
    let unrecordedPhones: { url: string }[] = []
    // console.log(json);

    for (let i = 0; i < json.length; i++) {
        if (!allPhones.find(phone => phone.url === json[i].url)) {
            unrecordedPhones.push(json[i])
        }
    }
    // console.log(unrecordedPhones);

    let toBeRecordedPhones = []
    for (let i = 0; i < unrecordedPhones.length; i++) {
        let response = await axios.get(`https://www.gsmarena.com/${unrecordedPhones[i].url}.php`);
        // const bodyHandle2 = await page.$('body');
        // const html2 = await page.evaluate(body => body!.innerHTML, bodyHandle2);
        const $ = cheerio.load(response.data)

        const imgBlock = $('.specs-photo-main').find('img')
        const phone = {
            name: $('.specs-phone-name-title').text(),
            imgUrl: imgBlock.attr('src')!,
            url: $('.specs-photo-main').find('a').attr('href')!.replace('.php', ''),
            description: $('.specs-phone-name-title').text(),
            year: Number($('span[data-spec=released-hl]').text().slice(9, 13)),
            brandName: $('.specs-phone-name-title').text().slice(0, $('.specs-phone-name-title').text().indexOf(' ')).toLowerCase()
        }
        toBeRecordedPhones.push(phone)
    }
    // await browser.close();

    // console.log(toBeRecordedPhones);

    await prisma.phone.createMany({ data: toBeRecordedPhones, skipDuplicates: true })

    let phones = await prisma.phone.findMany({ select: { id: true, url: true } })

    let newToBeRecordedPhones: Phone[] = toBeRecordedPhones.map(recordedPhone => {
        let targetPhone = phones.find(phone => phone.url === recordedPhone.url)
        return { ...recordedPhone, id: targetPhone!.id }
    })

    // getAllPhonesDetails(0, newToBeRecordedPhones.length, newToBeRecordedPhones)

    /////(
    const getPhonesDetails = async () => {
        for (let i = 0; i < newToBeRecordedPhones.length; i++) {

            const res = await axios.get(`https://www.gsmarena.com/${newToBeRecordedPhones[i].url}.php`, { headers: { "User-Agent": "request" } })
            let html = res.data
            const $ = cheerio.load(html)

            const display_size = $('span[data-spec=displaysize-hl]').text()
            const display_res = $('div[data-spec=displayres-hl]').text()
            const camera_pixels = $('.accent-camera').text()
            const video_pixels = $('div[data-spec=videopixels-hl]').text()
            const ram_size = $('.accent-expansion').text()
            const chipset = $('div[data-spec=chipset-hl]').text()
            const battery_size = $('.accent-battery').text()
            const battery_type = $('div[data-spec=battype-hl]').text()

            const quick_spec = []
            quick_spec.push({ name: 'Display size', value: display_size })
            quick_spec.push({ name: 'Display resolution', value: display_res })
            quick_spec.push({ name: 'Camera pixels', value: camera_pixels })
            quick_spec.push({ name: 'Video pixels', value: video_pixels })
            quick_spec.push({ name: 'RAM size', value: ram_size })
            quick_spec.push({ name: 'Chipset', value: chipset })
            quick_spec.push({ name: 'Battery size', value: battery_size })
            quick_spec.push({ name: 'Battery type', value: battery_type })


            // const title = $('.specs-phone-name-title').text()
            // const img = $('.specs-photo-main a img').attr('src')
            // const img_url = $('.specs-photo-main a').attr('href')
            let allSpecs: Spec[] = []
            let price: string = '0'
            const specNode = $('table')
            const spec_detail: SpecDetail[] = []
            specNode.each((i, el) => {
                const specList: { name: string; value: string; alias: string }[] = []
                const category = $(el).find('th').text()
                const specN = $(el).find('tr')
                specN.each((index, ele) => {
                    const a = {
                        name: $('td.ttl', ele).text(),
                        value: $('td.nfo', ele).text(),
                        alias: `${category}${index}`,
                    }
                    specList.push(a)
                    if (a.value.length > 0) {
                        allSpecs.push(a)
                    }
                    if (a.name === 'Price') {
                        price = a.value
                    }
                })
                if (category) {
                    spec_detail.push({
                        category: category,
                        specs: specList
                    })
                }
            })

            let phoneSpecs: PhoneSpec[] = allSpecs.map(spec => {
                return {
                    value: spec.value, specAlias: spec.alias, phoneId: newToBeRecordedPhones[i].id
                }
            })

            updateSpecs(spec_detail)



            let usdPrice = Math.round(Number(price.slice(price.indexOf('$') + 2, price.indexOf('/') - 2).replace(',', '')))
            let euroPrice = Math.round(Number(price.slice(price.indexOf('€') + 2, price.indexOf('/', price.indexOf('€') + 2) - 2).replace(',', '')))
            let gbpPrice = Math.round(Number(price.slice(price.indexOf('£') + 2, price.indexOf('/', price.indexOf('£') + 2) - 2).replace(',', '')))
            let indianPrice = Math.round(Number(price.slice(price.indexOf('₹') + 2).replace(',', '')))
            let uniPrice: number;
            if (price.indexOf('About') === 0) {
                uniPrice = Number(price.slice(6, price.indexOf(' ', 6)))
                if (uniPrice > 0) {
                    await prisma.eURPrice.create({ data: { phoneId: newToBeRecordedPhones[i].id, value: uniPrice } })
                }
            }

            if (usdPrice > 0) {
                await prisma.uSDPrice.create({ data: { phoneId: newToBeRecordedPhones[i].id, value: usdPrice } })
            }
            if (euroPrice > 0) {
                await prisma.eURPrice.create({ data: { phoneId: newToBeRecordedPhones[i].id, value: euroPrice } })
            }
            if (gbpPrice > 0) {
                await prisma.gBPPrice.create({ data: { phoneId: newToBeRecordedPhones[i].id, value: gbpPrice } })
            }
            if (indianPrice > 0) {
                await prisma.indianPrice.create({ data: { phoneId: newToBeRecordedPhones[i].id, value: indianPrice } })
            }

            await prisma.phoneSpecs.createMany({ data: phoneSpecs, skipDuplicates: true })

            let qSpecs = quick_spec.map(spec => { return { value: spec.value, phoneId: newToBeRecordedPhones[i].id, quickspecName: spec.name } })
            await prisma.phoneQuickSpecs.createMany({ data: qSpecs, skipDuplicates: true })
        }
    }

    getPhonesDetails()
    ////
    return { props: { dbBrands }, revalidate: 172800 }
}