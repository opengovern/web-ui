import { Button, Flex, Title } from '@tremor/react'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import {
    kebabCaseToLabel,
    snakeCaseToLabel,
} from '../../../utilities/labelMaker'
import DateRangePicker from '../../DateRangePicker'
import Filter from '../../Filter'

interface IHeader {
    filter?: boolean
    datePicker?: boolean
    children?: ReactNode
    breadCrumb?: (string | undefined)[]
}

export default function TopHeader({
    filter = false,
    datePicker = false,
    children,
    breadCrumb,
}: IHeader) {
    const { user, logout } = useAuth0()
    const [theme, setTheme] = useState(localStorage.theme || 'light')
    const navigate = useNavigate()
    const url = window.location.pathname.split('/')

    const mainPage = () => {
        if (url[1] === 'billing') {
            return 'Usage & Billing'
        }
        return url[2] ? kebabCaseToLabel(url[2]) : 'Workspaces'
    }

    const subPages = () => {
        const pages = []
        for (let i = 3; i < url.length; i += 1) {
            pages.push(kebabCaseToLabel(url[i]))
        }
        return pages
    }

    const goBack = (n: number) => {
        let temp = '.'
        for (let i = 0; i < n; i += 1) {
            temp += '/..'
        }
        return temp
    }

    const toggleTheme = () => {
        if (localStorage.theme === 'dark') {
            setTheme('light')
            localStorage.theme = 'light'
            document.documentElement.classList.remove('dark')
        } else {
            setTheme('dark')
            localStorage.theme = 'dark'
            document.documentElement.classList.add('dark')
        }
    }
    return (
        <div className="px-12 z-10 absolute top-2 w-full flex h-16 items-center justify-center gap-x-4 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 shadow-sm rounded-tl-2xl">
            <Flex className="max-w-7xl">
                {subPages().length > 0 ? (
                    <Flex justifyContent="start">
                        <Button
                            onClick={() =>
                                navigate(
                                    goBack(
                                        subPages().length > 1
                                            ? subPages().length
                                            : 1
                                    )
                                )
                            }
                            variant="light"
                            className="!text-lg mr-2 hover:text-kaytu-600"
                        >
                            {mainPage()}
                        </Button>
                        {subPages().map((page, i) => (
                            <Flex
                                key={page}
                                justifyContent="start"
                                className="w-fit mr-2"
                            >
                                <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                                <Button
                                    onClick={() =>
                                        navigate(
                                            goBack(subPages().length - i - 1)
                                        )
                                    }
                                    variant="light"
                                    className={`${
                                        i === subPages().length - 1
                                            ? 'text-black'
                                            : ''
                                    } opacity-100 ml-2 !text-lg`}
                                    disabled={i === subPages().length - 1}
                                >
                                    {i === subPages().length - 1 &&
                                    breadCrumb?.length
                                        ? breadCrumb
                                        : snakeCaseToLabel(page)}
                                </Button>
                            </Flex>
                        ))}
                    </Flex>
                ) : (
                    <Title className="font-semibold !text-xl whitespace-nowrap">
                        {mainPage()}
                    </Title>
                )}
                <Flex justifyContent="end">
                    {children}
                    {datePicker && <DateRangePicker />}
                    {filter && <Filter />}
                    <button
                        type="button"
                        className="ml-3 text-gray-400 hover:text-gray-500"
                        onClick={toggleTheme}
                    >
                        {theme === 'dark' ? (
                            <SunIcon className="h-6 w-6" />
                        ) : (
                            <MoonIcon className="h-6 w-6" />
                        )}
                    </button>
                </Flex>
                {/* {showLogo ? (
                    <a href="/">
                        <Flex flexDirection="row">
                            <KaytuIcon className="ml-5 w-7 h-7" />
                            <Title className="text-gray-900 ml-1.5">
                                Kaytu
                            </Title>
                        </Flex>
                    </a>
                ) : (
                    <div className="text-gray-900">
                        <Title>
                            &#128075; Welcome back,{' '}
                            {user?.given_name || user?.email || ''}
                        </Title>
                    </div>
                )}

                <div className="h-6 w-px bg-gray-900/10 dark:bg-white/20 lg:hidden" />
                <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
                    <div className="flex items-center gap-x-4 lg:gap-x-6">
                        <JobsMenu />
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
                        Profile dropdown
                        <Menu as="div" className="relative">
                            <Menu.Button className="-m-1.5 flex items-center p-1.5">
                                {user?.picture && (
                                    <img
                                        className="h-8 w-8 min-w-8 rounded-full bg-gray-50"
                                        src={user.picture}
                                        alt=""
                                    />
                                )}

                                <span className="hidden lg:flex lg:items-center">
                                    <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                                        {user?.name || user?.email || ''}
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
                                    {workspace !== undefined &&
                                        workspace.length > 0 && (
                                            <Menu.Item key="Your profile">
                                                {({ active }) => (
                                                    <Link
                                                        to={`/${workspace}/settings?sp=profile`}
                                                        className={`
                                                    ${
                                                        active
                                                            ? 'bg-gray-50'
                                                            : ''
                                                    } w-full block px-3 py-1 text-sm leading-6 text-gray-900'
                                                `}
                                                    >
                                                        Your profile
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        )}

                                    <Menu.Item key="Workspaces">
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate('/')
                                                }}
                                                className={`
                                                    ${
                                                        active
                                                            ? 'bg-gray-50'
                                                            : ''
                                                    } text-start w-full block px-3 py-1 text-sm leading-6 text-gray-900'
                                                `}
                                            >
                                                Workspaces
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item key="Billing">
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigate('/billing')
                                                }}
                                                className={`
                                                    ${
                                                        active
                                                            ? 'bg-gray-50'
                                                            : ''
                                                    } text-start w-full block px-3 py-1 text-sm leading-6 text-gray-900'
                                                `}
                                            >
                                                Billing
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item key="Sign out">
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    logout()
                                                }}
                                                className={`
                                                    ${
                                                        active
                                                            ? 'bg-gray-50'
                                                            : ''
                                                    } text-start w-full block px-3 py-1 text-sm leading-6 text-gray-900'
                                                `}
                                            >
                                                Sign out
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div> */}
            </Flex>
        </div>
    )
}
