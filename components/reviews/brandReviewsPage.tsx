import { Review } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";
import { englishLocale } from "../../lib/functions";
import { useRouter } from "next/router";

type Props = {
  reviews: Review[];
  brand: string;
};

function ReviewsPage({ reviews, brand }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  let newBrand = brand.split("")[0].toUpperCase() + brand.slice(1);
  return (
    <div>
      <p
        className={`text-gray-200 text-3xl mt-5 ${
          englishLocale(router) ? "text-left" : "text-right"
        } mx-5 lg:mx-10`}
      >
        {newBrand} {t("brandReviews")}
      </p>
      <div className="max-w-max m-5 text-white grid grid-cols-2 lg:grid-cols-3 mx-auto">
        {reviews.map((review, i) => (
          <div key={i} className="flex flex-col m-5 ">
            <Link href={review.link}>
              <a>
                <img className="rounded-lg mx-auto" src={review.imgUrl} />
              </a>
            </Link>
            <p
              className={`text-center lg:text-xl my-1 ${
                review.title.length > 35 ? "text-sm" : ""
              }`}
            >
              {review.title}
              <br></br> {review.title.length < 40 && <br></br>}
            </p>
            <p className="text-end text-xs lg:text-sm lg:mr-10">
              {review.reviewDate
                .split(" ")
                .map((char) => {
                  return t(char);
                })
                .join(" ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
