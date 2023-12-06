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
    LightBulbIcon,
    MagnifyingGlassIcon,
    RectangleStackIcon,
    ServerStackIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useAtom, useAtomValue } from 'jotai'
import { useState } from 'react'
import {
    automationOpenAtom,
    complianceOpenAtom,
    isDemoAtom,
    sideBarCollapsedAtom,
} from '../../../store'
import { KaytuIcon } from '../../../icons/icons'
import Workspace from './Workspace'

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
        page: 'compliance',
        icon: ShieldCheckIcon,
        children: [
            { name: 'Compliance', page: 'compliance' },
            { name: 'Service Advisor', page: 'service-advisor' },
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
        name: 'Resource Collection',
        page: 'resource-collection',
        icon: RectangleStackIcon,
    },
    {
        name: 'Integrations',
        page: 'integrations',
        icon: CpuChipIcon,
    },
    {
        name: 'Automation',
        page: 'rules',
        icon: LightBulbIcon,
        children: [
            { name: 'Rules', page: 'rules' },
            { name: 'Alerts', page: 'alerts' },
        ],
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
    const [complianceOpen, setComplianceOpen] = useAtom(complianceOpenAtom)
    const [complianceHover, setComplianceHover] = useState(false)
    const [automationOpen, setAutomationOpen] = useAtom(automationOpenAtom)
    const [automationHover, setAutomationHover] = useState(false)
    const isDemo = useAtomValue(isDemoAtom)
    const isOpen = (item: any) => {
        if (item.name === 'Governance') {
            return complianceOpen
        }
        if (item.name === 'Automation') {
            return automationOpen
        }
        return false
    }

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-20 h-full w-fit pb-4 bg-kaytu-950 relative"
        >
            {isDemo && (
                <Flex className="absolute -left-7 top-3 bg-rose-800 w-fit px-8 -rotate-45">
                    <Text className="text-white">Demo</Text>
                </Flex>
            )}
            <Flex flexDirection="col" className="h-full w-full gap-y-5">
                <Workspace isCollapsed={collapsed} />
                <nav className="w-full flex flex-1 flex-col px-4 justify-between items-center">
                    <ul className="w-full">
                        {navigation.map((item) => (
                            <li key={item.name}>
                                {item.children && !collapsed ? (
                                    <Accordion
                                        className="bg-transparent border-0"
                                        defaultOpen={isOpen(item)}
                                        onClick={() => {
                                            if (item.name === 'Governance') {
                                                setComplianceOpen(
                                                    !complianceOpen
                                                )
                                            }
                                            if (item.name === 'Automation') {
                                                setAutomationOpen(
                                                    !automationOpen
                                                )
                                            }
                                        }}
                                    >
                                        <AccordionHeader className="text-gray-50 bg-transparent pl-2 pr-3 py-2 my-0.5">
                                            <Flex
                                                justifyContent="start"
                                                className="h-full"
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
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
                                                    <Text className="pl-8 text-inherit my-0.5">
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
                                            if (item.name === 'Governance') {
                                                setComplianceHover(true)
                                            }
                                            if (item.name === 'Automation') {
                                                setAutomationHover(true)
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            if (item.name === 'Governance') {
                                                setComplianceHover(false)
                                            }
                                            if (item.name === 'Automation') {
                                                setAutomationHover(false)
                                            }
                                        }}
                                    >
                                        <Flex>
                                            <item.icon
                                                className={`${
                                                    !collapsed
                                                        ? 'h-5 w-5'
                                                        : 'h-6 w-6'
                                                } shrink-0`}
                                            />
                                            {!collapsed && (
                                                <Text className="ml-3 text-inherit w-48">
                                                    {item.name}
                                                </Text>
                                            )}
                                        </Flex>
                                        {collapsed &&
                                            complianceHover &&
                                            item.name === 'Governance' && (
                                                <div
                                                    className="pl-6 absolute -top-2 left-full"
                                                    onMouseEnter={() => {
                                                        if (
                                                            item.name ===
                                                            'Governance'
                                                        ) {
                                                            setComplianceHover(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (
                                                            item.name ===
                                                            'Governance'
                                                        ) {
                                                            setComplianceHover(
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
                                            automationHover &&
                                            item.name === 'Automation' && (
                                                <div
                                                    className="pl-6 absolute -top-2 left-full"
                                                    onMouseEnter={() => {
                                                        if (
                                                            item.name ===
                                                            'Automation'
                                                        ) {
                                                            setAutomationHover(
                                                                true
                                                            )
                                                        }
                                                    }}
                                                    onMouseLeave={() => {
                                                        if (
                                                            item.name ===
                                                            'Automation'
                                                        ) {
                                                            setAutomationHover(
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
