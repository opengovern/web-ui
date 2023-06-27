import React, { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    ArrowTrendingUpIcon,
    Bars3Icon,
    BellIcon,
    Cog6ToothIcon,
    CubeIcon,
    DocumentChartBarIcon,
    HomeIcon,
    ShieldCheckIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'

import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const navigation = [
    {
        name: 'Home',
        page: 'home',
        icon: HomeIcon,
    },
    {
        name: 'Insight',
        page: 'insight',
        icon: DocumentChartBarIcon,
    },
    { name: 'Assets', page: 'assets', icon: CubeIcon },
    {
        name: 'Spend',
        page: 'spend',
        icon: ArrowTrendingUpIcon,
    },
    {
        name: 'Compliance',
        page: 'compliance',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Settings',
        page: 'settings',
        icon: Cog6ToothIcon,
    },
]
const userNavigation = [
    { name: 'Your profile', href: '#' },
    { name: 'Sign out', href: '/logout' },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

type IProps = {
    children: React.ReactNode
    currentPage:
        | 'home'
        | 'insight'
        | 'assets'
        | 'spend'
        | 'compliance'
        | 'settings'
    showSidebar?: boolean
}

export default function LoggedInLayout({
    children,
    currentPage,
    showSidebar = true,
}: IProps) {
    const workspace = useParams<{ ws: string }>().ws
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { user } = useAuth0()

    const sidebar = (
        <>
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-50 lg:hidden"
                    onClose={setSidebarOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="transition-opacity ease-linear duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/80" />
                    </Transition.Child>

                    <div className="fixed inset-0 flex">
                        <Transition.Child
                            as={Fragment}
                            enter="transition ease-in-out duration-300 transform"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transition ease-in-out duration-300 transform"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button
                                            type="button"
                                            className="-m-2.5 p-2.5"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close sidebar
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6 text-white"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <img
                                            className="h-8 w-auto"
                                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                                            alt="Your Company"
                                        />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                        <ul
                                            role="list"
                                            className="flex flex-1 flex-col gap-y-7"
                                        >
                                            <li>
                                                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                                <ul
                                                    role="list"
                                                    className="-mx-2 space-y-1"
                                                >
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                to={`/${workspace}/${item.page}`}
                                                                className={classNames(
                                                                    item.page ===
                                                                        currentPage
                                                                        ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800 dark:text-white'
                                                                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                            >
                                                                <item.icon
                                                                    className="h-6 w-6 shrink-0"
                                                                    aria-hidden="true"
                                                                />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            className="h-8 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                            alt="Your Company"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                        <ul
                            role="list"
                            className="flex flex-1 flex-col gap-y-7"
                        >
                            <li>
                                {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={`/${workspace}/${item.page}`}
                                                className={classNames(
                                                    item.page === currentPage
                                                        ? 'bg-blue-900/50 text-gray-200'
                                                        : 'text-gray-300 hover:bg-blue-900/50',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                )}
                                            >
                                                <item.icon
                                                    className="h-6 w-6 shrink-0"
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    )

    return (
        <div>
            {showSidebar && sidebar}
            <div className={showSidebar ? 'lg:pl-72' : ''}>
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        {' '}
                        {/* dark mode??? */}
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon
                            className="h-6 w-6 dark:text-gray-300"
                            aria-hidden="true"
                        />
                    </button>

                    {/* Separator */}
                    <div
                        className="h-6 w-px bg-gray-900/10 dark:bg-white/20 lg:hidden"
                        aria-hidden="true"
                    />

                    <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                        {/* <form */}
                        {/*    className="relative flex flex-1" */}
                        {/*    action="#" */}
                        {/*    method="GET" */}
                        {/* > */}
                        {/*    /!* eslint-disable-next-line jsx-a11y/label-has-associated-control *!/ */}
                        {/*    <label htmlFor="search-field" className="sr-only"> */}
                        {/*        Search */}
                        {/*    </label> */}
                        {/*    <MagnifyingGlassIcon */}
                        {/*        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 dark:text-gray-300" */}
                        {/*        aria-hidden="true" */}
                        {/*    /> */}
                        {/*    <input */}
                        {/*        id="search-field" */}
                        {/*        className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 dark:text-white dark:placeholder:text-gray-400 dark:bg-gray-900 focus:ring-0 sm:text-sm" */}
                        {/*        placeholder="Search..." */}
                        {/*        type="search" */}
                        {/*        name="search" */}
                        {/*    /> */}
                        {/* </form> */}
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <button
                                type="button"
                                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">
                                    View notifications
                                </span>
                                <BellIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>

                            {/* Separator */}
                            <div
                                className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10 lg:dark:bg-white/20"
                                aria-hidden="true"
                            />

                            {/* Profile dropdown */}
                            <Menu as="div" className="relative">
                                <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                    <span className="sr-only">
                                        Open user menu
                                    </span>
                                    {user?.picture && (
                                        <img
                                            className="h-8 w-8 rounded-full bg-gray-50"
                                            src={user.picture}
                                            alt=""
                                        />
                                    )}

                                    <span className="hidden lg:flex lg:items-center">
                                        <span
                                            className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200"
                                            aria-hidden="true"
                                        >
                                            {user?.name || user?.email || ''}
                                        </span>
                                        <ChevronDownIcon
                                            className="ml-2 h-5 w-5 text-gray-400"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                        {userNavigation.map((item) => (
                                            <Menu.Item key={item.name}>
                                                {({ active }) => (
                                                    <Link
                                                        to={item.href}
                                                        className={classNames(
                                                            active
                                                                ? 'bg-gray-50'
                                                                : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>
                </div>

                <main className="xl:pl-36 xl:pr-36 dark:bg-gray-900">
                    <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
