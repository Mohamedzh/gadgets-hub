import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Slider from '../components/slider'
import { prisma } from '../lib/db'
import News from '../components/news'
import { getLatestNews, getLatestReviews, getLatestReviewsPics } from '../lib/cheerio'
import { NewsType, ReviewType } from '../types'
import { Phone } from '@prisma/client'
import { v2 } from '@google-cloud/translate'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Home: NextPage = ({
  news, reviews, latestPhones }: {
    news?: NewsType[], reviews?: ReviewType[], latestPhones?: Phone[]
  }) => {
  const router = useRouter()
  const [arLang, setArLang] = useState<boolean>(false)
  useEffect(() => { if (router.asPath.includes('/ar')) { setArLang(true) } }, [router.asPath])

  return (
    <div className='bg-gray-900 container lg:mx-10 ar'>
      <Head>
        <title>Gadgets Hub</title>
        <meta name="description" content="Mobile phone database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {reviews && news && latestPhones &&
        <div>
          <Slider reviews={reviews} news={news} latestPhones={latestPhones} arLang={arLang} />
          <News news={news} arLang={arLang} />
        </div>
      }
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const latestPhones = await prisma.phone.findMany({ take: 5, orderBy: { id: 'desc' } })
  const news = await getLatestNews()
  const latestNews = news.filter((item, i) => i < 6)

  const reviews = await getLatestReviews()
  const latest = reviews.filter((subject, i) => i < 4)
  const modified = await getLatestReviewsPics(latest)


  async function transArabic(text: string, target: string) {
    const { Translate } = v2
    const projectId = 'gadgets-hub-368213';
    const credentials = JSON.parse(
      Buffer.from(process.env.TRANSLATE_KEY!, 'base64').toString()
    )
    const translate = new Translate({ projectId, credentials });
    const [translation] = await translate.translate(text, target);
    return translation
  }

  let arabicNews = []
  for (let i = 0; i < latestNews.length; i++) {
    let title = await transArabic(latestNews[i].title, 'ar')
    let newsDate = await transArabic(latestNews[i].newsDate, 'ar')
    arabicNews.push({ ...latestNews[i], title, newsDate })
  }
  // const arabicNews = latestNews.map(async (item) => {
  //   return {
  //     ...item,
  //     title: await transArabic(item.title, 'ar'),
  //     newsDate: await transArabic(item.newsDate, 'ar')
  //   }
  // })

  // const latestArabicNews = arabicNews

  let arabicReviews = []
  for (let i = 0; i < modified.length; i++) {
    let title = await transArabic(modified[i].title, 'ar')
    let reviewDate = await transArabic(modified[i].reviewDate, 'ar')
    arabicReviews.push({ ...modified[i], title, reviewDate })
  }

  // const arabicReviews = modified.map(async (item) => {
  //   return {
  //     ...item, title: await transArabic(item.title, 'ar')
  //   }
  // })

  // const latestArabicReviews = arabicReviews

  return { props: { news: arabicNews, reviews: arabicReviews, latestPhones }, revalidate: 28800 }
}
