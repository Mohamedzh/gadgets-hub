import React, { Fragment, useEffect, useState } from "react";
import { classNames } from "../../lib/functions";
import { useAppSelector } from "../../redux/hooks";
import {
  ArCategory,
  ArQuickSpec,
  DetailedPhoneType,
  SpecDetailType,
  SpecsType,
} from "../../types";
import { useDispatch } from "react-redux";
import { removeFromComparison } from "../../redux/slices/compareSlice";
import { AiOutlineMinusCircle } from "react-icons/ai";
import Link from "next/link";
import CompareSearchBar from "./comparePhonesSearchBar";
import { englishLocale } from "../../lib/functions";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

type Props = {
  categories: ArCategory[];
  quickSpecs: ArQuickSpec[];
};

function CompareTable({ categories, quickSpecs }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const comparePhones = useAppSelector((state) => state.compare);
  const [currentPhones, setCurrentPhones] =
    useState<DetailedPhoneType[]>(comparePhones);

  const [detailedSpecs, setDetailedSpecs] = useState<SpecDetailType[]>([]);

  const [phonesQuickSpecs, setQuickSpecs] = useState<SpecsType[]>([]);

  const setCurrentQuickSpecs = () => {
    for (let y = 0; y < currentPhones.length; y++) {
      if (currentPhones[y].quickSpecs.length > phonesQuickSpecs.length) {
        setQuickSpecs(currentPhones[y].quickSpecs);
      }
      for (let z = 0; z < currentPhones[y].specDetails.length; z++) {}
      if (currentPhones[y].specDetails.length > phonesQuickSpecs.length) {
        setDetailedSpecs(currentPhones[y].specDetails);
      }
    }
  };

  useEffect(() => {
    setCurrentPhones(comparePhones);
    setCurrentQuickSpecs();
  }, [comparePhones]);

  const setTableColumns = (length: number) => {
    let renderNumber: number;
    length === 0
      ? (renderNumber = 3)
      : length === 1
      ? (renderNumber = 2)
      : length === 2
      ? (renderNumber = 1)
      : (renderNumber = 0);
    return renderNumber;
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto"></div>
      </div>
      <div
        // style={{ maxHeight: '84vh' }}
        className="mt-8 lg:max-h-[84vh] flex flex-col"
      >
        <div className="-my-2 -mx-4 lg:overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  tableLayout: "fixed",
                }}
                className="lg:min-w-full overflow-scroll mb-10 border-2"
              >
                <thead className="bg-gray-300 sticky top-0 z-40">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 sm:pl-6 "
                    >
                      {t("compare:phones")}
                    </th>
                    {currentPhones.map((phone, i) => (
                      <th
                        key={i}
                        scope="col"
                        className="px-3 py-3.5 text-left font-semibold text-gray-900"
                      >
                        <div className="flex flex-col place-items-center">
                          <AiOutlineMinusCircle
                            onClick={() =>
                              dispatch(removeFromComparison(phone))
                            }
                            className="w-8 h-8 self-end cursor-pointer hover:scale-125 ring-red-500 text-bold text-red-500 rounded-full"
                          />
                          <Link href={`/${phone.url}`}>
                            <a>
                              <img
                                className="mb-3 h-32 mx-auto"
                                src={phone.urlImg}
                              />
                              <p>{phone.title}</p>
                            </a>
                          </Link>
                        </div>
                      </th>
                    ))}
                    {Array.from(
                      Array(setTableColumns(currentPhones.length)).keys()
                    ).map((item, i) => (
                      <th key={i}>
                        <CompareSearchBar i={i} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-gray-700">
                  <tr className="border-t border-gray-200">
                    <th
                      colSpan={4}
                      scope="colgroup"
                      className={`bg-gray-100 px-4 py-2 ${
                        englishLocale(router) ? "text-left" : "text-right"
                      } text-lg font-semibold text-gray-900 sm:px-6`}
                    >
                      {t("compare:quickSpecs")}
                    </th>
                  </tr>
                  {quickSpecs.map((quickSpec, i) => (
                    <Fragment key={i}>
                      <tr
                        className={classNames(
                          i === 0 ? "border-gray-300" : "border-gray-200",
                          `border-t ${
                            englishLocale(router) ? "" : "divide-x-reverse"
                          } divide-x-2`
                        )}
                      >
                        <td className=" py-4 pl-4 pr-3 text-sm font-medium text-yellow-400 text-center sm:pl-6">
                          {t("phone:" + quickSpec.name.split(" ").join(""))}
                        </td>
                        {currentPhones.map((phone, i) => (
                          <td
                            key={i}
                            className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-300 sm:pl-6 text-center"
                          >
                            {phone.quickSpecs.find(
                              (x) => x.name === quickSpec.name
                            )?.value || "NA"}
                          </td>
                        ))}
                        {Array.from(
                          Array(setTableColumns(currentPhones.length)).keys()
                        ).map((item, i) => (
                          <td key={i}></td>
                        ))}
                      </tr>
                    </Fragment>
                  ))}
                  {
                    <tr className="border-t border-gray-200">
                      <th
                        colSpan={4}
                        scope="colgroup"
                        className="bg-gray-900 px-4 py-2 text-center text-4xl font-semibold text-white sm:px-6"
                      >
                        {t("compare:detailedComparison")}
                      </th>
                    </tr>
                  }
                  {categories.map((category, idx) => (
                    <Fragment key={idx}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={4}
                          scope="colgroup"
                          className={`bg-gray-100 px-4 py-2 ${
                            englishLocale(router) ? "text-left" : "text-right"
                          } text-lg font-semibold text-gray-900 sm:px-6`}
                        >
                          {t("phone:" + category.name.split(" ").join(""))}
                        </th>
                      </tr>
                      {category.specs.map((spec, i) => (
                        <tr
                          key={i}
                          className={classNames(
                            i === 0 ? "border-gray-300" : "border-gray-200",
                            "border-t"
                          )}
                        >
                          <td className=" py-4 pl-4 pr-3 text-sm font-medium text-yellow-400 sm:pl-6">
                            {t("phone:" + spec.name.split(" ").join(""))}
                          </td>
                          {currentPhones.map((phone, index) => (
                            <td
                              key={index}
                              className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-6 text-center"
                            >
                              {phone.specDetails
                                .find((item) => item.category === category.name)
                                ?.specs.find(
                                  (subItem) => subItem.name === spec.name
                                )?.value || "-"}
                            </td>
                          ))}
                          {Array.from(
                            Array(setTableColumns(currentPhones.length)).keys()
                          ).map((item, i) => (
                            <th key={i}></th>
                          ))}
                          {/* <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                        {(phones[1].PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                    </td>
                                                    <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                        {(phones[2].PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                    </td> */}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompareTable;
