import axios from "axios"
import * as cheerio from 'cheerio'
import { Page, PageData, QuickSpecs, SpecDetail } from "../types"
import { prisma } from './db'

export const getPages = async (url: string) => {
    const res = await axios.get(`https://www.gsmarena.com/${url}.php`)
    let html = res.data

    const $ = cheerio.load(html)
    ////
    const pagesData: { number: number }[] = []
    const pages = $('.review-nav .nav-pages').find('a, strong')
    pages.each((i, el) => {
        const page: Page = {
            number: parseInt($(el).text()),
        }
        if (el.name !== 'strong') {
            page.url = $(el).attr('href')?.replace('.php', '')
        } else {

            page.url = `${url}`

            page.active = true
        }
        pagesData.push(page)
    })

    let nextPage = $('a.pages-next').attr('href')
    if (nextPage) {
        if (nextPage.indexOf('#') >= 0) {
            nextPage = ''
        } else {
            nextPage = nextPage.replace('.php', '')
        }
    }

    let prevPage = $('a.pages-prev').attr('href')
    if (prevPage) {
        if (prevPage.indexOf('#') >= 0) {
            prevPage = ''
        } else {
            prevPage = prevPage.replace('.php', '')
        }
    }

    const data: PageData = {
        prev: "",
        next: "",
        pages: []
    }

    if (prevPage) {
        data.prev = prevPage
    }
    if (nextPage) {
        data.next = nextPage
    }

    if (pagesData.length) {
        data.pages = pagesData
    }

    console.log(data.pages)
    return data
}

//Create/update quickspecs in the db
export const updateQuickSpecs = async (quick_spec: QuickSpecs[]) => {
    let qSpecs = quick_spec.map(spec => {
        return { name: spec.name }
    })
    await prisma.quickSpec.createMany({ data: qSpecs, skipDuplicates: true })
}

//Create/ update categories in the db
export const updateCategories = async (spec_detail: SpecDetail[]) => {
    for (let i = 0; i < spec_detail.length; i++) {
        await prisma.category.create({ data: { name: spec_detail[i].category } })
    }
}

//Create/update specs in the db
export const updateSpecs = async (spec_detail: SpecDetail[]) => {
    let newSpecs: { name: string, categoryName: string, alias: string }[] = []
    for (let i = 0; i < spec_detail.length; i++) {
        spec_detail[i].specs.map(spec => newSpecs.push({
            name: spec.name,
            categoryName: spec_detail[i].category,
            alias: spec.alias
        }))
    }
    await prisma.spec.createMany({ data: newSpecs, skipDuplicates:true })
}