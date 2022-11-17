import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'

const brandsMenu = [
    { name: 'Apple', url: '/brands/apple', img: '/appleLogo.png' },
    { name: 'Samsung', url: '/brands/samsung', img: '/samsungLogo.png' },
    { name: 'Xiaomi', url: '/brands/xiaomi', img: '/xiaomiLogo.png' },
    { name: 'OnePlus', url: '/brands/oneplus', img: '/oneplusLogo.png' },
]

const arabicBrandsMenu = [
    { name: 'ابل', url: '/brands/apple/ar', img: '/appleLogo.png' },
    { name: 'سامسونج', url: '/brands/samsung/ar', img: '/samsungLogo.png' },
    { name: 'شاومي', url: '/brands/xiaomi/ar', img: '/xiaomiLogo.png' },
    { name: 'ون بلص', url: '/brands/oneplus/ar', img: '/oneplusLogo.png' },
]

export default function NavMenu({ nav }: { nav: { name: string, current: boolean } }) {
    const router = useRouter()
    return (
        <div className="text-right">
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    {router.asPath.includes('/ar') ?
                        <Menu.Button
                            className="inline-flex w-full justify-center rounded-md bg-gray-800 bg-opacity-20 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-gray-700 hover:text-white"
                        >
                            <ChevronDownIcon
                                className="mr-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                            />
                            {nav.name}
                        </Menu.Button>
                        :
                        <Menu.Button
                            className="inline-flex w-full justify-center rounded-md bg-gray-800 bg-opacity-20 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 hover:bg-gray-700 hover:text-white"
                        >
                            {nav.name}
                            <ChevronDownIcon
                                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                            />
                        </Menu.Button>}
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
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {!router.asPath.includes('/ar') ? brandsMenu.map((brand, i) =>
                                <Link key={i} href={brand.url}>
                                    <a>
                                        <Menu.Item key={i}>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    {/* {active ? (
                                                        <EditActiveIcon
                                                            className="mr-2 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <EditInactiveIcon
                                                            className="mr-2 h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    )} */}
                                                    <img className='h-7 w-7 mr-2' src={brand.img} />
                                                    {brand.name}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </a>
                                </Link>
                            )
                                :
                                arabicBrandsMenu.map((brand, i) =>
                                    <Link key={i} href={brand.url}>
                                        <a>
                                            <Menu.Item key={i}>
                                                {({ active }) => (
                                                    <button
                                                        className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        <img className='h-7 w-7 mr-2' src={brand.img} />
                                                        {brand.name}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </a>
                                    </Link>
                                )
                            }
                        </div>
                        <div className="px-1 py-1">
                            <Link href={'/brands'}>
                                <a>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                {/* {active ? (
                                                    <DeleteActiveIcon
                                                        className="mr-2 h-5 w-5 text-violet-400"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <DeleteInactiveIcon
                                                        className="mr-2 h-5 w-5 text-violet-400"
                                                        aria-hidden="true"
                                                    />
                                                )} */}
                                                {router.asPath.includes('/ar') ? 'عرض كل الماركات' : 'Show All Brands'}
                                            </button>
                                        )}
                                    </Menu.Item>
                                </a>
                            </Link>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu >
        </div >
    )
}
