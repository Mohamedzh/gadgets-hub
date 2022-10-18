import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";

export default function Slider() {
    return (
        <div className="my-10 grid grid-cols-4 gap-x-8 gap-y-8">
            {/* <p className="text-3xl font-bold text-center">Latest Models</p> */}
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
                {Array.from(Array(3).keys()).map((slide, i) =>
                    <SwiperSlide key={i}>
                        <img
                            className="object-fill w-full h-96"
                            src="https://m-cdn.phonearena.com/images/article/143163-wide-two_800/Investment-firm-says-demand-for-the-basic-iPhone-14-is-modest-and-it-has-evidence-of-this.webp?1666074770"
                            alt="image slide 1"
                        />
                    </SwiperSlide>
                )}
            </Swiper>
            <div className="col-span-1">
                <img className='mb-8 w-full h-44 rounded-lg' src="https://m-cdn.phonearena.com/images/article/143138-wide-two_800/One-of-Twitters-most-accurate-tipsters-says-11-inch-iPad-Pro-will-not-sport-mini-LED-display.webp?1665982348" />
                <img className='h-44 rounded-lg' src="https://m-cdn.phonearena.com/images/article/143138-wide-two_800/One-of-Twitters-most-accurate-tipsters-says-11-inch-iPad-Pro-will-not-sport-mini-LED-display.webp?1665982348" />
            </div>
            {Array.from(Array(4)).map((img, i) =>
                <div key={i} className=''>
                    <img className='rounded-lg' src="https://fdn.gsmarena.com/imgroot/news/22/10/samsung-galaxy-s23-specs-leak/-344x215/gsmarena_000.jpg" />
                </div>
            )}
        </div>
    );
}