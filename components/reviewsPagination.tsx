import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { Review } from '@prisma/client'
import { Dispatch, SetStateAction, useState } from 'react'
import { PhoneSummary } from '../pages/brands/[brand]'

export default function Pagination(
    { setPage, pageNo, page, reviews }:
        { setPage: Dispatch<SetStateAction<number>>, pageNo: number, page: number, reviews: Review[] }
) {
    let pagesArray = Array.from(Array(pageNo).keys())
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">
                            {page * 30 - 29} </span>
                        to{' '}
                        <span className="font-medium">
                            {(page * 30 > reviews.length ? reviews.length : page * 30)}
                        </span> of{' '}
                        <span className="font-medium">{reviews.length}</span> results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            disabled={(page === 1 ? true : false)}
                            onClick={() => setPage(page - 1)}
                            className={`border-r-indigo-500 relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 enabled:hover:bg-gray-900 enabled:hover:text-white enabled:hover:border-gray-700 focus:z-20`}
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </button>

                        {page > 4 &&
                            <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                                ...
                            </span>
                        }
                        {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}
                        {pagesArray.map((pager, i) =>
                            <button
                                key={i}
                                onClick={() => setPage(i + 1)}
                                aria-current="page"
                                className={`${(i + 1 > page + 3 || i + 1 < page - 3 ? 'hidden' : '')} hover:bg-blue-800 focus:bg-blue-800 hover:text-white focus:text-white relative z-10 inline-flex items-center border border-indigo-500 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 focus:z-20`}
                            >
                                {i + 1}
                            </button>
                        )}
                        {page < pagesArray.length - 3 &&
                            <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                                ...
                            </span>
                        }
                        <button
                            disabled={(page === 1 ? true : false)}
                            onClick={() => setPage(page + 1)}
                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 enabled:hover:bg-gray-900 enabled:hover:text-white enabled:hover:border-gray-700 focus:z-20"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}
