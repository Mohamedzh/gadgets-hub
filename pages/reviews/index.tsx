import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import { prisma } from "../../lib/db";
import ReviewsPage from "../../components/reviews/reviewsPage";
import { Review } from "@prisma/client";
import Pagination from "../../components/reviews/reviewsPagination";
import { getReviewDate } from "../../lib/functions";
import { getLatestReviews } from "../../lib/cheerio";
import SearchBar from "../../components/reviews/reviewSearchBar";
import _ from "lodash";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from "axios";

type Props = {
  reviews: Review[];
  brands: { name: string }[];
  count: number;
};

function Reviews({ reviews, brands, count }: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(1);
  const [pageNo, setPageNo] = useState<number>(Math.ceil(count / 30));

  const [currentReviews, setCurrentReviews] = useState<Review[]>(reviews);

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
        <p className="mt-auto text-gray-200">{t("reviewsTitle")}</p>
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

  brands = await prisma.brand.findMany({ select: { name: true } });

  let latestReviews = await getLatestReviews();
  await prisma.review.createMany({ data: latestReviews, skipDuplicates: true });

  reviews = await prisma.review.findMany({
    orderBy: { id: "desc" },
    take: 30,
    select: { title: true, link: true, imgUrl: true, reviewDate: true },
  });

  reviews = reviews.map((review, i) => {
    return {
      ...review,
      newReviewDate: getReviewDate(review.reviewDate),
    };
  });

  const count = await prisma.review.aggregate({
    _count: { id: true },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
      reviews,
      count: count._count.id,
      brands,
    },
    revalidate: 86400,
  };
};
