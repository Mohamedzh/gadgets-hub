import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import { NewsType, ReviewType } from "../types";
import Link from "next/link";
import { Phone } from "@prisma/client";

export default function Slider({
    news, reviews, latestPhones }: {
        news: NewsType[], reviews: ReviewType[], latestPhones: Phone[]
    }) {
    const lastReviews = reviews.filter((subject, i) => i < 4)

    return (
        <div className="my-10 grid grid-cols-4 gap-x-8 gap-y-8">
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
                className="mySwiper col-span-3 max-w-full rounded-lg"
            >
                {lastReviews.map((slide, i) =>
                    <SwiperSlide key={i}>
                        <Link href={slide.link}>
                            <a className="relative text-center text-white">
                                <img
                                    className="object-fill w-full h-96"
                                    src={slide.imgUrl}
                                    alt="image slide 1"
                                />
                                <p className="absolute bottom-2 left-4 bg-opacity-50 bg-gray-600 p-5 text-xl">
                                    {slide.title}
                                </p>
                            </a>
                        </Link>
                    </SwiperSlide>
                )}
            </Swiper>
            <div className="col-span-1">
                <Link href={'/phonefinder'}>
                    <a className="relative text-white">
                        <img className='mb-8 object-fill w-full h-44 rounded-lg' src="https://m-cdn.phonearena.com/images/article/143138-wide-two_800/One-of-Twitters-most-accurate-tipsters-says-11-inch-iPad-Pro-will-not-sport-mini-LED-display.webp?1665982348" />
                        <div className="opacity-0 hover:opacity-100">
                            <p className="absolute bottom-0 bg-opacity-50 bg-gray-600 px-24 py-[60px] rounded-lg font-semibold text-xl text-center">Phone Finder</p>
                        </div>
                    </a>
                </Link>
                <Link href={'/compare'}>
                    <a className="relative text-white">
                        <img className='w-full object-fill h-44 rounded-lg' src="https://images.unsplash.com/photo-1614443656377-c04cbf4e1cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9iaWxlcGhvbmV8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60" />
                        <div className="opacity-0 hover:opacity-100">
                            <p className="absolute bottom-0 bg-opacity-50 bg-gray-600 px-20 py-[60px] rounded-lg font-semibold text-xl text-center">Phone Comparison</p>
                        </div>
                    </a>
                </Link>
            </div>
            <div className="col-span-4 flex rounded-lg border-white border p-3">
                <p className="text-white text-4xl font-semibold my-auto">
                    Latest Phones
                </p>
                {latestPhones.map((phone, i) =>
                    <Link href={`/${phone.name}`}>
                        <a key={i} className='text-white mx-5'>
                            <img className='rounded-lg' src={phone.imgUrl} />
                            <p className="p-2 bottom-2 left-2">{phone.name}</p>
                        </a>
                    </Link>
                )}
            </div>

        </div>
    );
}