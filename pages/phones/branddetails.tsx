import axios from 'axios'
import { GetStaticProps } from 'next'
import React from 'react'
import * as cheerio from 'cheerio'
import { prisma } from '../../lib/db'
import { BrandPhone, Page, PageData } from '../../types'
import { getBrandsDetails, getPages } from '../../lib/cheerio'

function PhoneDetails({ allPhones }: { allPhones: any[] }) {

    return (
        <div>
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

    getBrandsDetails()
    return { props: {} }
}