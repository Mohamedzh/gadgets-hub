import { Review } from '@prisma/client'
import Link from 'next/link'
import React from 'react'

type Props = {
    reviews: Review[]
}

function ReviewsPage({ reviews }: Props) {
    return (
        <div className='max-w-max m-5 text-white grid grid-cols-3 mx-auto'>
            {reviews.map((review, i) =>
                <div key={i} className='flex flex-col m-5 '>
                    <Link href={review.link}>
                        <a>
                            <img className='rounded-lg mx-auto' src={review.imgUrl} />
                        </a>
                    </Link>
                    <p className='text-center text-xl my-1'>{review.title}</p>
                    <p className='text-end text-sm mr-10'>{review.reviewDate}</p>
                </div>
            )}
        </div>
    )
}

export default ReviewsPage