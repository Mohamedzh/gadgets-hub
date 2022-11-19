import { Category } from '@prisma/client'
import { Fragment } from 'react'
import { classNames, createPhoneData } from '../lib/functions'
import { DetailedCategory, DetailedPhone } from '../types'

export default function SpecsTable(
    { currentPhone, categories, arLang }: { currentPhone: DetailedPhone, categories: DetailedCategory[], arLang: boolean }
) {
    let specs = currentPhone.PhoneSpecs

    return (
        <div className="px-4 sm:px-6 lg:px-8 mx-10">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <p className='text-3xl font-bold m-5 font-serif text-amber-400'>
                        {arLang ? 'التفاصيل' : 'Detailed Specifications'}
                    </p>
                </div>
                {/* <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                    >
                        Add user
                    </button>
                </div> */}
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block max-w-full py-2 align-middle ">
                        <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="lg:w-screen max-w-full mb-10">
                                {/* <thead className="bg-white">
                                    <tr>
                                        <th scope="col"  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            <img className='mx-auto' src={currentPhone.imgUrl} />
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left  font-semibold text-gray-900">
                                            <p className='m-3 text-3xl font-bold text-center'>Quick Specifications</p>
                                            {currentPhone?.PhoneQuickSpecs.map((spec, idx) =>
                                                <div className='grid grid-cols-2 text-center' key={idx}>
                                                    <p>{spec.quickspecName}</p>
                                                    <p>{spec.value}</p>
                                                </div>
                                            )}
                                        </th>
                                    </tr>
                                </thead> */}
                                <tbody className="bg-gray-700">
                                    {createPhoneData(categories, specs).map((category, idx) => (
                                        <Fragment key={idx}>
                                            <tr className="border-t border-gray-200">
                                                <th
                                                    colSpan={4}
                                                    scope="colgroup"
                                                    className={`bg-gray-200 px-4 py-2 ${arLang ? 'text-right' : 'text-left'} text-lg font-semibold text-gray-900 sm:px-6`}
                                                >
                                                    {category.name}
                                                </th>
                                            </tr>
                                            {category.specs.map((spec, i) => (
                                                <tr
                                                    key={i}
                                                    className={classNames(i === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}
                                                >
                                                    <td className={`py-4 pl-4 pr-3 text-sm ${arLang ? 'text-right' : 'text-left'} font-medium text-yellow-400 sm:pl-6`}>
                                                        {spec.spec}
                                                    </td>
                                                    <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-6">
                                                        {spec.value}
                                                    </td>
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
