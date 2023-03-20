import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "next-i18next";

type Props = {
  news: any[];
};

function NewsPage({ news }: Props) {
  const { t } = useTranslation();
  return (
    <div className="my-5 pt-5">
      {news.map((subject, i) => (
        <div
          key={i}
          className="grid grid-cols-3 my-5 pt-7 border-white rounded-lg border p-2"
        >
          <div className="col-span-3 lg:col-span-1 mx-3">
            <img
              className="lg:w-80 lg:h-80"
              src={subject.imgUrl}
              alt={subject.alt}
            />
          </div>
          <div className="col-span-3 lg:col-span-1 flex-col flex text-white">
            <p className="my-3 text-2xl">{subject.title}</p>
            <div>{subject.body}</div>
            <p className="self-end">{subject.newsDate}</p>
            <Link
              href={`news/${subject.link.slice(
                0,
                subject.link.indexOf(".php")
              )}`}
            >
              <a
                target="_blank"
                // onClick={() => router.push(`https://www.gsmarena.com/${subject.link}`)}
                className={`bg-white my-5 text-xl text-center pt-1 hover:bg-gray-700 hover:text-gray-50 text-gray-800 w-40 h-10 font-semibold rounded-lg self-center`}
              >
                {t("readMore")}
              </a>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewsPage;
