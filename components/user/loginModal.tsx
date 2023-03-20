import { useFormik } from "formik";
import * as Yup from "yup";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import {
  createBrowserSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useTranslation } from "next-i18next";
import { englishLocale } from "../../lib/functions";
import { useRouter } from "next/router";

type Props = {
  openLogin: boolean;
  setOpenLogin: Dispatch<SetStateAction<boolean>>;
  setOpenSignUp: Dispatch<SetStateAction<boolean>>;
  setCurrentUser: Dispatch<SetStateAction<User | undefined>>;
};

export default function Login({
  openLogin,
  setOpenLogin,
  setOpenSignUp,
  setCurrentUser,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  const formData = [
    {
      name: "email",
      type: "email",
      label: "user:email",
      arabicLabel: "البريد الالكتروني",
    },
    {
      name: "password",
      type: "password",
      label: "user:password",
      arabicLabel: "كلمة السر",
    },
  ];

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (data?.user) {
        setCurrentUser(data.user);
        setOpenLogin(false);
        setError(undefined);
      }
      if (error) {
        setError(error.message);
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().required("user:loginMissingEmail"),
      password: Yup.string().required("user:loginMissingPassword"),
    }),
  });
  return (
    <>
      <Transition.Root show={openLogin} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenLogin}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8  sm:p-6">
                  <div className="flex flex-col justify-center py-6 lg:py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                      <img
                        className="mx-auto h-12 w-auto"
                        src="/mobileLogo.png"
                        alt="Gadgets Hub"
                      />
                      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        {t("user:signInButton")}
                      </h2>
                    </div>

                    <div className="mt-8 sm:mx-auto sm:w-full">
                      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form
                          className="space-y-6"
                          onSubmit={formik.handleSubmit}
                        >
                          <div
                            className={`${
                              englishLocale(router) ? "" : "space-x-reverse"
                            } grid grid-cols-2 space-x-4`}
                          >
                            {formData.map((data, i) => (
                              <div key={i} className={`flex flex-col`}>
                                <label
                                  htmlFor={data.name}
                                  className={`block text-sm font-medium text-gray-700 ${
                                    englishLocale(router)
                                      ? "text-left"
                                      : "text-right"
                                  }`}
                                >
                                  {t(data.label)}
                                </label>
                                <div className="mt-1 flex flex-col">
                                  <input
                                    id={data.name}
                                    name={data.name}
                                    type={data.type}
                                    autoComplete={data.name}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    className="block appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                  />
                                  {data.name === "email" ? (
                                    formik.touched.email &&
                                    formik.errors.email ? (
                                      <p
                                        className={`text-red-500 text-xs ${
                                          englishLocale(router)
                                            ? "text-left"
                                            : "text-right"
                                        }`}
                                      >
                                        {t(formik.errors.email)}
                                      </p>
                                    ) : null
                                  ) : formik.touched.password &&
                                    formik.errors.password ? (
                                    <p
                                      className={`text-red-500 text-xs ${
                                        englishLocale(router)
                                          ? "text-left"
                                          : "text-right"
                                      }`}
                                    >
                                      {t(formik.errors.password)}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot your password?
                                    </a>
                                </div>
                            </div> */}

                          <div>
                            <button
                              type="submit"
                              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              {t("user:login")}
                            </button>
                            {error && (
                              <p className="text-red-500 mt-1 text-sm">
                                {error}, {t("user:loginError")}
                              </p>
                            )}
                            <p
                              className={`${
                                englishLocale(router)
                                  ? "text-left"
                                  : "text-right"
                              }`}
                            >
                              {t("user:dontHaveAccountMessage") + " "}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenSignUp(true);
                                  setOpenLogin(false);
                                }}
                                className="underline"
                              >
                                {" "}
                                {t("user:signUp")}
                              </button>
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
