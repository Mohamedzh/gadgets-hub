import { Menu } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export default function LanguageMenu() {
  const router = useRouter();
  const changeTo = router.locale === "en" ? "ar" : "en";
  const { t } = useTranslation();
  const onToggleLanguageClick = (newLocale: string) => {
    newLocale === "en"
      ? document.body.classList.remove("ar")
      : document.body.classList.add("ar");
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  };

  //   const [language, setLanguage] = useState<string>("English");
  //   const getCurrentLanguage = (path: string) => {
  //     if (path.includes("/ar")) {
  //       setLanguage("العربية");
  //     } else setLanguage("English");
  //   };
  //   useEffect(() => {
  //     getCurrentLanguage(router.asPath);
  //   }, [router.asPath]);
  return (
    <div className="text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            onClick={() => onToggleLanguageClick(changeTo)}
            className="mt-2.5 inline-flex w-full justify-center rounded-md bg-gray-800 bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-gray-500"
          >
            <Image
              width={25}
              height={25}
              style={{ marginTop: "20px" }}
              src={`${
                router.locale === "en" ? "/egypt.png" : "/united-kingdom.png"
              }`}
            ></Image>
            <span className="mx-1">{t("lang")}</span>
            {/* <ChevronDownIcon
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
              aria-hidden="true"
            /> */}
          </Menu.Button>
        </div>
        {/* <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="">
              <Menu.Item>
                {({ active }) =>
                  router.asPath.includes("/ar") ? (
                    <button
                      onClick={() => router.push(router.asPath.slice(0, -2))}
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    >
                      <span className="ml-1 mr-5 font-bold">الانجليزية</span>
                      <Image
                        width={25}
                        height={25}
                        style={{ marginTop: "20px" }}
                        src="/united-kingdom.png"
                      ></Image>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        router.push(
                          `${
                            router.asPath === "/"
                              ? router.asPath + "ar"
                              : router.asPath + "/ar"
                          }`
                        )
                      }
                      className={`${
                        active ? "bg-violet-500 text-white" : "text-gray-900"
                      } group flex w-full items-center rounded-md px-4 py-2 text-sm`}
                    >
                      <Image
                        width={25}
                        height={25}
                        style={{ marginTop: "20px" }}
                        src="/egypt.png"
                      ></Image>
                      <span className="ml-1 font-bold">Arabic</span>
                    </button>
                  )
                }
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition> */}
      </Menu>
    </div>
  );
}
