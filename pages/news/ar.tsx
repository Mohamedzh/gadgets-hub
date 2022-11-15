import { GetStaticProps } from 'next'
import React from 'react'
import NewsPage from '../../components/newsPage'
import { getLatestNews } from '../../lib/cheerio'
const { Translate } = require('@google-cloud/translate').v2;


type Props = {
    news: any[]
}

function News({ news }: Props) {
    return (
        <div className='mx-10 ar'>
            <div
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')` }}
                className='text-slate-900 flex bg-no-repeat bg-[length:1269px_288px] lg:h-72 rounded-xl mt-10 py-10 px-10 text-7xl font-bold font-serif'>
                <p className='mt-auto'>الأخبار</p>
            </div>
            <NewsPage news={news} />
        </div>
    )
}

export default News

export const getStaticProps: GetStaticProps = async () => {

    async function transArabic(text: string, target: string) {
        const projectId = 'gadgets-hub-368213';
        const credentials = JSON.parse(
            Buffer.from(process.env.TRANSLATE_KEY!, 'base64').toString()
        )
        // Instantiates a client
        const translate = new Translate({ projectId, credentials });
        const [translation] = await translate.translate(text, target);
        // console.log(`Text: ${text}`);
        // console.log(`Translation: ${translation}`);
        return translation
    }


    let news = await getLatestNews()

    let arNews = []

    for (let i = 0; i < news.length; i++) {
        let item = {
            ...news[i],
            title: await transArabic(news[i].title, 'ar'),
            body: await transArabic(news[i].body, 'ar'),
            newsDate: await transArabic(news[i].newsDate, 'ar')
        }
        arNews.push(item)
    }

    return { props: { news: arNews }, revalidate: 28800 }
}