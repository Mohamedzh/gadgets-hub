import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { prisma } from '../../lib/db'
import ReviewsPage from '../../components/reviewsPage'
import wretch from 'wretch'
import { Review } from '@prisma/client'
import Pagination from '../../components/reviewsPagination'
import { paginate } from '../../lib/functions'
import { getLatestReviews } from '../../lib/cheerio'

type Props = { reviews: Review[] }

function Reviews({ reviews }: Props) {
    const [page, setPage] = useState(1)
    const [pageNo, setPageNo] = useState(1)
    const currentReviews = paginate(page, 30, reviews)

    useEffect(() => { setPageNo(Math.ceil(reviews.length / 30)) }, [])


    return (
        <div className='flex flex-col'>
            <div
                style={{ backgroundImage: `url('https://fdn.gsmarena.com/imgroot/static/headers/reviews-hlr.jpg')` }}
                className='text-black flex bg-cover mx-5 lg:mx-10 h-48 lg:h-72 rounded-xl mt-10 p-5 lg:p-10 text-5xl lg:text-7xl font-bold font-serif'>
                <p className='mt-auto'>Reviews</p>
            </div>
            {reviews.length > 0 &&
                <div>
                    <ReviewsPage reviews={currentReviews} />
                    <Pagination setPage={setPage} pageNo={pageNo} page={page} reviews={reviews} />
                </div>
            }
        </div>
    )
}

export default Reviews

export const getStaticProps: GetStaticProps = async () => {
    let reviews
    try {
        reviews = await prisma.review.findMany({ select: { title: true, link: true, imgUrl: true, reviewDate: true } })
        const brands = await prisma.brand.findMany({ select: { name: true } })

        let latestReviews = await getLatestReviews()
        await prisma.review.createMany({ data: latestReviews, skipDuplicates: true })

    } catch (error) {
        console.log(error)
    }

    return { props: { reviews }, revalidate: 86400 }
}