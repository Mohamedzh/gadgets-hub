import { useRouter } from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import ArabicNavbar from "./arabicNavbar";
import ArabicFooter from "./arabicFooter";

function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-full">
      {router.asPath.includes("/ar") ? <ArabicNavbar /> : <Navbar />}
      <main>{children}</main>
      {router.asPath.includes("/ar") ? <ArabicFooter /> : <Footer />}
    </div>
  );
}

export default Layout;
