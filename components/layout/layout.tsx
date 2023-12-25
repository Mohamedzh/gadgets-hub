import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"

function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-full">
      <SpeedInsights/>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
