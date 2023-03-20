import { QuickSpec } from "@prisma/client";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import CompareTable from "../../components/compare/compareTable";
import { prisma } from "../../lib/db";
import { ArCategory, DetailedCategory, DetailedPhone } from "../../types";

type Props = {
  categories: ArCategory[];
  allPhones: { name: string; imgUrl: string }[];
  quickSpecs: any[];
};

function Compare({ categories, allPhones, quickSpecs }: Props) {
  return (
    <div>
      <CompareTable
        categories={categories}
        allPhones={allPhones}
        quickSpecs={quickSpecs}
      />
    </div>
  );
}

export default Compare;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let categories;
  let allPhones;
  let quickSpecs;
  try {
    categories = await prisma.category.findMany({ include: { specs: true } });
    quickSpecs = await prisma.quickSpec.findMany();
    // allPhones = await prisma.phone.findMany({ include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
    allPhones = await prisma.phone.findMany({
      select: { name: true, imgUrl: true },
    });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
      categories,
      allPhones,
      quickSpecs,
    },
  };
};
