import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "../../lib/functions";
import Link from "next/link";
import NewMenu from "./brandsMenu";
import SignUp from "../user/signUpModal";
import {
  createBrowserSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import Login from "../user/loginModal";
import MobileNavMenu from "./mobileNavMenu";
import { useRouter } from "next/router";
import LanguageMenu from "./languageMenu";
import { useTranslation } from "next-i18next";
import { profileMenu } from "../../lib/data";
import SearchBar from "../searchBar";
import Image from "next/image";

export default function Navbar() {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const [openSignUp, setOpenSignUp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const router = useRouter();

  const navMenu = [
    { name: "news", current: false, href: "/news" },
    { name: "reviews", current: false, href: "/reviews" },
    { name: "phoneFinder", current: false, href: "/phonefinder" },
    { name: "brands", current: false, href: "#" },
    { name: "comparison", current: false, href: "/compare" },
  ];

  const { t } = useTranslation();

  const user = useUser();

  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  return (
    <div className="sticky top-0 z-50">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <a className="block lg:hidden">
                        <div className="relative h-8 w-auto">
                          <Image
                            className="block"
                            src="/mobileLogo.png"
                            alt="Gadgets Hub"
                            layout="fill"
                          />
                        </div>
                        <p className="lg:hidden text-sm text-gray-200 font-mono font-semibold">
                          Gadgets Hub
                        </p>
                      </a>
                    </Link>
                    <Link href="/">
                      <a className="hidden lg:block">
                        <div className="relative h-8 w-auto">
                          <Image
                            className=""
                            src="/mobileLogo.png"
                            alt="Gadgets Hub"
                            layout="fill"
                          />
                        </div>
                        <p className="text-gray-200 font-mono font-semibold">
                          Gadgets Hub
                        </p>
                      </a>
                    </Link>
                  </div>
                  <div className="hidden lg:mx-6 lg:block">
                    <div className="flex gap-x-4">
                      {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                      {navMenu.map((nav, i) =>
                        nav.name === "brands" ? (
                          <div
                            key={nav.name}
                            className="rounded-md
                          text-sm font-medium hover:bg-gray-700 text-white place-self-center"
                          >
                            <NewMenu nav={nav} />
                          </div>
                        ) : (
                          <Link key={i} href={nav.href}>
                            <a
                              className={`${
                                nav.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              } rounded-md px-3 py-2 text-sm text-center font-medium text-white place-self-center min-w-[80px]`}
                            >
                              {t(nav.name)}
                            </a>
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={`flex flex-1 justify-center px-2 ${router.locale === "en" ? "lg:ml-6" : "lg:mr-6" } lg:ml-6 lg:justify-between`}>
                  <SearchBar />
                  <LanguageMenu />
                </div>
                <div className="flex lg:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="hidden lg:ml-4 lg:block">
                  <div className="flex items-center">
                    <Menu as="div" className="relative ml-4 flex-shrink-0">
                      <div>
                        <Login
                          openLogin={openLogin}
                          setOpenLogin={setOpenLogin}
                          setOpenSignUp={setOpenSignUp}
                          setCurrentUser={setCurrentUser}
                        />
                        <SignUp
                          openSignUp={openSignUp}
                          setOpenSignUp={setOpenSignUp}
                          setOpenLogin={setOpenLogin}
                          setCurrentUser={setCurrentUser}
                        />

                        {currentUser ? (
                          <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <div className="flex flex-col px-2">
                              <p className="text-lg font-semibold">
                                {currentUser.user_metadata.nickName}
                              </p>
                              <p className="text-sm ">{currentUser.email}</p>
                            </div>
                          </Menu.Button>
                        ) : (
                          <button
                            onClick={() => setOpenLogin(true)}
                            className=" p-2 font-semibold text-white hover:text-blue-600"
                          >
                            {t("loginSignUp")}
                          </button>
                        )}
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {profileMenu.map((item, i) => (
                            <Menu.Item key={i}>
                              {({ active }) =>
                                i === 0 ? (
                                  <button
                                    onClick={() => router.push("/profile")}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 w-full font-semibold"
                                    )}
                                  >
                                    {t(item.name)}
                                  </button>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      await supabaseClient.auth.signOut();
                                      setCurrentUser(undefined);
                                      if ((router.asPath = "/profile")) {
                                        router.push("/");
                                      }
                                    }}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full font-semibold"
                                    )}
                                  >
                                    {t(item.name)}
                                  </button>
                                )
                              }
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="lg:hidden">
              {({ close }) => (
                <>
                  <div className="space-y-1 px-2 pt-2 pb-3 flex flex-col">
                    {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                    {navMenu.map((item, i) =>
                      item.name === "brands" ? (
                        <MobileNavMenu
                          close={close}
                          key={item.name}
                          item={item}
                        />
                      ) : (
                        <Link key={item.name} href={item.href}>
                          <Disclosure.Button
                            as="a"
                            onClick={() => close()}
                            className={`block rounded-md bg-gray-900 px-3 ${
                              item.name !== "Brands"
                                ? "py-2"
                                : "flex place-items-start place-content-start "
                            } text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer`}
                          >
                            {item.name !== "Brands" && t(item.name)}
                          </Disclosure.Button>
                        </Link>
                      )
                    )}
                  </div>
                  <div className="border-t border-gray-700 pt-4 pb-3">
                    <div className="flex items-center px-5">
                      <div className="flex-shrink-0"></div>
                      {currentUser !== null ? (
                        <div className="ml-3">
                          <div className="text-base font-medium text-white">
                            {currentUser?.user_metadata.nickName}
                          </div>
                          <div className="text-sm font-medium text-gray-400">
                            {currentUser?.email}
                          </div>
                        </div>
                      ) : (
                        <div className="ml-3">
                          <div className="text-base font-medium text-white">
                            {t("loginSignUp")}
                          </div>
                          {/* <div className="text-sm font-medium text-gray-400">{user?.email}</div> */}
                        </div>
                      )}
                    </div>
                    {currentUser ? (
                      <div className="mt-3 space-y-1 px-2">
                        {profileMenu.map((item, i) =>
                          i === 0 ? (
                            <Disclosure.Button
                              onClick={() => {
                                close();
                                router.push("/profile");
                              }}
                              key={i}
                              as="button"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                              {t(item.name)}
                            </Disclosure.Button>
                          ) : (
                            <Disclosure.Button
                              onClick={async () => {
                                await supabaseClient.auth.signOut();
                                setCurrentUser(undefined);
                                router.reload();
                              }}
                              key={i}
                              as="button"
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                            >
                              {t(item.name)}
                            </Disclosure.Button>
                          )
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setOpenLogin(true);
                          close();
                        }}
                        className=" p-2 font-semibold text-white hover:text-blue-600 ml-3"
                      >
                        {t("loginSignUp")}{" "}
                      </button>
                    )}
                  </div>
                </>
              )}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
