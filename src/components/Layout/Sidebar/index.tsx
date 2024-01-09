import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Flex,
    Text,
} from '@tremor/react'
import { Link } from 'react-router-dom'
import {
    BanknotesIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    DocumentChartBarIcon,
    HomeIcon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    RectangleStackIcon,
    ServerStackIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { sideBarCollapsedAtom } from '../../../store'
import JobsMenu from './JobsMenu'
import CLIMenu from './CLIMenu'
import Profile from './Profile'
import { KaytuIconBig } from '../../../icons/icons'
import Utilities from './Utilities'

const navigation = [
    {
        name: 'Home',
        page: 'home',
        icon: HomeIcon,
    },
    {
        name: 'Assets',
        page: 'assets',
        icon: ServerStackIcon,
    },
    {
        name: 'Spend',
        page: 'spend',
        icon: BanknotesIcon,
    },
    {
        name: 'Governance',
        icon: ShieldCheckIcon,
        page: ['compliance', 'findings'],
        children: [
            { name: 'Compliance', page: 'compliance' },
            { name: 'Findings', page: 'findings' },
        ],
    },
    {
        name: 'Insights',
        page: 'insights',
        icon: DocumentChartBarIcon,
    },
    {
        name: 'Query',
        page: 'query',
        icon: MagnifyingGlassIcon,
    },
    {
        name: 'Integrations',
        page: 'integrations',
        icon: CpuChipIcon,
    },
    {
        name: 'Settings',
        page: 'settings',
        icon: Cog6ToothIcon,
    },
]

const preview = [
    {
        name: 'Resource Collection',
        page: 'resource-collection',
        icon: RectangleStackIcon,
    },
    {
        name: 'Automation',
        icon: LightBulbIcon,
        page: ['rules, alerts'],
        children: [
            { name: 'Rules', page: 'rules' },
            { name: 'Alerts', page: 'alerts' },
        ],
    },
]

interface ISidebar {
    workspace: string | undefined
    currentPage: string
}

export default function Sidebar({ workspace, currentPage }: ISidebar) {
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const [theme, setTheme] = useState(localStorage.theme || 'light')

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
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-20 h-full w-fit py-4 bg-kaytu-950 relative"
        >
            <Flex flexDirection="col" className="h-full w-72">
                <Flex className="pl-5 pb-[18px] pt-[12px] border-b border-b-gray-700">
                    <KaytuIconBig />
                </Flex>
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="start"
                    className="h-full p-2 gap-0.5 overflow-y-scroll"
                >
                    <Text className="ml-3 mt-4 mb-2">OVERVIEW</Text>
                    {navigation.map((item) =>
                        item.children && !collapsed ? (
                            <Accordion
                                className="!bg-transparent border-0 w-full min-h-fit"
                                defaultOpen={
                                    item.children.filter(
                                        (c) => c.page === currentPage
                                    ).length > 0
                                }
                            >
                                <AccordionHeader className="text-gray-50 px-6 py-2 sidebar-accordion relative">
                                    <ChevronRightIcon
                                        className="w-3.5 absolute left-1 text-gray-400"
                                        style={{ top: 'calc(50% - 7px)' }}
                                    />
                                    <Flex
                                        justifyContent="start"
                                        className="h-full gap-2.5"
                                    >
                                        <item.icon
                                            className={`h-5 w-5 stroke-2 ${
                                                collapsed &&
                                                item.page.includes(currentPage)
                                                    ? 'text-gray-200'
                                                    : 'text-gray-400'
                                            }`}
                                        />
                                        <Text className="text-inherit !text-base">
                                            {item.name}
                                        </Text>
                                    </Flex>
                                </AccordionHeader>
                                <AccordionBody className="p-0">
                                    {item.children.map((i) => (
                                        <Link
                                            to={`/${workspace}/${i.page}`}
                                            className={`my-0.5 py-2 flex rounded-md text-sm  
                                                    ${
                                                        i.page === currentPage
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                        >
                                            <Text className="ml-[54px] text-inherit !text-base">
                                                {i.name}
                                            </Text>
                                        </Link>
                                    ))}
                                </AccordionBody>
                            </Accordion>
                        ) : (
                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <Link
                                to={
                                    Array.isArray(item.page)
                                        ? '#'
                                        : `/${workspace}/${item.page}`
                                }
                                className={`w-full relative px-6 py-2 flex rounded-md
                                                    ${
                                                        item.page ===
                                                            currentPage ||
                                                        (collapsed &&
                                                            item.page.includes(
                                                                currentPage
                                                            ))
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }
                                                    ${
                                                        collapsed
                                                            ? 'w-fit gap-x-0'
                                                            : 'gap-x-3'
                                                    }`}
                            >
                                <Flex
                                    justifyContent="start"
                                    className="gap-2.5"
                                >
                                    <item.icon
                                        className={`h-5 w-5 stroke-2 ${
                                            item.page === currentPage ||
                                            (collapsed &&
                                                item.page.includes(currentPage))
                                                ? 'text-gray-200'
                                                : 'text-gray-400'
                                        }`}
                                    />
                                    {!collapsed && (
                                        <Text className="text-inherit !text-base">
                                            {item.name}
                                        </Text>
                                    )}
                                </Flex>
                            </Link>
                        )
                    )}
                </Flex>
            </Flex>
            <Utilities isCollapsed={collapsed} />
        </Flex>
    )
}
