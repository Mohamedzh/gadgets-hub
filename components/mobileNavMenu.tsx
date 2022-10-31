import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'
import React from 'react'

const brandsMenu = [
    { name: 'Apple', url: '/brands/apple' },
    { name: 'Samsung', url: '/brands/samsung' },
    { name: 'Xiaomi', url: '/brands/xiaomi' },
    { name: 'OnePlus', url: '/brands/oneplus' },
]

type Props = {
    item: { name: string; current: boolean; href: string; }
}

function MobileNavMenu({ item }: Props) {
    return (
        <Disclosure>
            {({ open }) => (
                <>
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
                    <Disclosure.Panel className="lg:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                            {brandsMenu.map(brand =>
                                <Link href={brand.url}>
                                    <Disclosure.Button
                                        as="a"
                                        className="block rounded-md text-center bg-gray-900 px-3 py-2 text-base font-medium text-white hover:bg-gray-400 hover:text-black cursor-pointer"
                                    >
                                        {brand.name}
                                    </Disclosure.Button>
                                </Link>
                            )}
                            <Link href="/brands">
                                <Disclosure.Button
                                    as="a"
                                    className="block rounded-md px-3 py-2 text-center bg-gray-900 text-base font-medium text-gray-300 hover:bg-gray-400 hover:text-black cursor-pointer"
                                >
                                    Show All Brands
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

