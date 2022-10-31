import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames } from '../lib/functions'
import Link from 'next/link'
import PopMenu from '../components/popover'
import NewMenu from '../components/menu'
import SignUp from './signUpModal'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import Login from './loginModal'
import MobileNavMenu from './mobileNavMenu'

const navMenu = [
    { name: 'News', current: false, href: '/news' },
    { name: 'Reviews', current: false, href: '/reviews' },
    { name: 'Phone Finder', current: false, href: '/phonefinder' },
    { name: 'Brands', current: false, href: '#' },
    { name: 'Comparison', current: false, href: '/compare' }
]

export const profileMenu = [
    { name: 'Your profile' },
    { name: 'Sign out' },
]

export default function Navbar() {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())
    const [openSignUp, setOpenSignUp] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)


    const user = useUser()
    if (user) {
        console.log(user);

    }

    console.log(user);

    // useEffect(() => {
    //     console.log(user);
    // }, [user])

    return (
        <div
            className='sticky top-0 z-50'
        >
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl sm:px-4 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex items-center px-2 lg:px-0">
                                    <div className="flex-shrink-0">
                                        <Link href='/'>
                                            <a>
                                                <img
                                                    className="block h-8 w-auto lg:hidden"
                                                    src="/mobileLogo.png"
                                                    alt="Your Company"
                                                />
                                            </a>
                                        </Link>
                                        <Link href='/'>
                                            <a>
                                                <img
                                                    className="hidden h-8 w-auto lg:block"
                                                    src="mobileLogo.png"
                                                    alt="Your Company"
                                                />
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="hidden lg:ml-6 lg:block">
                                        <div className="flex space-x-4">
                                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                            {navMenu.map((nav, i) =>
                                                <Link key={i} href={nav.href}>
                                                    <a className={`${nav.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md ${nav.name !== 'Brands' ? 'px-3 py-2' : ''} text-sm font-medium text-white place-self-center`}>
                                                        {nav.name !== 'Brands' && nav.name}
                                                        {nav.name === 'Brands' && <NewMenu nav={nav} />}
                                                        {/* <PopMenu /> */}
                                                    </a>
                                                </Link>
                                            )}
                                        </div>

                                    </div>
                                </div>
                                <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                                    <div className="w-full max-w-lg lg:max-w-xs">
                                        <label htmlFor="search" className="sr-only">
                                            Search
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                            </div>
                                            <input
                                                id="search"
                                                name="search"
                                                className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-white focus:bg-white focus:text-gray-900 focus:outline-none focus:ring-white sm:text-sm"
                                                placeholder="Search"
                                                type="search"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex lg:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="hidden lg:ml-4 lg:block">
                                    <div className="flex items-center">
                                        {/* <button
                                            type="button"
                                            className="flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button> */}

                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-4 flex-shrink-0">
                                            <div>

                                                <Login openLogin={openLogin} setOpenLogin={setOpenLogin} setOpenSignUp={setOpenSignUp} />
                                                <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} />

                                                {user ?
                                                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        {/* <img
                                                            className="h-8 w-8 rounded-full"
                                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                            alt=""
                                                        /> */}
                                                        <p className='text-lg p-2 font-semibold'>
                                                            {user.user_metadata.nickName}
                                                        </p>
                                                    </Menu.Button> :
                                                    <button
                                                        onClick={() => setOpenLogin(true)}
                                                        className=' p-2 font-semibold text-white hover:text-blue-600'>
                                                        Login/Signup
                                                    </button>
                                                }
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
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    {profileMenu.map((item, i) =>
                                                        <Menu.Item key={i}>
                                                            {({ active }) => (
                                                                i === 0 ?
                                                                    <a
                                                                        href="#"
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a> :
                                                                    <a
                                                                        onClick={() => supabaseClient.auth.signOut()}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700 cursor-pointer'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </a>
                                                            )}
                                                        </Menu.Item>
                                                    )}
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="lg:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3 flex flex-col">
                                {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                {navMenu.map((item, i) =>
                                    item.name === 'Brands' ?
                                        <MobileNavMenu key={i} item={item} />
                                        :
                                        <Link key={i} href={item.href}>
                                            <Disclosure.Button
                                                as="a"
                                                className={`block rounded-md bg-gray-900 px-3 ${item.name !== 'Brands' ? 'py-2' : 'flex place-items-start place-content-start '} text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer`}
                                            >
                                                {item.name !== 'Brands' && item.name}
                                            </Disclosure.Button>
                                        </Link>
                                )}

                            </div>
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        {/* <img
                                            className="h-10 w-10 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt=""
                                        /> */}
                                    </div>
                                    {user !== null ?
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-white">{user?.user_metadata.nickName}</div>
                                            <div className="text-sm font-medium text-gray-400">{user?.email}</div>
                                        </div> :
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-white">Login/Signup</div>
                                            {/* <div className="text-sm font-medium text-gray-400">{user?.email}</div> */}
                                        </div>}
                                    {/* <button
                                        type="button"
                                        className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    >
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                                    </button> */}
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    {profileMenu.map((item, i) =>
                                        <Disclosure.Button
                                            key={i}
                                            as="a"
                                            href="#"
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    )}
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div >
    )
}
