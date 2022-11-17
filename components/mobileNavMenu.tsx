import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { MutableRefObject } from 'react'

const brandsMenu = [
    { name: 'Apple', url: '/brands/apple' },
    { name: 'Samsung', url: '/brands/samsung' },
    { name: 'Xiaomi', url: '/brands/xiaomi' },
    { name: 'OnePlus', url: '/brands/oneplus' },
]

const arabicBrandsMenu = [
    { name: 'ابل', url: '/brands/apple/ar', img: '/appleLogo.png' },
    { name: 'سامسونج', url: '/brands/samsung/ar', img: '/samsungLogo.png' },
    { name: 'شاومي', url: '/brands/xiaomi/ar', img: '/xiaomiLogo.png' },
    { name: 'ون بلص', url: '/brands/oneplus/ar', img: '/oneplusLogo.png' },
]

type Props = {
    item: { name: string; current: boolean; href: string; },
    close: (focusableElement?: HTMLElement | MutableRefObject<HTMLElement | null> | undefined) => void
}

function MobileNavMenu({ item, close }: Props) {
    const router = useRouter()
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    {router.asPath.includes('/ar') ?
                        <Disclosure.Button
                            as="button"
                            className="flex rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                        >
                            <ChevronDownIcon
                                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                            />
                            {item.name}
                        </Disclosure.Button>
                        :
                        <Disclosure.Button
                            as="button"
                            className="flex rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left"
                        >
                            {item.name}
                            <ChevronDownIcon
                                className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                            />
                        </Disclosure.Button>
                    }

                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            {!router.asPath.includes('/ar') ? brandsMenu.map((brand, i) =>
                                <Link key={i} href={brand.url}>
                                    <Disclosure.Button
                                        onClick={() => close()}
                                        as="a"
                                        className="block rounded-md text-center bg-gray-900 px-3 py-2 text-base font-medium text-white hover:bg-gray-400 hover:text-black cursor-pointer"
                                    >
                                        {brand.name}
                                    </Disclosure.Button>
                                </Link>
                            ) :
                                arabicBrandsMenu.map((brand, i) =>
                                    <Link key={i} href={brand.url}>
                                        <Disclosure.Button
                                            onClick={() => close()}
                                            as="a"
                                            className="block rounded-md text-center bg-gray-900 px-3 py-2 text-base font-medium text-white hover:bg-gray-400 hover:text-black cursor-pointer"
                                        >
                                            {brand.name}
                                        </Disclosure.Button>
                                    </Link>
                                )
                            }
                            <Link href="/brands">
                                <Disclosure.Button
                                    as="a"
                                    className="block rounded-md px-3 py-2 text-center bg-gray-900 text-base font-medium text-gray-300 hover:bg-gray-400 hover:text-black cursor-pointer"
                                >
                                    {router.asPath.includes('/ar') ? 'عرض كل الماركات' : 'Show All Brands'}
                                </Disclosure.Button>
                            </Link>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default MobileNavMenu

