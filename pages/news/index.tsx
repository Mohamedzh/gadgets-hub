import { GetStaticProps } from "next";
import React from "react";
import NewsPage from "../../components/news/newsPage";
import { getLatestNews } from "../../lib/cheerio";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { googleTranslateApiArray } from "../../lib/translationsAPI";
import { NewsType } from "../../types";

type Props = {
  news: NewsType[];
  arabicNews: NewsType[];
};

function News({ news, arabicNews }: Props) {
  const { t } = useTranslation();

  return (
    <div className="mx-10">
      <div
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')`,
        }}
        className="text-slate-900 flex bg-no-repeat bg-[length:1269px_288px] lg:h-72 rounded-xl mt-10 py-10 px-10 text-7xl font-bold font-serif"
      >
        <p className="mt-auto">{t("news")}</p>
      </div>
      <NewsPage news={news} arabicNews={arabicNews} />
    </div>
  );
}

export default News;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const news = await getLatestNews();
  const arabicNews: NewsType[] = [];
  const newsBody = news.map((item) => item.body);
  const newsTitle = news.map((item) => item.title);
  const translatedBody = await googleTranslateApiArray(newsBody);
  const translatedTitle = await googleTranslateApiArray(newsTitle);
  for (let i = 0; i < news.length; i++) {
    arabicNews.push({
      ...news[i],
      // title: await googleTranslateApi(news[i].title),
      // body: await googleTranslateApi(news[i].body),
      title: translatedTitle[i],
      body: translatedBody[i],
    });
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
      news,
      arabicNews,
    },
    revalidate: 86400,
  };
};
