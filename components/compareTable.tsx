import { GetStaticProps } from 'next'
import React, { Fragment, useEffect, useState } from 'react'
import { prisma } from '../lib/db'
import { AddButton, classNames } from '../lib/functions'
import { useAppSelector } from '../redux/hooks'
import { DetailedCategory, DetailedPhone } from '../types'
import { IoMdCloseCircle } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { removeFromComparison } from '../redux/slices/compareSlice'
import { AiOutlineMinusCircle } from 'react-icons/ai'
import Link from 'next/link'
import CompareSearchBar from './comparePhonesSearchBar'
import { QuickSpec } from '@prisma/client'

type Props = {
    categories: DetailedCategory[]
    phones: DetailedPhone[]
    allPhones: DetailedPhone[]
    quickSpecs: QuickSpec[]
}

function CompareTable({ categories, phones, allPhones, quickSpecs }: Props) {
    const dispatch = useDispatch()
    const comparePhones = useAppSelector(state => state.compare)
    const [currentPhones, setCurrentPhones] = useState(comparePhones)

    console.log(quickSpecs);


    useEffect(() => { setCurrentPhones(comparePhones) }, [comparePhones])

    const setTableColumns = (length: number) => {
        let renderNumber: number;
        (length === 0 ? renderNumber = 3 : length === 1 ? renderNumber = 2 : length === 2 ? renderNumber = 1 : renderNumber = 0)
        return renderNumber
    }
    // console.log(phones);
    // console.log((phones[0].PhoneSpecs.filter(spec => spec.spec.categoryName === 'Network'))[1].value);

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    {/* <h1 className="text-xl font-semibold text-gray-900">{currentPhone.name}</h1> */}
                    {/* <p className="mt-2 text-sm text-gray-700">
                        A list of all the users in your account including their name, title, email and role.
                    </p> */}
                </div>

            </div>
            <div
                // style={{ maxHeight: '84vh' }}
                className="mt-8 max-h-[84vh] flex flex-col">
                <div className="-my-2 -mx-4 lg:overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="lg:min-w-full overflow-scroll">
                                <thead className="bg-white sticky top-0 z-40">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-lg font-semibold text-gray-900 sm:pl-6 ">
                                            Phones

                                        </th>
                                        {currentPhones.map((phone, i) =>
                                            <th key={i} scope="col" className="px-3 py-3.5 text-left font-semibold text-gray-900">

                                                <div className='flex flex-col place-items-center'>
                                                    <AiOutlineMinusCircle
                                                        onClick={() => dispatch(removeFromComparison(phone))}
                                                        className='w-8 h-8 self-end cursor-pointer hover:scale-125 ring-red-500 text-bold text-red-500 rounded-full'
                                                    />
                                                    <Link href={`/${phone.name}`}>
                                                        <a>
                                                            <img className='mb-3 h-32 mx-auto' src={phone.imgUrl} />
                                                            <p>{phone.description.slice(0, phone.description.indexOf('.'))}</p>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </th>
                                        )}
                                        {Array.from(Array(setTableColumns(currentPhones.length)).keys()).map((item, i) =>
                                            <th key={i}>
                                                <CompareSearchBar allPhones={allPhones} i={i} />
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="border-t border-gray-200">
                                        <th
                                            colSpan={4}
                                            scope="colgroup"
                                            className="bg-gray-100 px-4 py-2 text-left text-lg font-semibold text-gray-900 sm:px-6"
                                        >
                                            Quick Specs
                                        </th>
                                    </tr>
                                    {quickSpecs.map((quickSpec, i) =>
                                        <Fragment key={i}>
                                            <tr
                                                className={classNames(i === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t divide-x-2')}
                                            >
                                                <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {quickSpec.name}
                                                </td>
                                                {currentPhones.map((phone, i) =>
                                                    <td key={i} className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                        {(phone.PhoneQuickSpecs.find(x => x.quickspecName === quickSpec.name))?.value || 'NA'}
                                                    </td>
                                                )}
                                                {Array.from(Array(setTableColumns(currentPhones.length)).keys()).map((item, i) =>
                                                    <th key={i}>

                                                    </th>
                                                )}
                                            </tr>
                                        </Fragment>
                                    )}
                                    <tr className="border-t border-gray-200">
                                        <th
                                            colSpan={4}
                                            scope="colgroup"
                                            className="bg-gray-900 px-4 py-2 text-center text-4xl font-semibold text-white sm:px-6"
                                        >
                                            Detailed Comparison
                                        </th>
                                    </tr>
                                    {categories.map((category, idx) => (
                                        <Fragment
                                            key={idx}
                                        >
                                            <tr className="border-t border-gray-200">
                                                <th
                                                    colSpan={4}
                                                    scope="colgroup"
                                                    className="bg-gray-100 px-4 py-2 text-left text-lg font-semibold text-gray-900 sm:px-6"
                                                >
                                                    {category.name}
                                                </th>
                                            </tr>
                                            {category.specs.map((spec, i) => (
                                                <tr
                                                    key={i}
                                                    className={classNames(i === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                                                >
                                                    <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {spec.name}
                                                    </td>
                                                    {currentPhones.map(phone =>
                                                        <td className=" py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-center">
                                                            {(phone.PhoneSpecs.find(x => x.spec.alias === spec.alias))?.value || 'NA'}
                                                        </td>
                                                    )}
                                                    {Array.from(Array(setTableColumns(currentPhones.length)).keys()).map((item, i) =>
                                                        <th key={i}>

                                                        </th>
                                                    )}
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
    )
}

export default CompareTable