import { GetStaticProps } from 'next'
import React from 'react'
import { prisma } from '../lib/db'
import * as cheerio from 'cheerio'
import axios from 'axios'
import NewsPage from '../components/newsPage'
import { getLatestNews } from '../lib/cheerio'

type Props = {
    news: any[]
}

function News({ news }: Props) {
    return (
        <div className='mx-10'>
            <div
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')` }}
                className='text-slate-900 flex bg-no-repeat bg-[length:1269px_288px] lg:h-72 rounded-xl mt-10 py-10 px-10 text-7xl font-bold font-serif'>
                <p className='mt-auto'>News</p>
            </div>
            <NewsPage news={news} />
        </div>
    )
}

export default News

export const getStaticProps: GetStaticProps = async () => {

    const news = await getLatestNews()
    try {
    } catch (error) {
        console.log(error)
    }

    return { props: { news } }
}