import axios from 'axios'
import { GetStaticProps, GetStaticPaths } from 'next'
import React, { useEffect } from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { useRouter } from 'next/router'
import Page404 from '../../components/page404'
import { ParsedUrlQuery } from 'querystring'
import PhoneFilter from '../../components/phoneFilter'
import _ from 'lodash'
import puppeteer from 'puppeteer';
import { BrandPhone, PhoneWithPrice } from '../../types'
import { getAllPhonesDetails } from '../../lib/cheerio'
import { EURPrice, Phone } from '@prisma/client'

export type PhoneSummary = {
    name: string
    imgUrl: string
    brandName: string
}

function PhoneDetails({ phones, brand }: { phones: PhoneWithPrice[], brand: string }) {
    // let s = _.uniqWith(specs, _.isEqual)
    // const router = useRouter()
    // useEffect(() => { console.log(router.isFallback) }, [router.isFallback])
    return (
        <div>
            {/* {phones.length === 0 ? <Page404 /> : */}
            <PhoneFilter phones={phones} brand={brand} />
            {/* } */}
        </div>
    )
    // }
}

export default PhoneDetails

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ select: { name: true } })
    const paths = brands.map(brand => ({
        params: { brand: brand.name.toLowerCase() }
    }))
    return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let newBrand = params?.brand as string
    // newBrand = newBrand.slice(0, 1).toUpperCase() + params?.brand?.slice(1)

    let currentBrand = await prisma.brand.findFirst({ where: { name: newBrand } })
    let brandUrl = currentBrand?.gsmArenaUrl.slice(currentBrand?.gsmArenaUrl.lastIndexOf('-') + 1)
    console.log(brandUrl);

    const json: BrandPhone[] = []

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0)

    await page.goto(`https://www.gsmarena.com/results.php3?nYearMin=2022&sMakers=${brandUrl}&sAvailabilities=1`);


    const bodyHandle = await page.$('body');
    const html = await page.evaluate(body => body!.innerHTML, bodyHandle);


    const $ = cheerio.load(html)

    const newPhones = $('.makers').find('li')
    newPhones.each((l, el) => {
        const imgBlock = $(el).find('img')
        const phone = {
            name: $(el).find('span').text(),
            imgUrl: imgBlock.attr('src')!,
            url: $(el).find('a').attr('href')!.replace('.php', ''),
            description: imgBlock.attr('title')!,
            year: Number(imgBlock?.attr('title')?.slice(imgBlock?.attr('title')?.indexOf('Announced')! + 14, imgBlock?.attr('title')?.indexOf('Announced')! + 18)),
        }
        json.push(phone)
    })
    let brandArray = currentBrand!.gsmArenaUrl.split("-")
    brandArray.splice(-2)
    let brandString = brandArray.join()
    let detailedPhone = json.map(phone => { return { ...phone, brandName: brandString } })

    console.log(detailedPhone);
    let newPhonesUrls = detailedPhone.map(phone => {
        return { url: phone.url }
    })


    let phones = await prisma.phone.findMany({ where: { brandName: newBrand }, include: { GBPPrice: true, USDPrice: true, EURPrice: true } })

    let unrecordedPhones = []

    for (let i = 0; i < detailedPhone.length; i++) {
        if (!phones.find(phone => phone.url === detailedPhone[i].url)) {
            unrecordedPhones.push(detailedPhone[i])
            await prisma.phone.create({ data: detailedPhone[i] })
        }
    }

    console.log(unrecordedPhones)

    if (unrecordedPhones.length > 0) {
        let phones = await prisma.phone.findMany({ where: { brandName: newBrand } })
        let newUnrecordedPhones: Phone[] = []

        newUnrecordedPhones = unrecordedPhones.map(phone => {
            let targetPhone = phones.find(phone2 => phone.url === phone2.url)
            return { ...phone, id: targetPhone!.id }
        })

        getAllPhonesDetails(0, newUnrecordedPhones.length, newUnrecordedPhones)
    }

    await browser.close();

    return { props: { phones, brand: params?.brand }, revalidate: 604800 }
}