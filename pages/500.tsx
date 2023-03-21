import Component500 from "../components/page500";
import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Page500() {
  return (
    <div>
      <Component500 />
    </div>
  );
}

export default Page500;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
    },
  };
};
