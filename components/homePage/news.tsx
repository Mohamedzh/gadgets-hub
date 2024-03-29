import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";
import { NewsType } from "../../types";
import { englishLocale } from "../../lib/functions";
import { useRouter } from "next/router";
import Image from "next/image";

type Props = {
  news: NewsType[];
  arNews: NewsType[];
};

function News({ news, arNews }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="mb-10">
      <p className="text-4xl font-semibold m-3 text-white">{t("latestNews")}</p>
      <div className="grid grid-cols-2 lg:grid-cols-3">
        {(englishLocale(router) ? news : arNews).map((item, i) => (
          <Link key={i} href={`https://gsmarena.com/${item.link}`}>
            <a target="_blank" className="m-3 flex flex-col">
              <div className="relative">
                <Image
                  width={400}
                  height={300}
                  src={item.imgUrl}
                  alt={item.imgAlt}
                />
              </div>
              <div className="text-white text-sm lg:text-base">
                {item.title} <br></br> {item.title.length < 45 && <br></br>}
              </div>
              <p className="text-white place-self-end text-xs lg:text-base">
                {item.newsDate
                  .split(" ")
                  .map((char) => {
                    return t(char);
                  })
                  .join(" ")}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default News;
