import { Phone } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { useTranslation } from "next-i18next";

type Props = {
  otherPhones: Phone[];
  arLang: boolean;
};

function SeeAlsoSection({ otherPhones, arLang }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      <p className="font-semibold text-xl text-gray-100">{t("seeAlso")}</p>
      <div className="grid grid-cols-4 lg:grid-cols-2">
        {otherPhones.map((phone, i) => (
          <Link href={`/${phone.name}`} key={i}>
            <a className="bg-white w-20 lg:w-28  m-4 p-3 border border-solid flex flex-col place-items-center transition duration-500 ease-in-out hover:scale-110 hover:opacity-75">
              <img className="" src={phone.imgUrl} />
              <p className="text-center text-sm my-auto font-semibold">
                {phone.name}
              </p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SeeAlsoSection;
