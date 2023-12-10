import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Slider from "../components/homePage/slider";
import { prisma } from "../lib/db";
import News from "../components/homePage/news";
import {
  getLatestNews,
  getLatestReviews,
  getLatestReviewsPics,
} from "../lib/cheerio";
import { NewsType, ReviewType } from "../types";
import { Phone } from "@prisma/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { microsoftTranslator } from "../lib/rapidAPITranslation";
import { translate } from "@vitalets/google-translate-api";

const Home: NextPage = ({
  news,
  arNews,
  reviews,
  latestPhones,
}: {
  news?: NewsType[];
  arNews?: NewsType[];
  reviews?: ReviewType[];
  latestPhones?: Phone[];
}) => {
  return (
    <div className="bg-gray-900 container lg:mx-10">
      <Head>
        <title>Gadgets Hub</title>
        <meta name="description" content="Mobile phone database" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {reviews && news && latestPhones && arNews && (
        <div>
          <Slider reviews={reviews} news={news} latestPhones={latestPhones} />
          <News news={news} arNews={arNews} />
        </div>
      )}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const latestPhones = await prisma.phone.findMany({
      take: 5,
      orderBy: { id: "desc" },
    });
    ///
    const { text } = await translate("Привет, мир! Как дела?", { to: "en" });
    console.log(text);
    ///
    const news = await getLatestNews();
    const latestNews = news.filter((item, i) => i < 6);
    const latestArNews: NewsType[] = [];
    for (let x = 0; x < latestNews.length; x++) {
      latestArNews.push({
        ...latestNews[x],
        title: await microsoftTranslator(latestNews[x].title),
      });
    }

    const reviews = await getLatestReviews();
    const latest = reviews.filter((subject, i) => i < 4);
    const modified = await getLatestReviewsPics(latest);

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "en")),
        news: latestNews,
        arNews: latestArNews,
        reviews: modified,
        latestPhones,
      },
      revalidate: 43200,
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
