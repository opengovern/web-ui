import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import { Link } from 'react-router-dom'
import {
    BanknotesIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    Cog6ToothIcon,
    CpuChipIcon,
    DocumentChartBarIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ServerStackIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { useState } from 'react'
import {
    administrationOpenAtom,
    assetOpenAtom,
    sideBarCollapsedAtom,
} from '../../../store'
import { KaytuIcon } from '../../../icons/icons'

const navigation = [
    {
        name: 'Home',
        page: 'home',
        icon: HomeIcon,
    },
    {
        name: 'Insights',
        page: 'all-insights',
        icon: DocumentChartBarIcon,
        children: [
            { name: 'Key Insights', page: 'key-insights' },
            { name: 'All Insights', page: 'all-insights' },
        ],
    },
    {
        name: 'Infrastructure',
        page: 'assets',
        icon: ServerStackIcon,
        children: [
            { name: 'Summary', page: 'assets' },
            { name: 'Deployment', page: 'deployment' },
        ],
    },
    {
        name: 'Spend',
        page: 'spend',
        icon: BanknotesIcon,
    },
    {
        name: 'Compliance',
        page: 'compliance',
        icon: ShieldCheckIcon,
    },
    {
        name: 'Finder',
        page: 'finder',
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

interface ISidebar {
    workspace: string | undefined
    currentPage: string
}

export default function Sidebar({ workspace, currentPage }: ISidebar) {
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const [assetOpen, setAssetOpen] = useAtom(assetOpenAtom)
    const [insightOpen, setInsightOpen] = useAtom(administrationOpenAtom)
    const [assetHover, setAssetHover] = useState(false)
    const [insightHover, setInsightHover] = useState(false)

    const isOpen = (item: any) => {
        if (item.name === 'Infrastructure') {
            return assetOpen
        }
        if (item.name === 'Insights') {
            return insightOpen
        }
        return false
    }
    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-20 h-full w-fit pb-4 bg-kaytu-950"
        >
            <Flex flexDirection="col" className="h-full w-full gap-y-5">
                <Flex
                    alignItems="center"
                    justifyContent="start"
                    className="mt-2 h-16 shrink-0 border-b border-gray-700"
                >
                    <KaytuIcon className="ml-5 w-7 h-7" />
                    {!collapsed && (
                        <Title className="text-slate-50 ml-1.5">KAYTU</Title>
                    )}
                </Flex>
                <nav className="w-full flex flex-1 flex-col px-4 justify-between items-center">
                    <ul className="w-full">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                {item.children && !collapsed ? (
                                    <Accordion
                                        className="bg-transparent border-0"
                                        defaultOpen={isOpen(item)}
                                        onClick={() => {
                                            if (item.name === 'Assets') {
                                                setAssetOpen(!assetOpen)
                                            }
                                            if (item.name === 'Insights') {
                                                setInsightOpen(!insightOpen)
                                            }
                                        }}
                                    >
                                        <AccordionHeader className="text-gray-50 bg-transparent pl-2 pr-3 py-2 my-0.5">
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
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
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
                                        className={`relative p-2 group flex rounded-md text-sm my-0.5
                                                    ${
                                                        item.page ===
                                                        currentPage
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }
                                                    ${
                                                        collapsed
                                                            ? 'w-fit gap-x-0'
                                                            : 'gap-x-3'
                                                    }`}
                                        onMouseEnter={() => {
                                            if (item.name === 'Assets') {
                                                setAssetHover(true)
                                            }
                                            if (item.name === 'Insights') {
                                                setInsightHover(true)
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (item.name === 'Assets') {
                                                setAssetHover(false)
                                            }
                                            if (item.name === 'Insights') {
                                                setInsightHover(false)
                                            }
                                        }}
                                    >
                                        <Flex>
                                            <item.icon
                                                className={`${
                                                    !collapsed
                                                        ? 'h-4 w-4'
                                                        : '-ml-1 h-6 w-6'
                                                } shrink-0`}
                                            />
                                            {!collapsed && (
                                                <Text className="ml-3 text-inherit w-48">
                                                    {item.name}
                                                </Text>
                                            )}
                                        </Flex>
                                        {collapsed &&
                                            assetHover &&
                                            item.name === 'Assets' && (
                                                <div
                                                    className="pl-6 absolute -top-2 left-full"
                                                    onMouseEnter={() => {
                                                        if (
                                                            item.name ===
                                                            'Assets'
                                                        ) {
                                                            setAssetHover(true)
                                                        }
                                                        if (
                                                            item.name ===
                                                            'Insights'
                                                        ) {
                                                            setInsightHover(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (
                                                            item.name ===
                                                            'Assets'
                                                        ) {
                                                            setAssetHover(false)
                                                        }
                                                        if (
                                                            item.name ===
                                                            'Insights'
                                                        ) {
                                                            setInsightHover(
                                                                false
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <Flex
                                                        flexDirection="col"
                                                        className="rounded-md py-2 px-1"
                                                        style={{
                                                            backgroundColor:
                                                                '#0B2447',
                                                        }}
                                                    >
                                                        {item.children?.map(
                                                            (child) => (
                                                                <Link
                                                                    to={`/${workspace}/${child.page}`}
                                                                    className={`
                                                                    relative p-2 group flex rounded-md text-sm my-0.5 ${
                                                                        child.page ===
                                                                        currentPage
                                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                                            : 'text-gray-300 hover:bg-kaytu-800'
                                                                    }`}
                                                                >
                                                                    <Text className="ml-3 text-inherit w-48">
                                                                        {
                                                                            child.name
                                                                        }
                                                                    </Text>
                                                                </Link>
                                                            )
                                                        )}
                                                    </Flex>
                                                </div>
                                            )}
                                        {collapsed &&
                                            insightHover &&
                                            item.name === 'Insights' && (
                                                <div
                                                    className="pl-6 absolute -top-2 left-full"
                                                    onMouseEnter={() => {
                                                        if (
                                                            item.name ===
                                                            'Assets'
                                                        ) {
                                                            setAssetHover(true)
                                                        }
                                                        if (
                                                            item.name ===
                                                            'Insights'
                                                        ) {
                                                            setInsightHover(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (
                                                            item.name ===
                                                            'Assets'
                                                        ) {
                                                            setAssetHover(false)
                                                        }
                                                        if (
                                                            item.name ===
                                                            'Insights'
                                                        ) {
                                                            setInsightHover(
                                                                false
                                                            )
                                                        }
                                                    }}
                                                >
                                                    <Flex
                                                        flexDirection="col"
                                                        className="rounded-md py-2 px-1 bg-kaytu-950"
                                                    >
                                                        {item.children?.map(
                                                            (child) => (
                                                                <Link
                                                                    to={`/${workspace}/${child.page}`}
                                                                    className={`
                                                                    relative p-2 group flex rounded-md text-sm my-0.5 ${
                                                                        child.page ===
                                                                        currentPage
                                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                                            : 'text-gray-300 hover:bg-kaytu-800'
                                                                    }`}
                                                                >
                                                                    <Text className="ml-3 text-inherit w-48">
                                                                        {
                                                                            child.name
                                                                        }
                                                                    </Text>
                                                                </Link>
                                                            )
                                                        )}
                                                    </Flex>
                                                </div>
                                            )}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                    {collapsed ? (
                        <ChevronDoubleRightIcon
                            onClick={() => setCollapsed(false)}
                            className="p-2 group flex rounded-md text-sm leading-6 font-semibold text-gray-300 hover:bg-kaytu-800 h-8 w-8 shrink-0"
                        />
                    ) : (
                        <ChevronDoubleLeftIcon
                            onClick={() => setCollapsed(true)}
                            className="self-end p-2 group flex rounded-md text-sm leading-6 font-semibold text-gray-300 hover:bg-kaytu-800 h-8 w-8 shrink-0"
                        />
                    )}
                </nav>
            </Flex>
        </Flex>
    )
}
