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

export default function Page404() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="bg-gray-900">
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 pt-16">
          <img
            className="mx-auto h-12 w-auto"
            src="/mobileLogo.png"
            alt="Gadgets Hub"
          />
        </div>
        <div className="mx-auto max-w-xl py-16 sm:py-24">
          <div className="text-center">
            <p className="text-base font-semibold text-indigo-400">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              {t("page404:pageNotExistMsg")}
            </h1>
            <p className="mt-2 text-lg text-gray-200">
              {t("page404:pageNotFoundMsg")}
            </p>
          </div>
          <div className="mt-12">
            <h2 className="text-base font-semibold text-gray-200">
              {t("page404:popularPages")}
            </h2>
            <ul
              role="list"
              className="mt-4 divide-y divide-gray-200 border-t border-b border-gray-200"
            >
              {links.map((link, linkIdx) => (
                <li
                  key={linkIdx}
                  className="relative flex items-start space-x-4 py-6"
                >
                  <div className="flex-shrink-0">
                    {/* <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50">
                                            <link.icon className="h-6 w-6 text-indigo-700" aria-hidden="true" />
                                        </span> */}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-gray-100">
                      <span className="rounded-sm hover:text-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                        <Link href={link.href + "/ar"}>
                          <a className="focus:outline-none">
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            />
                            {t(link.title)}
                          </a>
                        </Link>
                      </span>
                    </h3>
                    {/* <p className="text-base text-gray-500">{link.description}</p> */}
                  </div>
                  <div className="flex-shrink-0 self-center">
                    {englishLocale(router) ? (
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronLeftIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/">
                <a className="text-base font-medium text-indigo-600 hover:text-indigo-500">
                  {t("page404:goHomeMsg")}
                  <span aria-hidden="true">
                    {" "}
                    {englishLocale(router) ? (
                      <span>&rarr;</span>
                    ) : (
                      <span>&larr;</span>
                    )}
                  </span>
                </a>
              </Link>
            </div>
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
