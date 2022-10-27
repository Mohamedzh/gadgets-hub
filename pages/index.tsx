import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Slider from '../components/slider'
import { prisma } from '../lib/db'
import News from '../components/news'
import { getLatestNews, getLatestReviews } from '../lib/cheerio'
import { NewsType, ReviewType } from '../types'
import { Phone } from '@prisma/client'

const Home: NextPage = ({
  news, reviews, latestPhones }: {
    news?: NewsType[], reviews?: ReviewType[], latestPhones?: Phone[]
  }) => {
  return (
    <div className='bg-gray-900 container mx-10'>
      <Head>
        <title>Tech Advisor</title>
        <meta name="description" content="Mobile phone database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {reviews && news && latestPhones &&
        <div>
          <Slider reviews={reviews} news={news} latestPhones={latestPhones} />
          <News news={news} />
        </div>
      }
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const latestPhones = await prisma.phone.findMany({ take: 5, orderBy: { year: 'desc' } })
  const news = await getLatestNews()
  const reviews = await getLatestReviews()
  return { props: { news, reviews, latestPhones }, revalidate: 86400 }
}
