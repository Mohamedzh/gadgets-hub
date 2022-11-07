import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { prisma } from '../../lib/db'
import ReviewsPage from '../../components/reviewsPage'
import { Review } from '@prisma/client'
import Pagination from '../../components/reviewsPagination'
import { monthNumberFromString, paginate } from '../../lib/functions'
import { getLatestReviews } from '../../lib/cheerio'
import SearchBar from '../../components/reviewSearchBar'
import _ from 'lodash'

type Props = {
    reviews: Review[]
    brands: { name: string }[]
}

const getReviewDate = (date: string) => {
    if (date.indexOf('updated') !== -1) {
        let newDate = date.slice(date.indexOf('updated') + 9)
        let day = newDate.slice(0, newDate.indexOf(' '))
        if (day.length === 1) {
            day = '0' + day
        }
        let month = monthNumberFromString(newDate.slice(newDate.indexOf(' ') + 1, newDate.lastIndexOf(' '))).toString()
        let year = newDate.slice(newDate.lastIndexOf(' '))
        return Number(year + month + day)
    }
    let day = date.slice(0, date.indexOf(' '))
    if (day.length === 1) {
        day = '0' + day
    }
    let month = monthNumberFromString(date.slice(date.indexOf(' ') + 1, date.lastIndexOf(' '))).toString()
    let year = date.slice(date.lastIndexOf(' '))
    return Number(year + month + day)
}

function Reviews({ reviews, brands }: Props) {
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
                    <SearchBar brands={brands} />
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
    let brands

    brands = await prisma.brand.findMany({ select: { name: true } })

    let latestReviews = await getLatestReviews()
    await prisma.review.createMany({ data: latestReviews, skipDuplicates: true })

    reviews = await prisma.review.findMany({ select: { title: true, link: true, imgUrl: true, reviewDate: true } })

    reviews = reviews.map(review => {
        return {
            ...review, newReviewDate: getReviewDate(review.reviewDate)
        }
    })
    console.log(reviews);
    reviews = _.orderBy(reviews, 'newReviewDate', 'desc')

    return { props: { reviews, brands }, revalidate: 86400 }
}