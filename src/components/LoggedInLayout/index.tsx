import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
    BanknotesIcon,
    Bars3Icon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronDownIcon,
    Cog6ToothIcon,
    DocumentChartBarIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    ServerStackIcon,
    ShieldCheckIcon,
    SunIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuth0 } from '@auth0/auth0-react'
import { Link, useParams } from 'react-router-dom'
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import {
    administrationOpenAtom,
    assetOpenAtom,
    sideBarCollapsedAtom,
} from '../../store'
import CLIMenu from './CLIMenu'
import { KaytuIcon } from '../../icons/icons'

const navigation = [
    {
        name: 'Home',
        page: 'home',
        icon: HomeIcon,
    },
    {
        name: 'Insights',
        page: 'insight',
        icon: DocumentChartBarIcon,
    },
    {
        name: 'Assets',
        page: 'assets',
        icon: ServerStackIcon,
        children: [
            { name: 'Summary', page: 'assets' },
            { name: 'Stack', page: 'stack' },
        ],
    },
    {
        name: 'Spend',
        page: 'spend',
        icon: BanknotesIcon,
    },
    {
        name: 'Compliance',
        page: 'benchmarks',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Finder',
        page: 'finder',
        icon: MagnifyingGlassIcon,
    },
    {
        name: 'Administration',
        id: 'settings',
        page: 'settings/entitlement',
        icon: Cog6ToothIcon,
        children: [
            { name: 'Settings', page: 'settings/entitlement' },
            { name: 'Integrations', page: 'integration' },
        ],
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
        | 'integration'
        | 'benchmarks'
        | 'settings'
        | 'stack'
        | 'finder'
        | '404'
    showSidebar?: boolean
}

export default function LoggedInLayout({
    children,
    currentPage,
    showSidebar = true,
}: IProps) {
    const workspace = useParams<{ ws: string }>().ws
    const { user, logout } = useAuth0()

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const [assetOpen, setAssetOpen] = useAtom(assetOpenAtom)
    const [administrationOpen, setAdministrationOpen] = useAtom(
        administrationOpenAtom
    )
    const [theme, setTheme] = useState(localStorage.theme || 'dark')

    const isOpen = (item: any) => {
        if (item.name === 'Assets') {
            return assetOpen
        }
        if (item.name === 'Administration') {
            return administrationOpen
        }
        return false
    }

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
                                            <XMarkIcon className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                {/* Sidebar component, swap this element with another sidebar if you like */}
                                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-blue-950 px-6 pb-4 ring-1 ring-white/10">
                                    <div className="flex h-16 shrink-0 items-center">
                                        <KaytuIcon className="h-8 w-auto" />
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
                                                                    (item.id ||
                                                                        item.page) ===
                                                                        currentPage
                                                                        ? 'bg-blue-900/50 text-gray-200'
                                                                        : 'text-gray-300 hover:bg-blue-900/50',
                                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                                )}
                                                            >
                                                                <item.icon className="h-5 w-6 shrink-0" />
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
                className="transition ease-in-out hidden h-full lg:flex lg:flex-col pb-4"
                style={{ backgroundColor: '#0B2447' }}
            >
                <Flex
                    flexDirection="col"
                    className="h-full w-full gap-y-5 overflow-y-auto"
                >
                    <Flex
                        alignItems="center"
                        justifyContent="start"
                        className="mt-2 h-16 shrink-0 border-b border-gray-700"
                    >
                        <KaytuIcon className="ml-7 w-7 h-7" />
                        {!collapsed && (
                            <Title className="text-slate-50 ml-1.5">
                                KAYTU
                            </Title>
                        )}
                    </Flex>
                    <nav className="w-full flex flex-1 flex-col px-6 justify-between items-center">
                        <ul className="-mx-2 w-full">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    {item.children?.length && !collapsed ? (
                                        <Accordion
                                            className="bg-transparent border-0"
                                            defaultOpen={isOpen(item)}
                                            onClick={() => {
                                                if (item.name === 'Assets') {
                                                    setAssetOpen(!assetOpen)
                                                }
                                                if (
                                                    item.name ===
                                                    'Administration'
                                                ) {
                                                    setAssetOpen(!assetOpen)
                                                }
                                            }}
                                        >
                                            <AccordionHeader className="text-gray-300 bg-transparent pl-2 pr-3 py-2 my-0.5">
                                                <Flex
                                                    justifyContent="start"
                                                    className="h-full"
                                                >
                                                    <item.icon className="h-4 w-4 shrink-0" />
                                                    <Text className="ml-3 text-inherit">
                                                        {item.name}
                                                    </Text>
                                                </Flex>
                                            </AccordionHeader>
                                            <AccordionBody className="p-0">
                                                {item.children.map((i) => (
                                                    <Link
                                                        to={`/${workspace}/${i.page}`}
                                                        className={`p-2 my-0.5 flex rounded-md text-sm  
                                                    ${
                                                        i.page === currentPage
                                                            ? 'bg-blue-900/40 text-gray-200 font-semibold'
                                                            : 'text-gray-300 hover:bg-blue-900/20'
                                                    }`}
                                                    >
                                                        <Text className="pl-7 text-inherit my-0.5">
                                                            {i.name}
                                                        </Text>
                                                    </Link>
                                                ))}
                                            </AccordionBody>
                                        </Accordion>
                                    ) : (
                                        <Link
                                            to={`/${workspace}/${item.page}`}
                                            className={`p-2 group flex rounded-md text-sm my-0.5
                                                    ${
                                                        (item.id ||
                                                            item.page) ===
                                                        currentPage
                                                            ? 'bg-blue-900/40 text-gray-200 font-semibold'
                                                            : 'text-gray-300 hover:bg-blue-900/20'
                                                    }
                                                    ${
                                                        collapsed
                                                            ? 'w-fit gap-x-0'
                                                            : 'gap-x-3'
                                                    }`}
                                        >
                                            <Flex>
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                {!collapsed && (
                                                    <Text className="ml-3 text-inherit w-48">
                                                        {item.name}
                                                    </Text>
                                                )}
                                            </Flex>
                                        </Link>
                                    )}
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

    const toggleTheme = () => {
        if (localStorage.theme === 'dark') {
            setTheme('light')
            localStorage.theme = 'light'
        } else {
            setTheme('dark')
            localStorage.theme = 'dark'
        }

        if (
            localStorage.theme === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    return (
        <Flex flexDirection="row" className="h-screen overflow-hidden">
            {showSidebar && sidebar}
            <div
                className="w-full h-full relative"
                style={{ backgroundColor: '#0B2447' }}
            >
                <div className="px-12 absolute top-0 lg:top-2 w-full z-40 flex h-16 shrink-0 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm sm:gap-x-6 lg:rounded-tl-2xl">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6 dark:text-gray-300" />
                    </button>
                    <Flex className="max-w-6xl">
                        <div className="-m-2.5 p-2.5 text-gray-900">
                            <Title>
                                &#128075; Welcome back,{' '}
                                {user?.given_name || user?.email || ''}
                            </Title>
                        </div>
                        <div className="h-6 w-px bg-gray-900/10 dark:bg-white/20 lg:hidden" />
                        <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                            <div className="flex items-center gap-x-4 lg:gap-x-6">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                                    onClick={toggleTheme}
                                >
                                    <span className="sr-only">Theme</span>
                                    {theme === 'dark' ? (
                                        <SunIcon className="h-6 w-6" />
                                    ) : (
                                        <MoonIcon className="h-6 w-6" />
                                    )}
                                </button>
                                <CLIMenu />
                                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10 lg:dark:bg-white/20" />
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
                                            <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                                {user?.name ||
                                                    user?.email ||
                                                    ''}
                                            </span>
                                            <ChevronDownIcon className="ml-2 h-5 w-5 text-gray-400" />
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

                <Flex
                    flexDirection="col"
                    alignItems="center"
                    className="mt-16 bg-gray-100 dark:bg-gray-900 h-screen overflow-y-scroll"
                    id="kaytu-container"
                >
                    <Flex justifyContent="center" className="px-12">
                        <div className="max-w-6xl w-full py-8">{children}</div>
                    </Flex>
                    <Flex
                        justifyContent="center"
                        className="px-12 mb-16 py-3 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm"
                    >
                        <Flex
                            flexDirection="row"
                            justifyContent="between"
                            className="max-w-6xl w-full"
                        >
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#">
                                <Text>Terms of Use</Text>
                            </a>
                            <Text>
                                Copyright © 2023 Kaytu, Inc. All rights
                                reserved.
                            </Text>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                            <a href="#">
                                <Text>Service Status</Text>
                            </a>
                        </Flex>
                    </Flex>
                </Flex>
            </div>
        </Flex>
    )
}
