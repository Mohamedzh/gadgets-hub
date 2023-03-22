import { createTheme } from "@mui/material";
import axios from "axios";
import { NextRouter } from "next/router";
import { addToComparison } from "../redux/slices/compareSlice";
import { DetailedCategory, DetailedPhone, DetailedPhoneSpecs } from "../types";
// import { v2 } from "@google-cloud/translate";

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const englishLocale = (router: NextRouter) => {
  if (router.locale === "en") {
    return true;
  } else {
    return false;
  }
};

export const paginate = (
  selectedPage: number,
  elementsPerPage: number,
  arrayToPaginate: any[]
) => {
  const indexMin = selectedPage * elementsPerPage - elementsPerPage;
  const indexMax = indexMin + elementsPerPage;
  const paginatedArray = arrayToPaginate.filter(
    (x, index) => index >= indexMin && index < indexMax
  );
  return paginatedArray;
};

export const createPhoneData = (
  categories: DetailedCategory[],
  specs: DetailedPhoneSpecs[]
) => {
  let detailedCategories: {
    name: string;
    specs: { spec: string; value: string }[];
  }[] = [];
  for (let i = 0; i < categories.length; i++) {
    specs.map((ref) => {
      if (ref.spec.categoryName === categories[i].name) {
        let current = detailedCategories.find(
          (category) => category.name === categories[i].name
        );
        if (current) {
          current.specs.push({ spec: ref.spec.name, value: ref.value });
        } else {
          detailedCategories.push({
            name: categories[i].name,
            specs: [{ spec: ref.spec.name, value: ref.value }],
          });
        }
      }
    });
  }
  return detailedCategories;
};

// export const createPhoneData2 = (categories: DetailedCategory[], specs: DetailedPhoneSpecs[]) => {
//     let detailedCategories = categories
//     for (let i = 0; i < detailedCategories.length; i++) {
//         specs.map(ref => {
//             if (ref.spec.categoryName === detailedCategories[i].name) {
//                 let current = detailedCategories[i].specs.find(feature => feature.name === ref.spec.name)
//                     current = { ...current, alias: '1' }
//             }
//         })
//     }
//     return detailedCategories
// }

export const AddButton = () => {
  return (
    <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
      >
        Add phone
      </button>
    </div>
  );
};

export const getPhoneDetails = async (name: string) => {
  const res = await axios.get("http://localhost:3000/api/phone", {
    headers: { phoneName: name },
  });
  const phone = res.data;
};

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1);

export const monthNumberFromString = (str: string) => {
  return new Date(`${str} 01 2000`).toLocaleDateString(`en`, {
    month: `2-digit`,
  });
};

// export async function quickStart(text: string, target: string) {
//     const { Translate } = v2
//     const projectId = 'gadgets-hub-368213';
//     const credentials = JSON.parse(
//         Buffer.from(process.env.TRANSLATE_KEY!, 'base64').toString()
//     )
//     // Instantiates a client
//     const translate = new Translate({ projectId, credentials });
//     const [translation] = await translate.translate(text, target);
//     // console.log(`Text: ${text}`);
//     // console.log(`Translation: ${translation}`);
//     return translation
// }

// export async function transArabic(text: string, target: string) {
//     const { Translate } = v2;
//     const projectId = "gadgets-hub-368213";
//     const credentials = JSON.parse(
//       Buffer.from(process.env.TRANSLATE_KEY!, "base64").toString()
//     );
//     const translate = new Translate({ projectId, credentials });
//     const [translation] = await translate.translate(text, target);
//     return translation;
//   }

export const getReviewDate = (date: string) => {
  if (date.indexOf("updated") !== -1) {
    let newDate = date.slice(date.indexOf("updated") + 9);
    let day = newDate.slice(0, newDate.indexOf(" "));
    if (day.length === 1) {
      day = "0" + day;
    }
    let month = monthNumberFromString(
      newDate.slice(newDate.indexOf(" ") + 1, newDate.lastIndexOf(" "))
    ).toString();
    let year = newDate.slice(newDate.lastIndexOf(" "));
    return Number(year + month + day);
  }
  let day = date.slice(0, date.indexOf(" "));
  if (day.length === 1) {
    day = "0" + day;
  }
  let month = monthNumberFromString(
    date.slice(date.indexOf(" ") + 1, date.lastIndexOf(" "))
  ).toString();
  let year = date.slice(date.lastIndexOf(" "));
  return Number(year + month + day);
};

export const stringInsert = (s: string, index: number, newStr: string) => {
  return s.slice(0, index) + newStr + s.slice(index);
};

export const stringReplace = (
  s: string,
  startIndex: number,
  endIndex: number,
  newStr: string
) => {
  return s.slice(0, startIndex) + newStr + s.slice(endIndex);
};
