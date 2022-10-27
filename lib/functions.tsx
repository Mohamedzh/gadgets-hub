import { createTheme } from "@mui/material";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { addToComparison } from "../redux/slices/compareSlice";
import { DetailedCategory, DetailedPhone, DetailedPhoneSpecs } from "../types";

export function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export const paginate = (selectedPage: number, elementsPerPage: number, arrayToPaginate: any[]) => {
    const indexMin = (selectedPage * elementsPerPage) - elementsPerPage;
    const indexMax = indexMin + elementsPerPage;
    const paginatedArray = arrayToPaginate.filter(
        (x, index) => index >= indexMin && index < indexMax
    );
    return paginatedArray
}

export const phoneSortAZ = (phones: []) => {
    phones.sort()
}

export const createPhoneData = (categories: DetailedCategory[], specs: DetailedPhoneSpecs[]) => {
    let detailedCategories: { name: string, specs: { spec: string, value: string }[] }[] = []
    for (let i = 0; i < categories.length; i++) {
        specs.map(ref => {
            if (ref.spec.categoryName === categories[i].name) {
                let current = detailedCategories.find(category => category.name === categories[i].name)
                if (current) {
                    current.specs.push({ spec: ref.spec.name, value: ref.value })
                } else {
                    detailedCategories.push({ name: categories[i].name, specs: [{ spec: ref.spec.name, value: ref.value }] })
                }
            }
        })
    }
    return detailedCategories
}

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
    )
}

export const AddToComparison = (
    { dispatch, phone, setShow }: { dispatch: Dispatch, phone: DetailedPhone, setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
                onClick={() => { dispatch(addToComparison(phone)); setShow(true) }}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
                Add phone to comparison
            </button>
        </div>
    )
}

export const getPhoneDetails = async (name: string) => {
    const res = await axios.get('http://localhost:3000/api/phone', { headers: { phoneName: name } })
    const phone = res.data
}

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

export const capitalize = (s: string) => s && s[0].toUpperCase() + s.slice(1)