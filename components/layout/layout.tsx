import { useRouter } from "next/router";
import React, { ReactNode } from "react";
import Footer from "./footer";
import Navbar from "./navbar";

function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-full">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default Layout;
