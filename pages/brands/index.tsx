import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import Link from 'next/link'
import SearchBar from '../../components/brandSearchBar'
import puppeteer from 'puppeteer';
import { Phone } from '@prisma/client'
import { getAllPhonesDetails } from '../../lib/cheerio'

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

    ////
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0)

    await page.goto(`https://www.gsmarena.com`);

    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body!.innerHTML, bodyHandle);
    let json: { url: string }[] = []
    const $ = cheerio.load(html)

    const newPhones = $('.module-phones')
    newPhones.each((l, el) => {
        if (l === 1) {
            const phoneBlock = $(el).find('a')
            phoneBlock.each((j, ele) => {
                console.log($(ele).attr('href'));

                const phone = {
                    url: $(ele).attr('href')!.replace('.php', ''),

                }
                json.push(phone)
            })
        }
    })
    const allPhones = await prisma.phone.findMany({ select: { url: true } })
    let unrecordedPhones: { url: string }[] = []
    console.log(json);

    for (let i = 0; i < json.length; i++) {
        if (!allPhones.find(phone => phone.url === json[i].url)) {
            unrecordedPhones.push(json[i])
        }
    }
    console.log(unrecordedPhones);

    let toBeRecordedPhones = []
    for (let i = 0; i < unrecordedPhones.length; i++) {
        await page.goto(`https://www.gsmarena.com/${unrecordedPhones[i].url}.php`);
        const bodyHandle2 = await page.$('body');
        const html2 = await page.evaluate(body => body!.innerHTML, bodyHandle2);
        const $ = cheerio.load(html2)

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

    console.log(toBeRecordedPhones);

    await prisma.phone.createMany({ data: toBeRecordedPhones, skipDuplicates: true })

    let phones = await prisma.phone.findMany({ select: { id: true, url: true } })

    let newToBeRecordedPhones: Phone[] = toBeRecordedPhones.map(recordedPhone => {
        let targetPhone = phones.find(phone => phone.url === recordedPhone.url)
        return { ...recordedPhone, id: targetPhone!.id }
    })

    getAllPhonesDetails(0, newToBeRecordedPhones.length, newToBeRecordedPhones)


    await browser.close();

    /////

    let dbBrands = await prisma.brand.findMany({ include: { phones: { select: { name: true } }, Reviews: { select: { title: true } } } })
    dbBrands = dbBrands.map(brand => {
        return { ...brand, createdAt: JSON.parse(JSON.stringify(brand.createdAt)), updatedAt: JSON.parse(JSON.stringify(brand.updatedAt)) }
    })

    return { props: { dbBrands }, revalidate: 604800 }
}