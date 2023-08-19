import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import { NewsType, ReviewType } from "../../types";
import Link from "next/link";
import { Phone } from "@prisma/client";
import { useRouter } from "next/router";
import { englishLocale } from "../../lib/functions";
import { useTranslation } from "next-i18next";
import Image from "next/image";

export default function Slider({
  news,
  reviews,
  latestPhones,
}: {
  news: NewsType[];
  reviews: ReviewType[];
  latestPhones: Phone[];
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const imageRef = useRef();

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
        dir={englishLocale(router) ? "ltr" : "rtl"}
        key={router.locale}
        className="mySwiper col-span-4 lg:col-span-3 max-w-full rounded-lg"
      >
        {reviews.map((slide, i) => (
          <SwiperSlide key={i}>
            <Link href={`https://www.gsmarena.com/${slide.link}`}>
              <a className="relative text-center text-white" target="_blank">
                <div className="relative">
                  <Image
                    width={922}
                    height={384}
                    src={slide.imgUrl}
                    alt="image slide 1"
                  />
                </div>
                <p
                  className={`${
                    englishLocale(router)
                      ? "lg:left-4 left-1 lg:text-xl"
                      : "lg:right-4 right-1 lg:text-lg"
                  } absolute bottom-2 bg-opacity-50 bg-gray-600 lg:p-5 p-2 text-sm font-semibold lg:text-xl`}
                >
                  {slide.title}
                  <br />
                  <span className="text-sm">
                    {slide.reviewDate
                      .split(" ")
                      .map((char) => {
                        return t(char);
                      })
                      .join(" ")}
                  </span>
                </p>
                {/* <p className={`${arLang ? 'lg:right-4 right-1' : 'lg:left-4 left-1'} absolute bottom-1 bg-opacity-50 bg-gray-600 lg:p-5 p-2 text-sm font-semibold lg:text-sm`}>
                                    {slide.reviewDate}
                                </p> */}
              </a>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="col-span-4 lg:col-span-1 grid grid-cols-2 lg:block gap-x-4">
        <Link href={"/phonefinder"}>
          <a className="relative text-white block lg:mb-5">
            <Image
              height={190}
              width={300}
              className="rounded-lg"
              src="https://m-cdn.phonearena.com/images/article/143138-wide-two_800/One-of-Twitters-most-accurate-tipsters-says-11-inch-iPad-Pro-will-not-sport-mini-LED-display.webp?1665982348"
              alt="Phone finder"
            />
            <div className="absolute -top-1 left-0 w-full h-full bg-gray-600 bg-opacity-100 opacity-75 lg:hover:opacity-100 flex items-center justify-center rounded-lg">
              <p className="text-white font-semibold text-xl">
                {t("phoneFinder")}
              </p>
            </div>
          </a>
        </Link>
        <Link href={"/compare"}>
          <a className="relative text-white block lg:mt-5">
            <Image
              height={190}
              width={300}
              className="rounded-lg"
              src="https://images.unsplash.com/photo-1614443656377-c04cbf4e1cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9iaWxlcGhvbmV8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              alt="Phone finder"
            />
            <div className="absolute -top-1 left-0 w-full h-full bg-gray-600 bg-opacity-100 opacity-75 lg:hover:opacity-100 flex items-center justify-center rounded-lg">
              <p className="text-white font-semibold text-xl">
                {t("phoneComparison")}
              </p>
            </div>
          </a>
        </Link>
      </div>
      <div className="col-span-4 flex flex-col lg:flex-row rounded-lg border-white border p-3">
        <p className="text-white text-4xl font-semibold my-auto pb-5 text-center">
          {t("latestPhones")}
        </p>
        <div className="max-w-full grid grid-cols-2 lg:flex lg:justify-evenly">
          {latestPhones.map((phone, i) => (
            <Link key={i} href={`/${phone.name}`}>
              <a
                className={`text-white mx-5 py-3 ${
                  i === 4 ? "col-span-2 mx-auto" : ""
                }`}
              >
                <div className="relative">
                  <Image
                    height={208}
                    width={176}
                    className="rounded-lg "
                    src={phone.imgUrl}
                    alt="New phones"
                  />
                </div>
                <p className="p-2 bottom-2 left-2 text-center">{phone.name}</p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
