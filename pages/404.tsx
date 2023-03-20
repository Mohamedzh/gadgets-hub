import Component404 from "../components/page404";
import React from "react";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

function Page404() {
  return (
    <div>
      <Component404 />
    </div>
  );
}

export default Page404;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ? locale : "en")),
    },
  };
};
