import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/20/solid";
import {
  Bars4Icon,
  BookmarkSquareIcon,
  BookOpenIcon,
  RssIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { englishLocale } from "../lib/functions";

const links = [
  { title: "news", href: "/news", icon: BookOpenIcon },
  {
    title: "reviews",
    href: "/reviews",
    icon: Bars4Icon,
  },
  {
    title: "brands",
    href: "/brands",
    icon: BookmarkSquareIcon,
  },
  {
    title: "phoneFinder",
    href: "/phonefinder",
    icon: RssIcon,
  },
];

export default function Page500() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="bg-gray-900 min-h-[66vh]">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 pt-6">
          <img
            className="mx-auto h-12 w-auto"
            src="/mobileLogo.png"
            alt="Gadgets Hub"
          />
        </div>
        <div className="mx-auto max-w-xl py-10 sm:py-20">
          <div className="text-center">
            <p className="text-3xl font-semibold text-indigo-400">500</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {t("page404:internalServerErrorMsg1")}
            </h1>
            <p className="mt-2 text-lg text-gray-200">
              {t("page404:internalServerErrorMsg2")}
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/">
              <a className="p-2 font-semibold bg-gray-200 text-gray-800 rounded-lg text-lg hover:bg-gray-300">
                {t("page404:internalServerErrorMsg3")}
              </a>
            </Link>
          </div>
        </div>
      </main>
      {/* <footer className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-t border-gray-200 py-12 text-center md:flex md:justify-between">
                    <p className="text-base text-gray-400">&copy; Your Company, Inc. All rights reserved.</p>
                    <div className="mt-6 flex justify-center space-x-8 md:mt-0">
                        {social.map((item, itemIdx) => (
                            <a key={itemIdx} href={item.href} className="inline-flex text-gray-400 hover:text-gray-500">
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                </div>
            </footer> */}
    </div>
  );
}
