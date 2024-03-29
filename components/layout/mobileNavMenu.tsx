import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import React, { MutableRefObject } from "react";
import { useTranslation } from "next-i18next";

const brandsMenu = [
  { name: "layout:brandsMenuApple", url: "/brands/apple" },
  { name: "layout:brandsMenuSamsung", url: "/brands/samsung" },
  { name: "layout:brandsMenuXiaomi", url: "/brands/xiaomi" },
  { name: "layout:brandsMenuOnePlus", url: "/brands/oneplus" },
];

type Props = {
  item: { name: string; current: boolean; href: string };
  close: (
    focusableElement?:
      | HTMLElement
      | MutableRefObject<HTMLElement | null>
      | undefined
  ) => void;
};

function MobileNavMenu({ item, close }: Props) {
  const { t } = useTranslation();
  return (
    <Disclosure>
      {({ open }) => (
        <>
          {
            <Disclosure.Button
              as="button"
              className="flex rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
            >
              {t(item.name)}
              <ChevronDownIcon
                className="ms-2 -mr-1 h-7 w-7 text-violet-200 hover:text-violet-100"
                aria-hidden="true"
              />
            </Disclosure.Button>
          }

          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
              {brandsMenu.map((brand, i) => (
                <Link key={i} href={brand.url}>
                  <Disclosure.Button
                    onClick={() => close()}
                    as="a"
                    className="block rounded-md text-center bg-gray-900 px-3 py-2 text-base font-medium text-white hover:bg-gray-400 hover:text-black cursor-pointer"
                  >
                    {t(brand.name)}
                  </Disclosure.Button>
                </Link>
              ))}
              <Link href="/brands">
                <Disclosure.Button
                  as="a"
                  className="block rounded-md px-3 py-2 text-center bg-gray-900 text-base font-medium text-gray-300 hover:bg-gray-400 hover:text-black cursor-pointer"
                >
                  {t("layout:navMenuShowAllBrands")}
                </Disclosure.Button>
              </Link>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default MobileNavMenu;
