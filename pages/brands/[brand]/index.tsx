import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";
import { prisma } from "../../../lib/db";
import { ParsedUrlQuery } from "querystring";
import PhoneFilter from "../../../components/phonesFilters/phoneFilter";
import _ from "lodash";
import { PhoneWithPrice } from "../../../types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export type PhoneSummary = {
  name: string;
  imgUrl: string;
  brandName: string;
};

function PhoneDetails({
  phones,
  brand,
  arabicBrandName,
}: {
  phones: PhoneWithPrice[];
  brand: string;
  arabicBrandName: string;
}) {
  return (
    <div>
      <PhoneFilter
        phones={phones}
        brand={brand}
        arabicBrandName={arabicBrandName}
      />
    </div>
  );
}

export default PhoneDetails;

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
  let newBrand = params?.brand as string;
  let phones = await prisma.phone.findMany({ where: { brandName: newBrand } });
  let arabicBrandName = await prisma.brand.findFirst({
    where: { name: newBrand },
    select: { arabicName: true },
  });

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
      phones,
      brand: params?.brand,
      arabicBrandName: arabicBrandName?.arabicName,
    },
    revalidate: 172800,
  };
};
