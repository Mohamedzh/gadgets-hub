import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { classNames } from '../lib/functions'
import Link from 'next/link'
import NewMenu from '../components/menu'
import SignUp from './signUpModal'
import { createBrowserSupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import Login from './loginModal'
import MobileNavMenu from './mobileNavMenu'
import { useRouter } from 'next/router'
import LanguageMenu from './languageMenu'

const navMenu = [
    { name: 'الأخبار', current: false, href: '/news/ar' },
    { name: 'التقييمات', current: false, href: '/reviews/ar' },
    { name: 'ابحث عن تليفون', current: false, href: '/phonefinder/ar' },
    { name: 'الماركات', current: false, href: '#' },
    { name: 'مقارنة', current: false, href: '/compare/ar' }
]

export const profileMenu = [
    { name: 'حسابي' },
    { name: 'تسجيل خروج' },
]

export default function Navbar() {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient())
    const [openSignUp, setOpenSignUp] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)

    const router = useRouter()
    const user = useUser()

    const [currentUser, setCurrentUser] = useState<User>()

    useEffect(() => {
        if (user) { setCurrentUser(user) }
    }, [user])


    return (
        <div
            className='sticky top-0 z-50 ar'
        >
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl sm:px-4 lg:px-8">
                            <div className="relative flex h-16 items-center justify-between">
                                <div className="flex items-center px-2 lg:px-0">
                                    <div className="flex-shrink-0">
                                        <Link href='/ar'>
                                            <a>
                                                <img
                                                    className="block h-8 w-auto lg:hidden"
                                                    src="/mobileLogo.png"
                                                    alt="Gadgets Hub"
                                                />
                                                <p className='lg:hidden text-sm text-gray-200 font-mono font-semibold'>Gadgets Hub</p>
                                            </a>
                                        </Link>
                                        <Link href='/ar'>
                                            <a>
                                                <img
                                                    className="hidden h-8 w-auto lg:block"
                                                    src="/mobileLogo.png"
                                                    alt="Gadgets Hub"
                                                />
                                                <p className='hidden lg:block text-gray-200 font-mono font-semibold'>Gadgets Hub</p>
                                            </a>
                                        </Link>
                                    </div>
                                    <div className="hidden lg:ml-6 lg:block">
                                        <div className="flex space-x-4">
                                            {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                            {navMenu.map((nav, i) =>
                                                <Link key={i} href={nav.href}>
                                                    <a className={`${nav.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} rounded-md ${nav.name !== 'الماركات' ? 'px-3 py-2' : ''} text-sm font-medium text-white place-self-center`}>
                                                        {nav.name !== 'الماركات' && nav.name}
                                                        {nav.name === 'الماركات' && <NewMenu nav={nav} />}
                                                    </a>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
                                    <LanguageMenu />
                                    {/* <div className="w-full max-w-lg lg:max-w-xs">
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
                                    </div> */}
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

                                                <Login openLogin={openLogin} setOpenLogin={setOpenLogin} setOpenSignUp={setOpenSignUp} setCurrentUser={setCurrentUser} />
                                                <SignUp openSignUp={openSignUp} setOpenSignUp={setOpenSignUp} setOpenLogin={setOpenLogin} setCurrentUser={setCurrentUser} />

                                                {currentUser ?
                                                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        {/* <img
                                                            className="h-8 w-8 rounded-full"
                                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                            alt=""
                                                        /> */}
                                                        <div className='flex flex-col px-2'>
                                                            <p className='text-lg font-semibold'>
                                                                {currentUser.user_metadata.nickName}
                                                            </p>
                                                            <p className='text-sm '>
                                                                {currentUser.email}
                                                            </p>
                                                        </div>
                                                    </Menu.Button> :
                                                    <button
                                                        onClick={() => setOpenLogin(true)}
                                                        className=' p-2 font-semibold text-white hover:text-blue-600'>
                                                        تسجيل دخول / مستخدم جديد
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
                                                                    <button
                                                                        onClick={() => router.push('/profile')}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700 w-full font-semibold'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </button>
                                                                    :
                                                                    <button
                                                                        onClick={async () => { await supabaseClient.auth.signOut(); setCurrentUser(undefined); if (router.asPath = '/profile') { router.push('/') } }}
                                                                        className={classNames(
                                                                            active ? 'bg-gray-100' : '',
                                                                            'block px-4 py-2 text-sm text-gray-700 cursor-pointer w-full font-semibold'
                                                                        )}
                                                                    >
                                                                        {item.name}
                                                                    </button>
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
                            {({ close }) =>
                                <>
                                    <div className="space-y-1 px-2 pt-2 pb-3 flex flex-col">
                                        {/* Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" */}
                                        {navMenu.map((item, i) =>
                                            item.name === 'الماركات' ?
                                                <MobileNavMenu close={close} key={item.name} item={item} />
                                                :
                                                <Link key={item.name} href={item.href}>
                                                    <Disclosure.Button
                                                        as="a"
                                                        onClick={() => close()}
                                                        className={`block rounded-md bg-gray-900 px-3 ${item.name !== 'الماركات' ? 'py-2' : 'flex place-items-start place-content-start '} text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer`}
                                                    >
                                                        {item.name !== 'الماركات' && item.name}
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
                                            {currentUser !== null ?
                                                <div className="ml-3">
                                                    <div className="text-base font-medium text-white">{currentUser?.user_metadata.nickName}</div>
                                                    <div className="text-sm font-medium text-gray-400">{currentUser?.email}</div>
                                                </div> :
                                                <div className="ml-3">
                                                    <div className="text-base font-medium text-white">تسجيل دخول / مستخدم جديد</div>
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
                                        {currentUser ?
                                            <div className="mt-3 space-y-1 px-2">
                                                {profileMenu.map((item, i) =>
                                                    i === 0 ?
                                                        <Disclosure.Button
                                                            onClick={() => { close(); router.push('/profile') }}
                                                            key={i}
                                                            as="button"

                                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                                        >
                                                            {item.name}
                                                        </Disclosure.Button>
                                                        :
                                                        <Disclosure.Button
                                                            onClick={async () => { await supabaseClient.auth.signOut(); setCurrentUser(undefined); if (router.asPath = '/profile') { router.push('/') } }}
                                                            key={i}
                                                            as="button"
                                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                                        >
                                                            {item.name}
                                                        </Disclosure.Button>
                                                )}
                                            </div> :
                                            <button
                                                onClick={() => { setOpenLogin(true); close() }}
                                                className=' p-2 font-semibold text-white hover:text-blue-600 ml-3'
                                            >
                                                تسجيل دخول / مستخدم جديد
                                            </button>
                                        }
                                    </div>
                                </>
                            }
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div >
    )
}
