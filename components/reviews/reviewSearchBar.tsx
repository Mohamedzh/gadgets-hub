import { useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "../../lib/functions";
import Link from "next/link";
import { Brand } from "../../types";
import { useTranslation } from "next-i18next";

export default function SearchBar({ brands }: { brands: { name: string }[] }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);

  const filteredBrands =
    query === ""
      ? brands
      : brands.filter((brand) => {
          return brand.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox
      as="div"
      className="w-max lg:mx-10 mx-5 my-5"
      value={selectedBrand}
      onChange={setSelectedBrand}
    >
      <Combobox.Label className="block font-medium text-gray-200">
        {t("reviewSearch")}
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(brand: Brand) => brand?.name}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredBrands.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredBrands.map((brand, i) => (
              <Combobox.Option
                key={i}
                value={brand}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <Link href={`/reviews/${brand.name.toLowerCase()}`}>
                      <a className="flex items-center">
                        {/* <img src={person.imageUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-full" /> */}
                        <span
                          className={classNames(
                            "ml-3 truncate",
                            selected && "font-semibold"
                          )}
                        >
                          {brand.name}
                        </span>
                      </a>
                    </Link>

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
  );
}
