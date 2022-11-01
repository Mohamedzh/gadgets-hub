import { Fragment, useEffect, useState } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import { classNames, paginate, phoneSortAZ } from '../lib/functions'
import PhoneList from './phoneList'
import { PhoneSummary } from '../pages/brands/[brand]'
import Price from './priceFilter'
import DateFilter from './dateFilter'
import Pagination from './brandPhonesPagination'
import _ from 'lodash'
import { EURPrice, Phone } from '@prisma/client'
import { PhoneWithPrice } from '../types'

const sortOptions = [
    { name: 'A-Z', function: 'sort', current: false },
    { name: 'Z-A', function: 'sort', current: false },
    { name: 'Most Popular', function: '#', current: true },
    { name: 'Best Rating', function: '#', current: false },
    { name: 'Newest', function: '#', current: false },
    { name: 'Price: Low to High', function: '#', current: false },
    { name: 'Price: High to Low', function: '#', current: false },
]


export default function PhoneFilter({ phones, brand }: { phones: PhoneWithPrice[], brand: string }) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [page, setPage] = useState(1)
    const [pageNo, setPageNo] = useState(1)
    const [sortedPhones, setSortedPhones] = useState<PhoneWithPrice[]>(phones)
    const currentPhones = paginate(page, 40, sortedPhones)

    useEffect(() => { setPageNo(Math.ceil(sortedPhones.length / 40)) }, [sortedPhones])

    const sorting = (sortedPhones: PhoneWithPrice[], option: string) => {
        if (option === 'A-Z') {
            setSortedPhones(_.sortBy(sortedPhones, ['name']))

        } else if (option === 'Z-A') {
            setSortedPhones(_.orderBy(sortedPhones, 'name', 'desc'))
        }
    }

    return (
        <div className="bg-gray-900">
            <div>
                {/* Mobile filter dialog */}
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold text-blue-300">{phones[0].brandName.toUpperCase()}</h1>

                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-100 hover:text-gray-400">
                                        Sort
                                        <ChevronDownIcon
                                            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="py-1">
                                            {sortOptions.map((option) => (
                                                <Menu.Item key={option.name}>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() => sorting(currentPhones, option.name)}
                                                            // href={option.href}
                                                            className={classNames(
                                                                option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                                active ? 'bg-gray-100' : '',
                                                                'block px-4 py-2 text-sm'
                                                            )}
                                                        >
                                                            {option.name}
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            ))}
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            {/* <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                            </button> */}
                            <button
                                type="button"
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                                onClick={() => setMobileFiltersOpen(true)}
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">
                            Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                            <form className="hidden lg:block">
                                {/* <Price phones={phones} setSortedPhones={setSortedPhones} sortedPhones={sortedPhones} /> */}
                                <DateFilter sortedPhones={sortedPhones} phones={phones} setSortedPhones={setSortedPhones} />
                            </form>

                            {/* Product grid */}
                            <div className="lg:col-span-3">
                                {/* Replace with your content */}
                                {/* <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 lg:h-full" /> */}
                                {/* /End replace */}
                                <div className='lg:hidden'>
                                    {/* <Price phones={phones} setSortedPhones={setSortedPhones} sortedPhones={sortedPhones} /> */}
                                    <DateFilter phones={phones} sortedPhones={sortedPhones} setSortedPhones={setSortedPhones} />
                                </div>
                                <PhoneList currentPhones={currentPhones} />
                                <Pagination setPage={setPage} pageNo={pageNo} page={page} phones={sortedPhones} />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
