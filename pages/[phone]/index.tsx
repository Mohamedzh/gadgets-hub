import {
  Category,
  Phone,
  PhoneQuickSpecs,
  PhoneSpecs,
  Spec,
} from "@prisma/client";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Loading from "../../components/loading";
import PhoneDetails from "../../components/phoneDetails/phoneDetails";
import { prisma } from "../../lib/db";
import { DetailedCategory } from "../../types";

type Props = {
  currentPhone?: any;
  categories: DetailedCategory[];
  otherPhones: Phone[];
};

function Index({ currentPhone, categories, otherPhones }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [arLang, setArLang] = useState<boolean>(false);
  useEffect(() => {
    if (router.asPath.includes("/ar")) {
      setArLang(true);
    }
  }, [router.asPath]);

  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <div>
      <PhoneDetails
        currentPhone={currentPhone}
        categories={categories}
        otherPhones={otherPhones}
        arLang={arLang}
      />
    </div>
  );
}

export default Index;

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const brands = await prisma.brand.findMany({
    where: {
      OR: [{ name: "apple" }, { name: "samsung" }],
    },
    include: { phones: { select: { name: true } } },
  });

  let paths = [];
  // let paths: { params: { phone: string } }[] = [];
  if (locales) {
    for (let i = 0; i < brands.length; i++) {
      for (let j = 0; j < brands[i].phones.length; j++) {
        for (const locale of locales) {
          paths.push({ params: { phone: brands[i].phones[j].name }, locale });
        }
      }
    }
    // paths = brands[i].phones.map(phone => {
    //     return {
    //         params: { phone: phone.name }
    //     }
    // })
  }

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({
  params,
}: {
  params?: ParsedUrlQuery;
}) => {
  let currentPhone:
    | (Phone & {
        PhoneSpecs: (PhoneSpecs & { spec: Spec & { category: Category } })[];
        PhoneQuickSpecs: PhoneQuickSpecs[];
      })
    | null = null;
  let categories: (Category & { specs: Spec[] })[] = [];
  let otherPhones: Phone[] = [];
  try {
    let newPhone = params?.phone as string;
    // newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
    currentPhone = await prisma.phone.findFirst({
      where: { name: newPhone },
      include: {
        PhoneSpecs: { include: { spec: { include: { category: true } } } },
        PhoneQuickSpecs: true,
      },
    });
    if (!currentPhone) {
      return { notFound: true };
    }
    otherPhones = await prisma.phone.findMany({
      where: { brandName: currentPhone?.brandName },
      take: 4,
      skip: 1,
      cursor: { id: currentPhone?.id },
      orderBy: { id: "desc" },
    });

    categories = await prisma.category.findMany({ include: { specs: true } });
  } catch (error) {
    console.log(error);
  }

  return {
    props: { phone: params?.phone, currentPhone, categories, otherPhones },
    revalidate: 604800,
  };
};
