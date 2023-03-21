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
  try {
    const categories = await prisma.category.findMany({
      include: { specs: true },
    });
    const quickSpecs = await prisma.quickSpec.findMany();
    // allPhones = await prisma.phone.findMany({ include: { PhoneSpecs: { include: { spec: { include: { category: true } } } }, PhoneQuickSpecs: true } })
    const allPhones = await prisma.phone.findMany({
      select: { name: true, imgUrl: true },
    });
    return {
      props: {
        ...(await serverSideTranslations(locale ? locale : "en")),
        categories,
        allPhones,
        quickSpecs,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
