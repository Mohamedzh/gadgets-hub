import React, { useEffect, useState } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import { prisma } from '../../lib/db'
import ReviewsPage from '../../components/brandReviewsPage'
import { Review } from '@prisma/client'
import Pagination from '../../components/reviewsPagination'
import { paginate } from '../../lib/functions'
import { ParsedUrlQuery } from 'querystring'
import Link from 'next/link'

type Props = { reviews: Review[], brand: string }

function Reviews({ reviews, brand }: Props) {
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
            {reviews.length > 0 ?
                <div>
                    <ReviewsPage reviews={currentReviews} brand={brand} />
                    <Pagination setPage={setPage} pageNo={pageNo} page={page} reviews={reviews} />
                </div> :
                <div className='text-white text-center my-10 text-3xl'>
                    No reviews matching the selected brand
                    <br></br>
                    Go back to <Link href='/reviews'><a className='underline text-blue-600 hover:text-blue-300'>all reviews</a></Link>
                </div>
            }
        </div>
    )
}

export default Reviews

export const getStaticPaths: GetStaticPaths = async () => {
    const brands = await prisma.brand.findMany({ select: { name: true } })
    const paths = brands.map(brand => ({
        params: { brand: brand.name.toLowerCase() }
    }))
    return { paths, fallback: true }
}


export const getStaticProps: GetStaticProps = async ({ params }: { params?: ParsedUrlQuery }) => {
    let brand = params?.brand as string

    let reviews
    try {
        reviews = await prisma.review.findMany({ where: { brandName: brand }, select: { title: true, link: true, imgUrl: true, reviewDate: true } })
    } catch (error) {
        console.log(error)
    }

    return { props: { reviews, brand }, revalidate: 86400 }
}