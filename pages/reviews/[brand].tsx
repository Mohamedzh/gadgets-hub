import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { prisma } from "../../lib/db";
import ReviewsPage from "../../components/brandReviewsPage";
import { Review } from "@prisma/client";
import Pagination from "../../components/reviews/reviewsPagination";
import { paginate } from "../../lib/functions";
import { ParsedUrlQuery } from "querystring";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

type Props = { reviews: Review[]; brand: string; count: number };

function Reviews({ reviews, brand, count }: Props) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const currentReviews = paginate(page, 30, reviews);

  useEffect(() => {
    setPageNo(Math.ceil(reviews.length / 30));
  }, []);

  return (
    <div className="flex flex-col">
      <div
        style={{
          backgroundImage: `url('https://fdn.gsmarena.com/imgroot/static/headers/reviews-hlr.jpg')`,
        }}
        className="text-black flex bg-cover mx-5 lg:mx-10 h-48 lg:h-72 rounded-xl mt-10 p-5 lg:p-10 text-5xl lg:text-7xl font-bold font-serif"
      >
        <p className="mt-auto">{t("reviews")}</p>
      </div>
      {reviews.length > 0 ? (
        <div>
          <ReviewsPage reviews={currentReviews} brand={brand} />
          <Pagination
            setPage={setPage}
            pageNo={pageNo}
            page={page}
            count={count}
          />
        </div>
      ) : (
        <div className="text-white text-center my-10 text-3xl">
          {t("noBrandReviewsMessage1")}
          <br></br>
          <br></br>
          <p className="text-xl">
            {t("noBrandReviewsMessage2")}{" "}
            <Link href="/reviews">
              <a className="underline text-blue-600 hover:text-blue-300">
                {t("noBrandReviewsMessage3")}
              </a>
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}

export default Reviews;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const brands = await prisma.brand.findMany({ select: { name: true } });
  let paths = [];
  if (locales) {
    for (let x = 0; x < brands.length; x++) {
      for (const locale of locales) {
        paths.push({ params: { brand: brands[x].name.toLowerCase() }, locale });
      }
    }
  }
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({
  params,
  locale,
}: {
  params?: ParsedUrlQuery;
  locale?: string;
}) => {
  let brand = params?.brand as string;

  let reviews;
  try {
    reviews = await prisma.review.findMany({
      where: { brandName: brand },
      select: { title: true, link: true, imgUrl: true, reviewDate: true },
    });

    const count = await prisma.review.aggregate({
      _count: { id: true },
    });
    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "en")),
        reviews,
        brand,
        count,
      },
      revalidate: 86400,
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
