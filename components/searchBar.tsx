import React, { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames, englishLocale } from "../lib/functions";
import { useTranslation } from "next-i18next";
import { searchPhones } from "../lib/api";
import { useRouter } from "next/router";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";

type Props = {};

function SearchBar({}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [filteredPhones, setFilteredPhones] = useState<
    { name: string; url: string; imgUrl: string }[]
  >([]);

  const getSearchPhones = async (query: string) => {
    const phones = await searchPhones(query);
    setFilteredPhones(phones);
  };

  useEffect(() => {
    if (query.length > 0) {
      getSearchPhones(query);
    } else {
      setFilteredPhones([]);
      setSelectedPhone(null);
    }
  }, [query]);

  return (
    <div>
      <Combobox as="div" value={selectedPhone} onChange={setSelectedPhone}>
        <div className="relative mt-1 p-2">
          <div
            className={`pointer-events-none absolute inset-y-0 ${
              englishLocale(router) ? "left-0 pl-5" : "right-0 pr-5"
            } flex items-center pl-4`}
          >
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <Combobox.Input
            placeholder={t("search")}
            // className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            className={`block w-full rounded-md border border-transparent bg-gray-700 py-2 ${
              englishLocale(router) ? "pl-10 pr-3" : "pr-10 pl-3"
            } leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm`}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(phone: { name: string; imgUrl: string }) =>
              phone?.name
            }
          />
          {filteredPhones.length > 0 && (
            <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPhones.map((phone, i) => (
                <Combobox.Option
                  key={i}
                  value={phone}
                  onClick={() => router.push(`/${phone.name}`)}
                  className={({ active }) =>
                    classNames(
                      "w-full rounded-md border border-transparent py-2 leading-5 focus:text-gray-900 sm:text-sm",
                      "relative select-none px-5 cursor-pointer",
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    )
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <button className="flex items-center">
                        <img
                          src={phone.imgUrl}
                          alt=""
                          className="h-6 w-6 flex-shrink-0 rounded-full"
                        />
                        <span
                          className={classNames(
                            "ml-3 truncate",
                            selected && "font-semibold"
                          )}
                        >
                          {phone.name}
                        </span>
                      </button>

                      {selected && (
                        <span
                          className={classNames(
                            "absolute inset-y-0 right-0 flex items-center pr-4",
                            active ? "text-white" : "text-indigo-600"
                          )}
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
      {/* <div className=" max-w-lg lg:max-w-xs">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
          <input
            id="search"
            name="search"
            className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
            placeholder="Search"
            type="search"
          />
        </div>
      </div> */}
    </div>
  );
}

export default SearchBar;
