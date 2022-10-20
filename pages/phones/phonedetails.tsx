import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { updateCategories, updateQuickSpecs, updateSpecs } from '../../lib/cheerio'
import { QuickSpecs, PhoneDetails, SpecDetail, Spec, PhoneSpec } from '../../types'


function PhoneDetails({ json, phoneSpecs }: { json: PhoneDetails, phoneSpecs: Spec[] }) {
    console.log(json);
    console.log(phoneSpecs);

    return (
        <div className='bg-white'>
            <div className='text-center'>
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
            </div>
        </div>
    )
}

export default PhoneDetails

export const getStaticProps: GetStaticProps = async () => {
    const currentPhone = await prisma.phone.findFirst({ where: { id: 5555 } })

    const res = await axios.get('https://www.gsmarena.com/apple_iphone_14_pro_max-11773.php')
    let html = res.data
    // console.log(res.data);
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

    ////
    // if (currentPhone) {
    //     let qSpecs = quick_spec.map(spec => { return { value: spec.value, phoneId: currentPhone.id, quickspecName: spec.name } })
    //     await prisma.phoneQuickSpecs.createMany({ data: qSpecs })
    // }
    ////
    const title = $('.specs-phone-name-title').text()
    const img = $('.specs-photo-main a img').attr('src')
    const img_url = $('.specs-photo-main a').attr('href')

    let allSpecs: Spec[] = []

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
            allSpecs.push(a)
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
            value: spec.value, specAlias: spec.alias, phoneId: (currentPhone ? currentPhone.id : 0)
        }
    })

    await prisma.phoneSpecs.createMany({ data: phoneSpecs, skipDuplicates: true })
    ////
    // updateQuickSpecs(quick_spec)
    // updateCategories(spec_detail)
    // updateSpecs(spec_detail)

    let json =
    {
        title: title,
        img: img,
        img_url: img_url,
        spec_detail: spec_detail,
        quick_spec: quick_spec
    }
    return { props: { name: 'trial', json, phoneSpecs } }
}