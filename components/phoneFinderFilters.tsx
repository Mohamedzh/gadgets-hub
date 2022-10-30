import { Fragment, PropsWithRef, useState } from 'react'
import { Dialog, Disclosure, Menu, Popover, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames, monthNumberFromString } from '../lib/functions'
import _ from 'lodash'
import { Brand, PhoneQuickSpecs } from '@prisma/client'
import BrandSearchBar from './phoneFinderBrandSearchBar'
import OsSearchBar from './phoneFinderOsSearchBar'
import { PhoneFilter } from '../types'
import PhoneResultList from './phoneFinderResultsList'
import { convertBatterySize, convertDate, convertDisplaySize, convertOS, convertRAM, filterSearch } from '../lib/filterFunctions'
import { useAppSelector } from '../redux/hooks'
import { useDispatch } from 'react-redux'
import { addToFilters, clearActiveFilters, removeFromFilters } from '../redux/slices/activeFiltersSlice'
import { addToRam, clearRamFilter, removeFromRam } from '../redux/slices/ramFilterSlice'
import { addToDisplaySize, clearDisplaySizeFilter, removeFromDisplaySize } from '../redux/slices/displaySizeFilterSlice'
import { addToBatterySize, clearBatterySizeFilter, removeFromBatterySize } from '../redux/slices/batterySizeFilterSlice'
import { clearBrandFilter } from '../redux/slices/brandFilterSlice'
import { clearOSFilter } from '../redux/slices/osFilterSlice'


const sortOptions = [
    { name: 'Most Popular', href: '#', current: true },
    { name: 'Best Rating', href: '#', current: false },
    { name: 'Newest', href: '#', current: false },
]
const filters = [
    {
        id: 'ramSize',
        name: 'RAM Size',
        options: [
            { value: '<4', label: 'Less than 4GB', checked: false },
            { value: '4-8', label: '4 - 8GB', checked: false },
            { value: '8-12', label: '8 - 12GB', checked: false },
            { value: '>12', label: 'More than 12GB', checked: false },
        ],
    },
    {
        id: 'batterySize',
        name: 'Battery Size',
        options: [
            { value: '<3000', label: 'Less than 3000maH', checked: false },
            { value: '3000-4500', label: '3000 - 4500mAH', checked: false },
            { value: '4500-5000', label: '4500 - 5000mAH', checked: false },
            { value: '>5000', label: 'More than 5000mAH', checked: false },
        ],
    },
    {
        id: 'displaySize',
        name: 'Display Size',
        options: [
            { value: '<4', label: 'Less than 4"', checked: false },
            { value: '4-6', label: '4 - 6"', checked: false },
            { value: '6-8', label: '6 - 8"', checked: false },
            { value: '>6', label: 'More than 6"', checked: false },
        ],
    },
]
// const activeFilters = [{ value: 'objects', label: 'Objects' }]

type Props = {
    quickSpecs: PhoneQuickSpecs[]
    brands: { name: string }[]
    phones: PhoneFilter[]
}

export default function Filters({ quickSpecs, brands, phones }: Props) {
    const [open, setOpen] = useState(false)

    const [showResults, setShowResults] = useState<boolean>(false)

    const dispatch = useDispatch()

    const activeFilters = useAppSelector(state => state.activeFilters)
    const filterBrands = useAppSelector(state => state.brandFilter)
    const filterOS = useAppSelector(state => state.osFilter)
    const filterRam = useAppSelector(state => state.ramFilter)
    const filterDisplaySize = useAppSelector(state => state.displaySizeFilter)
    const filterBatterySize = useAppSelector(state => state.batterySizeFilter)

    const [currentPhones, setCurrentPhones] = useState<PhoneFilter[]>([])


    const setFilterChoices = (sectionName: string, option: string) => {
        if (sectionName === 'ramSize') {
            if (filterRam.includes(option)) { dispatch(removeFromRam(option)) } else {
                dispatch(addToRam(option))
            }
        } else if (sectionName === 'displaySize') {
            if (filterDisplaySize.includes(option)) { dispatch(removeFromDisplaySize(option)) } else {
                dispatch(addToDisplaySize(option))
            }
        } else if (sectionName === 'batterySize') {
            if (filterBatterySize.includes(option)) { dispatch(removeFromBatterySize(option)) } else {
                dispatch(addToBatterySize(option))
            }
        }
    }

    const setFilterNumber = (sectionName: string) => {
        let arr: string[] = []
        if (sectionName === 'ramSize') {
            arr = filterRam
        } else if (sectionName === 'displaySize') {
            arr = filterDisplaySize
        } else if (sectionName === 'batterySize') {
            arr = filterBatterySize
        }
        return arr.length
    }

    for (let i = 0; i < phones.length; i++) {
        phones[i].PhoneQuickSpecs.map(quickSpec => {
            if (quickSpec.quickspecName === 'RAM size' && quickSpec.value.length > 0) {
                quickSpec.value = convertRAM(quickSpec.value)
            } else if (quickSpec.quickspecName === 'Display size' && quickSpec.value.length > 0) {
                quickSpec.value = convertDisplaySize(quickSpec.value)
            } else if (quickSpec.quickspecName === 'Battery size' && quickSpec.value.length > 0) {
                quickSpec.value = convertBatterySize(quickSpec.value)
            } else if (quickSpec.quickspecName === 'Release date' && quickSpec.value && quickSpec.value.length > 0) {
                quickSpec.value = convertDate(quickSpec.value)
            } else if (quickSpec.quickspecName === 'OS' && quickSpec.value.length > 0) {
                quickSpec.value = convertOS(quickSpec.value)
            }
        })
    }



    const uniqueSpecNames = _.uniqBy(quickSpecs, 'quickspecName')
    const uniqueValues = _.uniqBy(quickSpecs, 'value')

    let uniquesSpecs: { name: string, options: string[] }[] = uniqueSpecNames.map(item => {
        return { id: item.quickspecName, name: item.quickspecName, options: [] }
    })

    for (let i = 0; i < uniquesSpecs.length; i++) {
        uniqueValues.map(item => {
            if (item.quickspecName === uniquesSpecs[i].name) {
                uniquesSpecs[i].options.push(item.value)
            }
        })
    }
    let displaySize = uniquesSpecs.find(spec => spec.name === 'Display size')?.options.map(option => {
        return {
            option: Number(option.slice(0, option.indexOf('"')))
        }
    })


    let date = uniquesSpecs.find(spec => spec.name === 'Release date')?.options.map(option => {
        let year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
        let month = option.slice(option.indexOf(',') + 2, option.lastIndexOf(" ")).slice(0, 3)
        month = monthNumberFromString(month.toLowerCase())
        let day = (option.slice(option.lastIndexOf(' ') + 1).length === 0 ? '00' : option.slice(option.lastIndexOf(' ') + 1))
        let dateNum
        if (option === 'Cancelled') {
            dateNum = null
        } else if (option.indexOf('Exp') === 0) {
            year = option.slice(option.indexOf('2'), option.indexOf('2') + 4)
            month = monthNumberFromString(option.slice(option.lastIndexOf(' ')).toLowerCase())
            dateNum = year + month + '00'
        } else if (option.slice(option.lastIndexOf(' ')).length > 2) {
            year = option.slice(option.indexOf(' '), option.indexOf(' ') + 5)
            month = option.slice(option.indexOf(',') + 2).slice(0, 3)
            month = monthNumberFromString(month.toLowerCase())
            dateNum = year + month + '00'
        }
        else {
            dateNum = year + month + day
        }
        return {
            option: (dateNum)
        }
    })

    let os = uniquesSpecs.find(spec => spec.name === 'OS')?.options.map(option => {
        let system
        if (option.indexOf(',') === -1) {
            system = option.slice(0)
        } else {
            system = option.slice(0, option.indexOf(','))
        }
        return {
            name: system
        }
    })
    console.log(uniquesSpecs);

    let ramSize = uniquesSpecs.find(spec => spec.name === 'RAM size')?.options.map(option => {
        let system
        if (option.indexOf('/') !== -1) {
            system = option.slice(0, option.indexOf('/'))
        } else if (option.indexOf('-') !== -1) {
            system = option.slice(0, option.indexOf('-'))
        } else if (option.indexOf('MB') !== -1) {
            system = '0.' + option.slice(0, option.indexOf('MB'))
        } else {
            system = option.slice(0, option.indexOf('G'))
        }
        return {
            option: (system)
        }
    })

    let batterySize = uniquesSpecs.find(spec => spec.name === 'Battery size')?.options.map(option => {
        let system
        system = option.slice(0, option.indexOf('m'))
        if (system === '') {
            system = null
        }
        return {
            option: Number(system)
        }
    })


    return (
        <div className="">
            {/* Mobile filter dialog */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-40 sm:hidden" onClose={setOpen}>
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
                                        onClick={() => setOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <form className="mt-4">
                                    {filters.map((section) => (
                                        <Disclosure as="div" key={section.name} className="border-t border-gray-200 px-4 py-6">
                                            {({ open }) => (
                                                <>
                                                    <h3 className="-mx-2 -my-3 flow-root">
                                                        <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                                                            <span className="font-medium text-gray-900">{section.name}</span>
                                                            <span className="ml-6 flex items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-5 w-5 transform')}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </h3>
                                                    <Disclosure.Panel className="pt-6">
                                                        <div className="space-y-6">
                                                            {section.options.map((option, optionIdx) => (
                                                                <div key={option.value} className="flex items-center">
                                                                    <input
                                                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        name={`${section.id}[]`}
                                                                        defaultValue={option.value}
                                                                        type="checkbox"
                                                                        defaultChecked={option.checked}
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                                                        className="ml-3 text-sm text-gray-500"
                                                                    >
                                                                        {option.label}
                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <div className="mx-auto max-w-7xl pb-8 sm:px-2">
                <p className="mt-4 max-w-xl text-gray-300">
                    Find your phone using a combination of brand and specifications filters.
                </p>
            </div>

            {/* Filters */}
            <section aria-labelledby="filter-heading">
                <h2 id="filter-heading" className="sr-only">
                    Filters
                </h2>

                <div className="border-b border-gray-200 pb-4">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-300 hover:text-gray-400">
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
                                <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {sortOptions.map((option) => (
                                            <Menu.Item key={option.name}>
                                                {({ active }) => (
                                                    <a
                                                        href={option.href}
                                                        className={classNames(
                                                            option.current ? 'font-medium text-gray-900' : 'text-gray-500',
                                                            active ? 'bg-gray-100' : '',
                                                            'block px-4 py-2 text-sm'
                                                        )}
                                                    >
                                                        {option.name}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        <button
                            type="button"
                            className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                            onClick={() => setOpen(true)}
                        >
                            Filters
                        </button>
                        <div className='flex'>
                            <p className='mx-2 place-self-center font-semibold text-blue-300'>Brands</p>
                            <BrandSearchBar dbBrands={brands} />
                        </div>
                        <div className='flex'>
                            <p className='mx-2 place-self-center font-semibold text-blue-300'>OS</p>
                            {os &&
                                <OsSearchBar os={os} />
                            }
                        </div>
                        <div className="hidden sm:block">

                            <div className="flow-root">
                                <Popover.Group className="-mx-4 flex items-center divide-x divide-gray-200">
                                    {filters.map((section, sectionIdx) => (
                                        <Popover key={section.name} className="relative inline-block px-4 text-left">
                                            <Popover.Button className="group inline-flex justify-center text-sm font-medium text-white hover:text-gray-300">
                                                <span>{section.name}</span>
                                                {/* {sectionIdx === 0 ? ( */}
                                                <span className="ml-1.5 rounded bg-gray-200 py-0.5 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                                    {setFilterNumber(section.id)}
                                                </span>
                                                {/* ) : null} */}
                                                <ChevronDownIcon
                                                    className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                                                    aria-hidden="true"
                                                />
                                            </Popover.Button>

                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <form className="space-y-4 z-50 bg-gray-800 p-3 rounded-lg">
                                                        {section.options.map((option, optionIdx) => (
                                                            <div key={option.value} className="flex items-center">
                                                                <input
                                                                    id={`filter-${section.id}-${optionIdx}`}
                                                                    name={`${section.id}[]`}
                                                                    defaultValue={option.value}
                                                                    type="checkbox"
                                                                    defaultChecked={option.checked}
                                                                    onChange={() => {
                                                                        setFilterChoices(section.id, option.value);
                                                                        dispatch(addToFilters({ label: option.label, value: option.value }))
                                                                        option.checked = !option.checked
                                                                    }}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                                                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-300"
                                                                >
                                                                    {option.label}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </form>
                                                </Popover.Panel>
                                            </Transition>
                                        </Popover>
                                    ))}
                                </Popover.Group>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active filters */}
                <div className="border-b-gray-300 border-b">
                    <div className="mx-auto max-w-7xl py-3 px-4 sm:flex sm:items-center sm:px-6 lg:px-8">
                        <h3 className="text-sm font-medium text-gray-400">
                            Filters
                            <span className="sr-only">, active</span>
                        </h3>

                        <div aria-hidden="true" className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block" />

                        <div className="mt-2 sm:mt-0 sm:ml-4">
                            <div className="-m-1 flex flex-wrap items-center">
                                {activeFilters.map((activeFilter, i) => (
                                    <span
                                        key={i}
                                        className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900"
                                    >
                                        <span>{activeFilter.label}</span>
                                        <button
                                            onClick={() => dispatch(removeFromFilters(activeFilter))}
                                            type="button"
                                            className="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                                        >
                                            <span className="sr-only">Remove filter for {activeFilter.label}</span>
                                            <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setCurrentPhones([]);
                                setShowResults(false)
                                dispatch(clearBatterySizeFilter())
                                dispatch(clearBrandFilter())
                                dispatch(clearDisplaySizeFilter())
                                dispatch(clearRamFilter())
                                dispatch(clearOSFilter())
                                dispatch(clearActiveFilters())
                                console.log(currentPhones)
                            }}
                            className='font-semibold hover:bg-red-600 hover:text-white active:scale-95 duration-50 transition text-lg mx-10 p-3 text-red-600 bg-white rounded-lg self-end'>
                            Clear search fields
                        </button>
                    </div>
                </div>
            </section>
            <div>
                <div className='flex flex-col place-content-center place-items-center'>
                    <button
                        onClick={() => {
                            setCurrentPhones(filterSearch(phones, filterBrands, filterOS, filterRam, filterDisplaySize, filterBatterySize));
                            setShowResults(true)
                        }}
                        className='h-16 active:scale-95 hover:bg-blue-800 hover:text-white font-semibold text-3xl px-20 bg-white my-5 rounded-lg w-max'>
                        Search Now
                    </button>
                    {/* <button
                        onClick={() => {
                            setCurrentPhones([]);
                            setShowResults(false)
                            dispatch(clearBatterySizeFilter())
                            dispatch(clearBrandFilter())
                            dispatch(clearDisplaySizeFilter())
                            dispatch(clearRamFilter())
                            dispatch(clearOSFilter())
                            dispatch(clearActiveFilters())
                            console.log(currentPhones)
                        }}
                        className='h-16 font-semibold text-xl px-10 bg-white my-5 rounded-lg'>
                        Clear search fields
                    </button> */}
                </div>
                <PhoneResultList currentPhones={currentPhones} />
            </div>
        </div>
    )
}
