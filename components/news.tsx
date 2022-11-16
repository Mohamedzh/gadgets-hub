import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { NewsType } from '../types'

type Props = {
    news: NewsType[]
}

function News({ news }: Props) {
    const router = useRouter()
    // const latestNews = news.filter((item, i) => i < 6)
    return (
        <div className='mb-10'>
            <p className='text-4xl font-semibold m-3 text-white'>
                {router.asPath.includes('/ar') ? 'آخر الأخبار' : 'Latest News'}
            </p>
            <div className='grid grid-cols-2 lg:grid-cols-3'>
                {news.map((item, i) =>
                    <Link key={i} href={`https://gsmarena.com/${item.link}`}>
                        <a target='_blank' className='m-3 flex flex-col'>
                            <img className='w-full' src={item.imgUrl} alt={item.imgAlt} />
                            <div className='text-white text-sm lg:text-base'>
                                {item.title} <br></br> {item.title.length < 45 && <br></br>}
                            </div>
                            <p className='text-white place-self-end text-xs lg:text-base'>
                                {item.newsDate}
                            </p>
                        </a>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default News