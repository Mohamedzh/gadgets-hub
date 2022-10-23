import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { updateCategories, updateQuickSpecs, updateSpecs } from '../../lib/cheerio'
import { QuickSpecs, PhoneDetails, SpecDetail, Spec, PhoneSpec } from '../../types'


function PhoneDetails({ json, phoneSpecs }: { json: PhoneDetails, phoneSpecs: Spec[] }) {
    // console.log(json);
    // console.log(phoneSpecs);

    return (
        <div className='bg-white'>
            <div> Testing scraping specs to DB</div>
            {/* <div className='text-center'>
                <p className='text-3xl font-bold m-5'>
                    {json.title}
                </p>
                <div className='grid grid-cols-3 m-5 place-items-center'>
                    <img className='col-span-1' src={json.img} />
                    <div className='col-span-2'>
                        <p className='text-3xl font-bold m-5'>
                            Quick Specs
                        </p>
                        {json.quick_spec.map((spec, idx) =>
                            <div className='grid grid-cols-2' key={idx}>
                                <p>{spec.name}</p>
                                <p>{spec.value}</p>
                            </div>
                        )}
                    </div>
                </div>
                <p className='text-3xl font-bold m-5'>
                    Details
                </p>
                {json.spec_detail.map((detail, idx) =>
                    <div key={idx}>
                        <p>{detail.category}</p>
                        {detail.specs.map((spec, idx) =>
                            <div
                                className='grid grid-cols-2'
                                key={idx}>
                                <p>{spec.name}</p>
                                <p>{spec.value}</p>
                            </div>
                        )}
                    </div>
                )}
            </div> */}
        </div>
    )
}

export default PhoneDetails

export const getStaticProps: GetStaticProps = async () => {
    // const currentPhone = await prisma.phone.findFirst({ where: { id: 5555 } })
    const allPhones = await prisma.phone.findMany()
    console.log(allPhones.length);

    let j = 0

    for (let i = 1; i < 701; i++) {
        j++
        setTimeout(async () => {

            const res = await axios.get(`https://www.gsmarena.com/${allPhones[i].url}.php`)
            let html = res.data
            const $ = cheerio.load(html)

            const release_date = $('span[data-spec=released-hl]').text()
            const release_year = $('span[data-spec=released-hl]').text().slice(9, 13)
            const operating_system = $('span[data-spec=os-hl]').text()
            const display_size = $('span[data-spec=displaysize-hl]').text()
            const display_res = $('div[data-spec=displayres-hl]').text()
            const camera_pixels = $('.accent-camera').text()
            const video_pixels = $('div[data-spec=videopixels-hl]').text()
            const ram_size = $('.accent-expansion').text()
            const chipset = $('div[data-spec=chipset-hl]').text()
            const battery_size = $('.accent-battery').text()
            const battery_type = $('div[data-spec=battype-hl]').text()

            const quick_spec = []
            quick_spec.push({ name: 'Release year', value: release_year })

            quick_spec.push({ name: 'Release date', value: release_date })
            quick_spec.push({ name: 'OS', value: operating_system })
            quick_spec.push({ name: 'Display size', value: display_size })
            quick_spec.push({ name: 'Display resolution', value: display_res })
            quick_spec.push({ name: 'Camera pixels', value: camera_pixels })
            quick_spec.push({ name: 'Video pixels', value: video_pixels })
            quick_spec.push({ name: 'RAM size', value: ram_size })
            quick_spec.push({ name: 'Chipset', value: chipset })
            quick_spec.push({ name: 'Battery size', value: battery_size })
            quick_spec.push({ name: 'Battery type', value: battery_type })


            const title = $('.specs-phone-name-title').text()
            const img = $('.specs-photo-main a img').attr('src')
            const img_url = $('.specs-photo-main a').attr('href')

            let allSpecs: Spec[] = []
            let price: string = '0'

            const specNode = $('table')
            const spec_detail: SpecDetail[] = []
            specNode.each((i, el) => {
                const specList: Spec[] = []
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
            ////                
            let phoneSpecs: PhoneSpec[] = allSpecs.map(spec => {
                return {
                    value: spec.value, specAlias: spec.alias, phoneId: allPhones[i].id
                }
            })

            //////
            let qSpecs = quick_spec.map(spec => { return { value: spec.value, phoneId: allPhones[i].id, quickspecName: spec.name } })
            await prisma.phoneQuickSpecs.createMany({ data: qSpecs, skipDuplicates: true })

            updateSpecs(spec_detail)

            await prisma.phone.update({ where: { id: allPhones[i].id }, data: { year: Number(release_year) } })


            let usdPrice = Math.round(Number(price.slice(price.indexOf('$') + 2, price.indexOf('/') - 2).replace(',', '')))
            let euroPrice = Math.round(Number(price.slice(price.indexOf('€') + 2, price.indexOf('/', price.indexOf('€') + 2) - 2).replace(',', '')))
            let gbpPrice = Math.round(Number(price.slice(price.indexOf('£') + 2, price.indexOf('/', price.indexOf('£') + 2) - 2).replace(',', '')))
            let indianPrice = Math.round(Number(price.slice(price.indexOf('₹') + 2).replace(',', '')))
            let uniPrice: number;
            if (price.indexOf('$') === -1) {
                uniPrice = Number(price.slice(6, price.indexOf(' ') - 1))
                if (uniPrice > 0) {
                    await prisma.eURPrice.create({ data: { phoneId: allPhones[i].id, value: uniPrice } })
                }
            }

            if (usdPrice > 0) {
                await prisma.uSDPrice.create({ data: { phoneId: allPhones[i].id, value: usdPrice } })
            }
            if (euroPrice > 0) {
                await prisma.eURPrice.create({ data: { phoneId: allPhones[i].id, value: euroPrice } })
            }
            if (gbpPrice > 0) {
                await prisma.gBPPrice.create({ data: { phoneId: allPhones[i].id, value: gbpPrice } })
            }
            if (indianPrice > 0) {
                await prisma.indianPrice.create({ data: { phoneId: allPhones[i].id, value: indianPrice } })
            }

            await prisma.phoneSpecs.createMany({ data: phoneSpecs, skipDuplicates: true })

            // console.log(j + Math.ceil(Math.random() * 20));

        }, 1000 * (j * 15))
    }
    // if (egpPrice) {
    //     await prisma.indianPrice.create({ data: { phoneId: currentPhone?.id, value: indianPrice } })
    // }
    // console.log(usdPrice, euroPrice, gbpPrice, indianPrice);

    ////
    // updateQuickSpecs(quick_spec)
    // updateCategories(spec_detail)
    // updateSpecs(spec_detail)

    // let json =
    // {
    //     title: title,
    //     img: img,
    //     img_url: img_url,
    //     spec_detail: spec_detail,
    //     quick_spec: quick_spec
    // }
    return { props: { name: 'trial' } }
}