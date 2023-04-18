import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { classNames } from "../../lib/functions";
import { useDispatch } from "react-redux";
import { addToComparison } from "../../redux/slices/compareSlice";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { searchPhones } from "../../lib/api";
import { ComparePhoneType } from "../../types";

export default function SearchBar({ i }: { i: number }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [filteredPhones, setFilteredPhones] = useState<
    { name: string; url: string; imgUrl: string }[]
  >([]);

  const getComparePhone = async (url: string) => {
    const res = await axios.get(`/api/phone?name=${url}`);
    let current = res.data.phone;
    dispatch(addToComparison(current));
  };

  const getSearchPhones = async (query: string) => {
    const phones = await searchPhones(query);
    setFilteredPhones(phones);
  };

  useEffect(() => {
    if (query.length > 0) {
      getSearchPhones(query);
    }
  }, [query]);

  return (
    <Combobox as="div" value={selectedPhone} onChange={setSelectedPhone}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        {t("compare:phone")} {i + 1}
      </Combobox.Label>
      <div className="relative mt-1 p-2">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(phone: { name: string; imgUrl: string }) =>
            phone?.name
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredPhones.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredPhones.map((phone, i) => (
              <Combobox.Option
                key={i}
                value={phone}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <button
                      onClick={() => getComparePhone(phone.url)}
                      className="flex items-center"
                    >
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
  );
}
