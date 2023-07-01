import React, { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    Bars3Icon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    CommandLineIcon,
    CubeIcon,
    DocumentChartBarIcon,
    MoonIcon,
    QuestionMarkCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useParams } from 'react-router-dom'
import { Flex, Title } from '@tremor/react'
import { useAtom, useAtomValue } from 'jotai'
import { ReactComponent as KaytuLogo } from '../../assets/icons/logo-dark-sqare-sm-glyph 2.svg'
import { sideBarCollapsedAtom } from '../../store'

const navigation = [
    // {
    //     name: 'Home',
    //     page: 'home',
    //     icon: HomeIcon,
    // },
    { name: 'Assets', page: 'assets', icon: CubeIcon },
    {
        name: 'Insight',
        page: 'insight',
        icon: DocumentChartBarIcon,
    },
    // {
    //     name: 'Spend',
    //     page: 'spend',
    //     icon: ArrowTrendingUpIcon,
    // },
    // {
    //     name: 'Compliance',
    //     page: 'compliance',
    //     icon: ShieldCheckIcon,
    // },
    {
        name: 'Settings',
        page: 'settings',
        icon: Cog6ToothIcon,
    },
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
    const { user, logout } = useAuth0()
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)

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
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4 ring-1 ring-white/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <KaytuLogo className="h-8 w-auto" />
                                    </div>
                                    <nav className="flex flex-1 flex-col">
                                        <ul className="flex flex-1 flex-col gap-y-7">
                                            <li>
                                                <ul className="-mx-2 space-y-1">
                                                    {navigation.map((item) => (
                                                        <li key={item.name}>
                                                            <Link
                                                                to={`/${workspace}/${item.page}`}
                                                                className={classNames(
                                                                    item.page ===
                                                                        currentPage
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static sidebar for desktop */}
            <div
                className={`hidden h-full ease-in-out ${
                    collapsed ? 'w-fit' : 'min-w-80 w-80'
                } lg:flex lg:flex-col`}
            >
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <Flex
                    flexDirection="col"
                    className="h-full w-full gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4"
                >
                    <Flex
                        alignItems="center"
                        justifyContent="start"
                        className="mt-2 h-16 shrink-0"
                    >
                        <KaytuLogo />
                        {!collapsed && (
                            <Title className="text-slate-50">KAYTU</Title>
                        )}
                    </Flex>
                    <nav className="w-full flex flex-1 flex-col justify-between items-center">
                        <ul className="-mx-2 space-y-1 w-full">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={`/${workspace}/${item.page}`}
                                        className={`p-2 group flex rounded-md text-sm leading-6 font-semibold   
                                                    ${
                                                        item.page ===
                                                        currentPage
                                                            ? 'bg-blue-900/50 text-gray-200'
                                                            : 'text-gray-300 hover:bg-blue-900/50'
                                                    }
                                                    ${
                                                        collapsed
                                                            ? 'w-fit gap-x-0'
                                                            : 'gap-x-3 '
                                                    }
                                                `}
                                    >
                                        <item.icon
                                            className={`${
                                                collapsed
                                                    ? 'h-8 w-8'
                                                    : 'h-6 w-6'
                                            } shrink-0`}
                                            aria-hidden="true"
                                        />
                                        <Title className="text-inherit">
                                            {!collapsed && item.name}
                                        </Title>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {collapsed ? (
                            <ChevronDoubleRightIcon
                                onClick={() => setCollapsed(false)}
                                className="p-2 group flex rounded-md text-sm leading-6 font-semibold text-gray-300 hover:bg-blue-900/50 h-8 w-8 shrink-0"
                            />
                        ) : (
                            <ChevronDoubleLeftIcon
                                onClick={() => setCollapsed(true)}
                                className="self-end p-2 group flex rounded-md text-sm leading-6 font-semibold text-gray-300 hover:bg-blue-900/50 h-8 w-8 shrink-0"
                            />
                        )}
                    </nav>
                </Flex>
            </div>
        </>
    )

    return (
        <Flex flexDirection="row" className="h-screen overflow-hidden">
            {showSidebar && sidebar}
            <div className="w-full h-full relative bg-blue-950">
                <div className="px-12 absolute top-0 lg:top-2 w-full z-40 flex h-16 shrink-0 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm sm:gap-x-6 lg:rounded-tl-2xl">
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
                    <Flex className="max-w-6xl">
                        <div className="-m-2.5 p-2.5 text-gray-900">
                            <Title>
                                &#128075; Welcome back,{' '}
                                {user?.name || user?.email || ''}
                            </Title>
                        </div>
                        {/* Separator */}
                        <div
                            className="h-6 w-px bg-gray-900/10 dark:bg-white/20 lg:hidden"
                            aria-hidden="true"
                        />

                        <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                {/* <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Theme</span>
                                    <MoonIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button> */}
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">CLI</span>
                                    <CommandLineIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button>
                                {/* <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Help</span>
                                    <QuestionMarkCircleIcon
                                        className="h-6 w-6"
                                        aria-hidden="true"
                                    />
                                </button> */}

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
                                                className="h-8 w-8 min-w-8 rounded-full bg-gray-50"
                                                src={user.picture}
                                                alt=""
                                            />
                                        )}

                                        <span className="hidden lg:flex lg:items-center">
                                            <span
                                                className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100"
                                                aria-hidden="true"
                                            >
                                                {user?.name ||
                                                    user?.email ||
                                                    ''}
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
                                            {showSidebar && (
                                                <Menu.Item key="Your profile">
                                                    {({ active }) => (
                                                        <Link
                                                            to={`/${workspace}/settings/profile`}
                                                            className={classNames(
                                                                active
                                                                    ? 'bg-gray-50'
                                                                    : '',
                                                                'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                            )}
                                                        >
                                                            Your profile
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            )}
                                            <Menu.Item key="Sign out">
                                                {({ active }) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            logout()
                                                        }}
                                                        className={classNames(
                                                            active
                                                                ? 'bg-gray-50'
                                                                : '',
                                                            'block px-3 py-1 text-sm leading-6 text-gray-900'
                                                        )}
                                                    >
                                                        Sign out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </Flex>
                </div>

                <main className="flex justify-center items-start px-12 lg:mt-8 pt-16 pb-12 bg-gray-100 dark:bg-gray-900 h-full overflow-y-scroll">
                    <div className="max-w-6xl w-full min-h-full">
                        {children}
                    </div>
                </main>
            </div>
        </Flex>
    )
}
