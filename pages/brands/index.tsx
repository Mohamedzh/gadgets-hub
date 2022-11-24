import { GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import Link from 'next/link'
import SearchBar from '../../components/brandSearchBar'
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
            <div className='lg:mx-10 grid grid-cols-3'>
                {dbBrands.map((brand, idx) =>
                    (brand.phones.length > 0 || brand.Reviews.length > 0) &&
                    <div
                        className='m-3'
                        key={idx}
                    >
                        <Link href={`/brands/${brand.name.toLowerCase()}`}>
                            <a
                                className={`${brand.name.length > 8 ? 'text-base' : "text-lg"} lg:text-3xl font-semibold text-slate-400 font-mono`}
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

    const res = await axios.get(`https://www.gsmarena.com`);

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

    for (let i = json.length - 1; i >= 0; i--) {
        if (!allPhones.find(phone => phone.url === json[i].url)) {
            unrecordedPhones.push(json[i])
        }
    }

    let toBeRecordedPhones = []
    for (let i = 0; i < unrecordedPhones.length; i++) {
        let response = await axios.get(`https://www.gsmarena.com/${unrecordedPhones[i].url}.php`);
        const $ = cheerio.load(response.data)

        const imgBlock = $('.specs-photo-main').find('img')
        const phone = {
            name: $('.specs-phone-name-title').text(),
            imgUrl: imgBlock.attr('src')!,
            url: unrecordedPhones[i].url,
            description: $('.specs-phone-name-title').text(),
            year: (Number($('span[data-spec=released-hl]').text().slice(9, 13)) % 1 === 0 ? Number($('span[data-spec=released-hl]').text().slice(9, 13)) : Number($('span[data-spec=released-hl]').text().slice(13, 17))),
            brandName: $('.specs-phone-name-title').text().slice(0, $('.specs-phone-name-title').text().indexOf(' ')).toLowerCase()
        }
        toBeRecordedPhones.push(phone)
    }

    await prisma.phone.createMany({ data: toBeRecordedPhones, skipDuplicates: true })

    let phones = await prisma.phone.findMany({ select: { id: true, url: true } })

    let newToBeRecordedPhones: Phone[] = toBeRecordedPhones.map(recordedPhone => {
        let targetPhone = phones.find(phone => phone.url === recordedPhone.url)
        return { ...recordedPhone, id: targetPhone!.id }
    })

    getAllPhonesDetails(0, newToBeRecordedPhones.length, newToBeRecordedPhones)

    return { props: { dbBrands }, revalidate: 172800 }
}