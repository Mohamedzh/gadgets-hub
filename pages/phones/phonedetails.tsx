import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'

type QuickSpecs = {
    name: string
    value: string
}

type PhoneDetails = {
    title: string
    img: string
    spec_detail: SpecDetails[]
    quick_spec: QuickSpecs[]
}

type SpecList = {
    name: string
    value: string
}

type SpecDetails = {
    category: string
    specs: SpecList[]
}

function PhoneDetails({ json }: { json: PhoneDetails }) {
    return (
        <div>
            <div className='text-center'>
                <p className='text-3xl font-bold m-5'>
                    {json.title}
                </p>
                <img src={json.img} />
                <p className='text-3xl font-bold m-5'>
                    Quick Specs
                </p>
                {json.quick_spec.map((spec, idx) =>
                    <div className='grid grid-cols-2' key={idx}>
                        <p>{spec.name}</p>
                        <p>{spec.value}</p>
                    </div>
                )}
                <p className='text-3xl font-bold m-5'>Details</p>
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
    const res = await axios.get('https://www.gsmarena.com/apple_iphone_14_pro_max-11773.php')
    let html = res.data
    console.log(res.data);
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


    const title = $('.specs-phone-name-title').text()
    const img = $('.specs-photo-main a img').attr('src')
    const img_url = $('.specs-photo-main a').attr('href')

    const specNode = $('table')
    const spec_detail: SpecDetails[] = []
    specNode.each((i, el) => {
        const specList: SpecList[] = []
        const category = $(el).find('th').text()
        const specN = $(el).find('tr')
        specN.each((index, ele) => {
            const a = {
                name: $('td.ttl', ele).text(),
                value: $('td.nfo', ele).text()
            }
            specList.push(a)
        })
        if (category) {
            spec_detail.push({
                category: category,
                specs: specList
            })
        }
    })
    let json =
    {
        title: title,
        img: img,
        img_url: img_url,
        spec_detail: spec_detail,
        quick_spec: quick_spec
    }
    return { props: { name: 'trial', json } }
}