import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { englishLocale } from "../../lib/functions";
import Image from "next/image";

const brandsMenu = [
  { name: "APPLE", url: "/brands/apple", img: "/appleLogo.png" },
  { name: "SAMSUNG", url: "/brands/samsung", img: "/samsungLogo.png" },
  { name: "XIAOMI", url: "/brands/xiaomi", img: "/xiaomiLogo.png" },
  { name: "ONE_PLUS", url: "/brands/oneplus", img: "/oneplusLogo.png" },
];

export default function NavMenu({
  nav,
}: {
  nav: { name: string; current: boolean };
}) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-gray-800 bg-opacity-20 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-opacity-30 focus-visible:ring-opacity-75 hover:bg-gray-700 hover:text-white">
            <ChevronDownIcon
              className={`h-5 w-5 text-violet-200 hover:text-violet-100`}
              aria-hidden="true"
            />
            {t(nav.name)}
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {brandsMenu.map((brand, i) => (
                <Link key={i} href={brand.url}>
                  <a>
                    <Menu.Item key={i}>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-violet-500 text-white"
                              : "text-gray-900"
                          } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          {/* {active ? (
                                                        <EditActiveIcon
                                                            className="mr-2 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <EditInactiveIcon
                                                            className="mr-2 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    )} */}
                          <div className="relative mt-2 mx-2">
                            <Image
                              width={28}
                              height={28}
                              src={brand.img}
                              alt="Brand name"
                            />
                          </div>
                          {t(brand.name)}
                        </button>
                      )}
                    </Menu.Item>
                  </a>
                </Link>
              ))}
            </div>
            <div className="px-1 py-1">
              <Link href="/brands">
                <a>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? "bg-violet-500 text-white" : "text-gray-900"
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        {/* {active ? (
                                                    <DeleteActiveIcon
                                                        className="mr-2 h-5 w-5 text-violet-400"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <DeleteInactiveIcon
                                                        className="mr-2 h-5 w-5 text-violet-400"
                                                        aria-hidden="true"
                                                    />
                                                )} */}
                        {t("showAllBrands")}
                      </button>
                    )}
                  </Menu.Item>
                </a>
              </Link>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
