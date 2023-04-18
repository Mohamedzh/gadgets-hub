import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";
import { NewsType } from "../../types";
import { useRouter } from "next/router";
import { englishLocale } from "../../lib/functions";
import Image from "next/image";

type Props = {
  news: NewsType[];
  arabicNews: NewsType[];
};

function NewsPage({ news, arabicNews }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div className="my-5 pt-5">
      {(englishLocale(router) ? news : arabicNews).map((subject, i) => (
        <div
          key={i}
          className="grid grid-cols-3 my-5 py-7 border-white rounded-lg border p-2"
        >
          <div className="relative col-span-3 lg:col-span-1 mx-3">
            <Image
              layout="fill"
              className="lg:w-80 lg:h-80 rounded-lg"
              src={subject.imgUrl}
              alt={subject.imgAlt}
            />
          </div>
          <div className="col-span-3 lg:col-span-2 flex-col flex justify-items-center text-white">
            <p className="my-3 text-2xl text-center">{subject.title}</p>
            <div>{subject.body}</div>
            <p className="self-end">
              {subject.newsDate
                .split(" ")
                .map((char) => {
                  return t(char);
                })
                .join(" ")}
            </p>
            {/* <Link
              href={`news/${subject.link.slice(
                0,
                subject.link.indexOf(".php")
              )}`}
            > */}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.gsmarena.com/${subject.link}`}
              className={`bg-white my-5 text-xl text-center pt-1 hover:bg-gray-700 hover:text-gray-50 text-gray-800 w-40 h-10 font-semibold rounded-lg self-center`}
            >
              {t("readMore")}
            </a>
            {/* </Link> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default NewsPage;
