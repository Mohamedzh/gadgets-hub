import { PaperClipIcon } from "@heroicons/react/20/solid";
import {
  createBrowserSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { BarsArrowUpIcon, UsersIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import ProfileFavsSection from "./profileFavsSection";
import { useUser } from "@supabase/auth-helpers-react";
import axios from "axios";
import { useRouter } from "next/router";
import { englishLocale } from "../../lib/functions";
import { useTranslation } from "next-i18next";

type Props = {
  user: User;
};

export default function ProfileSection({ user }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  const updateUserData = async (newName: string) => {
    const reqData = { id: user.id, name: newName };
    const update = await axios.post("/api/updateNickName", reqData);
    if (update.status === 200) {
      const { data, error } = await supabaseClient.auth.updateUser({
        data: { nickName: newName },
      });
    }
  };

  const updateUserEmail = async (newEmail: string) => {
    const reqData = { id: user.id, email: newEmail };
    const update = await axios.post("/api/updateEmail", reqData);
    if (update.status === 200) {
      const { data, error } = await supabaseClient.auth.updateUser({
        email: newEmail,
      });
    }
  };

  const updateUserPassword = async (newPassword: string) => {
    const { data, error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
  };

  const [show, setShow] = useState<boolean>(false);
  const [item, setItem] = useState<string>();

  const userData = [
    {
      name: "Nickname",
      arabicName: "الاسم",
      value: user.user_metadata.nickName,
      placeHolder: "profile:newNickName",
      disabled: false,
    },
    {
      name: "user:email",
      value: user.email,
      placeHolder: "profile:newEmail",
      disabled: false,
    },
    {
      name: "user:password",
      value: "******",
      placeHolder: "profile:newPassword",
      disabled: false,
    },
  ];

  const setActiveItem = (data: any[], name: string) => {
    let target = data.find((item) => item.name === name);
    if (target) {
      target.active = true;
    }
  };

  return (
    <>
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-100 mt-3">
          User Information
        </h3>
        {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p> */}
      </div>
      <div className="mt-5 border-t border-gray-200">
        <dl className="divide-y divide-gray-200">
          {userData.map((data, i) => (
            <div
              key={i}
              className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5"
            >
              <dt className=" font-medium text-green-500">
                {englishLocale(router) ? data.name : data.arabicName}
              </dt>
              <dd className="mt-1 flex  text-white sm:col-span-2 sm:mt-0">
                {!show ? (
                  <span className="flex-grow">{data.value}</span>
                ) : (
                  data.name === item && (
                    <div>
                      {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Search candidates
                                    </label> */}
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <div className="relative flex flex-grow items-stretch focus-within:z-10">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <UsersIcon
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            className={`block w-full text-black rounded-none ${
                              !englishLocale(router)
                                ? "rounded-r-md"
                                : "rounded-l-md"
                            } border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                            placeholder={t(data.placeHolder) || ""}
                          />
                        </div>
                        <button
                          onClick={() => {
                            data.name === "Nickname"
                              ? updateUserData(
                                  (document.getElementById(
                                    "email"
                                  ) as HTMLInputElement)!.value
                                )
                              : data.name === "Email Address"
                              ? updateUserEmail(
                                  (document.getElementById(
                                    "email"
                                  ) as HTMLInputElement)!.value
                                )
                              : data.name === "Password"
                              ? updateUserPassword(
                                  (document.getElementById(
                                    "email"
                                  ) as HTMLInputElement)!.value
                                )
                              : alert("No valid field detected");
                          }}
                          type="button"
                          className={`relative -ml-px inline-flex items-center space-x-2 ${
                            !englishLocale(router)
                              ? "rounded-l-md"
                              : "rounded-r-md"
                          } border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                        >
                          {/* <BarsArrowUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                          <span>{t("profile:saveChanges")}</span>
                        </button>
                      </div>
                    </div>
                  )
                )}

                <span
                  className={`flex-shrink-0 ${
                    !englishLocale(router) ? "mr-auto" : "ml-auto"
                  }`}
                >
                  <button
                    disabled={item === data.name}
                    onClick={() => {
                      setItem(data.name);
                      setShow(true);
                    }}
                    type="button"
                    className={` p-2 rounded-md bg-white font-medium text-indigo-600 ${
                      item === data.name
                        ? "bg-gray-300"
                        : "hover:text-white hover:bg-indigo-600"
                    }  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    {t("update")}
                  </button>
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <ProfileFavsSection user={user} />
      </div>
    </>
  );
}
