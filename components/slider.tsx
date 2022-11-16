import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import { NewsType, ReviewType } from "../types";
import Link from "next/link";
import { Phone } from "@prisma/client";
import { useRouter } from "next/router";

export default function Slider({
    news, reviews, latestPhones }: {
        news: NewsType[], reviews: ReviewType[], latestPhones: Phone[]
    }) {
    // const lastReviews = reviews.filter((subject, i) => i < 4)
    const router = useRouter()
    return (
        <div className="my-10 grid grid-cols-4 lg:gap-x-8 gap-y-8 mx-5">
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper col-span-4 lg:col-span-3 max-w-full rounded-lg"
            >
                {reviews.map((slide, i) =>
                    <SwiperSlide key={i}>
                        <Link href={`https://www.gsmarena.com/${slide.link}`}>
                            <a className="relative text-center text-white" target='_blank'>
                                <img
                                    className="object-fill w-full lg:h-96"
                                    src={slide.imgUrl}
                                    alt="image slide 1"
                                />
                                <p className={`${router.asPath.includes('/ar') ? 'lg:right-4 right-1 lg:text-lg' : 'lg:left-4 left-1 lg:text-xl'} absolute bottom-2 bg-opacity-50 bg-gray-600 lg:p-5 p-2 text-sm font-semibold lg:text-xl`}>
                                    {slide.title}
                                    <br />
                                    <span className="text-sm">{slide.reviewDate}</span>
                                </p>
                                {/* <p className={`${router.asPath.includes('/ar') ? 'lg:right-4 right-1' : 'lg:left-4 left-1'} absolute bottom-1 bg-opacity-50 bg-gray-600 lg:p-5 p-2 text-sm font-semibold lg:text-sm`}>
                                    {slide.reviewDate}
                                </p> */}
                            </a>
                        </Link>
                    </SwiperSlide>
                )}
            </Swiper>
            <div className="col-span-4 lg:col-span-1 grid grid-cols-2 lg:block gap-x-4">
                <Link href={'/phonefinder'}>
                    <a className="relative text-white">
                        <img className='mb-8 object-fill w-full h-44 rounded-lg' src="https://m-cdn.phonearena.com/images/article/143138-wide-two_800/One-of-Twitters-most-accurate-tipsters-says-11-inch-iPad-Pro-will-not-sport-mini-LED-display.webp?1665982348" />
                        <div className="opacity-75 lg:hover:opacity-100">
                            <p className="absolute h-44 w-40 lg:w-full bottom-8 lg:bottom-0 bg-opacity-100 bg-gray-600 lg:px-24 py-[60px] rounded-lg font-semibold text-xl text-center">
                                {router.asPath.includes('/ar') ? 'ابحث عن تليفون' : "Phone Finder"}
                            </p>
                        </div>
                    </a>
                </Link>
                <Link href={'/compare'}>
                    <a className="relative text-white">
                        <img className='w-full object-fill h-44 rounded-lg' src="https://images.unsplash.com/photo-1614443656377-c04cbf4e1cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9iaWxlcGhvbmV8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                        <div className="opacity-75 lg:hover:opacity-100">
                            <p className="absolute h-44 w-40 lg:w-full bottom-8 lg:bottom-0 bg-opacity-100 bg-gray-600 lg:px-20 py-[60px] rounded-lg font-semibold text-xl text-center">
                                {router.asPath.includes('/ar') ? 'مقارنة' : "Phone Comparison"}
                            </p>
                        </div>
                    </a>
                </Link>
            </div>
            <div className="col-span-4 flex flex-col lg:flex-row rounded-lg border-white border p-3">
                <p className="text-white text-4xl font-semibold my-auto pb-5 text-center">
                    {router.asPath.includes('/ar') ? 'أحدث الأجهزة' : 'Latest Phones'}
                </p>
                <div className="max-w-full grid grid-cols-2 lg:flex lg:justify-evenly">
                    {latestPhones.map((phone, i) =>
                        <Link key={i} href={`/${phone.name}`} >
                            <a className={`text-white mx-5 py-3 ${i === 4 ? 'col-span-2 mx-auto' : ''}`}>
                                <img className='rounded-lg lg:w-44 lg:h-52 lg:max-w-md' src={phone.imgUrl} />
                                <p className="p-2 bottom-2 left-2 text-center">{phone.name}</p>
                            </a>
                        </Link>
                    )}
                </div>
            </div>

        </div>
    );
}