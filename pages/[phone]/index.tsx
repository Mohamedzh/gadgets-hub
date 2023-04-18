import { Phone } from "@prisma/client";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import Loading from "../../components/loading";
import PhoneDetails from "../../components/phoneDetails/phoneDetails";
import { prisma } from "../../lib/db";
import { DetailedPhoneType } from "../../types";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getPhoneDetails } from "../../lib/phoneDetails";

type Props = {
  otherPhones: Phone[];
  current: DetailedPhoneType;
};

function Index({ otherPhones, current }: Props) {
  const router = useRouter();
  if (router.isFallback) {
    return <Loading />;
  }
  return (
    <div>
      <PhoneDetails current={current} otherPhones={otherPhones} />
    </div>
  );
}

export default Index;

// export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
//   const brands = await prisma.brand.findMany({
//     where: {
//       OR: [{ name: "apple" }, { name: "samsung" }],
//     },
//     include: { phones: { select: { name: true } } },
//   });

//   let paths = [];
//   // let paths: { params: { phone: string } }[] = [];
//   if (locales) {
//     for (let i = 0; i < brands.length; i++) {
//       for (let j = 0; j < brands[i].phones.length; j++) {
//         for (const locale of locales) {
//           paths.push({ params: { phone: brands[i].phones[j].name }, locale });
//         }
//       }
//     }
//     // paths = brands[i].phones.map(phone => {
//     //     return {
//     //         params: { phone: phone.name }
//     //     }
//     // })
//   }

//   return { paths, fallback: true };
// };

// export const getStaticProps: GetStaticProps = async ({
//   params,
//   locale,
// }: {
//   params?: ParsedUrlQuery;
//   locale?: string;
// }) => {
//   let currentPhone:
//     | (Phone & {
//         PhoneSpecs: (PhoneSpecs & { spec: Spec & { category: Category } })[];
//         PhoneQuickSpecs: PhoneQuickSpecs[];
//       })
//     | null = null;
//   let categories: (Category & { specs: Spec[] })[] = [];
//   let otherPhones: Phone[] = [];
//   try {
//     let newPhone = params?.phone as string;
//     // newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
//     currentPhone = await prisma.phone.findFirst({
//       where: { name: newPhone },
//       include: {
//         PhoneSpecs: { include: { spec: { include: { category: true } } } },
//         PhoneQuickSpecs: true,
//       },
//     });
//     if (!currentPhone) {
//       return { notFound: true };
//     }
//     otherPhones = await prisma.phone.findMany({
//       where: { brandName: currentPhone?.brandName },
//       take: 4,
//       skip: 1,
//       cursor: { id: currentPhone?.id },
//       orderBy: { id: "desc" },
//     });

//     categories = await prisma.category.findMany({ include: { specs: true } });
//   } catch (error) {
//     console.log(error);
//   }

//   return {
//     props: {
//       ...(await serverSideTranslations(locale ? locale : "en")),
//       phone: params?.phone,
//       currentPhone,
//       categories,
//       otherPhones,
//     },
//     revalidate: 604800,
//   };
// };

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let newPhone = context.params?.phone as string;

    const currentPhone = await prisma.phone.findFirst({
      where: { name: newPhone },
    });
    if (!currentPhone) {
      return { notFound: true };
    }
    setTimeout(() => {}, 2000);
    const current = await getPhoneDetails(currentPhone.url);
    // newPhone = newPhone.slice(0, 1).toUpperCase() + params?.phone?.slice(1)
    if (!currentPhone) {
      return { notFound: true };
    }
    const otherPhones = await prisma.phone.findMany({
      where: { brandName: currentPhone?.brandName },
      take: 4,
      skip: 1,
      cursor: { id: currentPhone?.id },
      orderBy: { id: "desc" },
    });

    return {
      props: {
        ...(await serverSideTranslations(
          context.locale ? context.locale : "en"
        )),
        phone: context.params?.phone,
        currentPhone,
        otherPhones,
        current,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: { destination: "/500", permanent: false },
    };
  }
};
