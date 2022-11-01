import { GetStaticProps } from 'next'
import React from 'react'
import { getAllPhonesDetails } from '../../lib/cheerio'
import { QuickSpecs, SpecDetail, Spec, PhoneSpec } from '../../types'
import { prisma } from '../../lib/db'


function PhoneDetails() {

    return (
        <div className='bg-white'>
            <div> Testing scraping specs to DB</div>
        </div>
    )
}

export default PhoneDetails

export const getStaticProps: GetStaticProps = async () => {
    const allPhones = await prisma.phone.findMany()

    getAllPhonesDetails(1800, allPhones.length, allPhones)

    return { props: {} }
}