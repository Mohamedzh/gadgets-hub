import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React from "react";
import CompareTable from "../../components/compare/compareTable";
import { prisma } from "../../lib/db";
import { ArCategory } from "../../types";

type Props = {
  categories: ArCategory[];
  allPhones: { name: string; imgUrl: string }[];
  quickSpecs: any[];
};

function Compare({ categories, quickSpecs }: Props) {
  return (
    <div>
      <CompareTable categories={categories} quickSpecs={quickSpecs} />
    </div>
  );
}

export default Compare;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const categories = await prisma.category.findMany({
      include: { specs: true },
    });
    const quickSpecs = await prisma.quickSpec.findMany();

    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "en")),
        categories,
        quickSpecs,
      },
    };
  } catch (error) {
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
