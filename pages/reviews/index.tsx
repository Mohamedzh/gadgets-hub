import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { prisma } from "../../lib/db";
import ReviewsPage from "../../components/reviews/reviewsPage";
import Pagination from "../../components/reviews/reviewsPagination";
import { englishLocale, getReviewDate } from "../../lib/functions";
import { getLatestReviews } from "../../lib/cheerio";
import SearchBar from "../../components/reviews/reviewSearchBar";
import _ from "lodash";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from "axios";
import { googleTranslateApiArray } from "../../lib/translationsAPI";
import { ReviewType } from "../../types";
import { useRouter } from "next/router";

type Props = {
  reviews: ReviewType[];
  brands: { name: string }[];
  count: number;
};

function Reviews({ reviews, brands, count }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(Math.ceil(count / 30));

  const [currentReviews, setCurrentReviews] = useState<ReviewType[]>(reviews);

  const getCurrentRevs = async (page: number) => {
    const res = await axios.get(`/api/reviewsPage?page=${page}`);
    setCurrentReviews(res.data);
  };

  useEffect(() => {
    getCurrentRevs(page);
  }, [page]);

  return (
    <div className="flex flex-col">
      <div
        style={{
          backgroundImage: `url('https://fdn.gsmarena.com/imgroot/static/headers/reviews-hlr.jpg')`,
        }}
        className="text-black flex bg-cover mx-5 lg:mx-10 h-48 lg:h-72 rounded-xl mt-10 p-5 lg:p-10 text-5xl lg:text-7xl font-bold font-serif"
      >
        <p
          className={`${
            englishLocale(router) ? "text-gray-800" : "text-gray-200"
          } mt-auto `}
        >
          {t("reviewsTitle")}
        </p>
      </div>
      {reviews.length > 0 && (
        <div>
          <SearchBar brands={brands} />
          <ReviewsPage reviews={currentReviews} />
          <Pagination
            setPage={setPage}
            pageNo={pageNo}
            page={page}
            count={count}
          />
        </div>
      )}
    </div>
  );
}

export default Reviews;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let reviews;
  let brands;

  try {
    brands = await prisma.brand.findMany({ select: { name: true } });

    let latestReviews = await getLatestReviews();
    await prisma.review.createMany({
      data: latestReviews,
      skipDuplicates: true,
    });

    reviews = await prisma.review.findMany({
      orderBy: { id: "desc" },
      take: 30,
      select: { title: true, link: true, imgUrl: true, reviewDate: true },
    });
    const reviewTitles = reviews.map((review) => review.title);
    const translatedTitle = await googleTranslateApiArray(reviewTitles);

    let arReviews: ReviewType[] = [];
    for (let y = 0; y < reviews.length; y++) {
      arReviews.push({
        ...reviews[y],
        newReviewDate: getReviewDate(reviews[y].reviewDate),
        arTitle: translatedTitle[y],
      });
    }

    const count = await prisma.review.aggregate({
      _count: { id: true },
    });

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "en")),
        reviews: arReviews,
        count: count._count.id,
        brands,
      },
      revalidate: 172800,
    };
  } catch (error) {
    console.log(error)
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
