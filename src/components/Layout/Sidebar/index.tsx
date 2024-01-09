import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Flex,
    Text,
} from '@tremor/react'
import { Link } from 'react-router-dom'
import {
    BanknotesIcon,
    ChevronRightIcon,
    ChevronLeftIcon,
    Cog6ToothIcon,
    CubeIcon,
    DocumentChartBarIcon,
    HomeIcon,
    LightBulbIcon,
    MagnifyingGlassIcon,
    PuzzlePieceIcon,
    RectangleStackIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { sideBarCollapsedAtom } from '../../../store'
import { KaytuIcon, KaytuIconBig } from '../../../icons/icons'
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
        icon: CubeIcon,
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
            { name: 'Compliance', page: 'compliance', isPreview: false },
            { name: 'Findings', page: 'findings', isPreview: false },
        ],
    },
    {
        name: 'Insights',
        page: 'insights',
        icon: DocumentChartBarIcon,
        isPreview: true,
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
        isPreview: true,
    },
    {
        name: 'Automation',
        icon: LightBulbIcon,
        page: ['rules, alerts'],
        children: [
            { name: 'Rules', page: 'rules', isPreview: true },
            { name: 'Alerts', page: 'alerts', isPreview: true },
        ],
    },
    {
        name: 'Integrations',
        page: 'integrations',
        icon: PuzzlePieceIcon,
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

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-20 h-full w-fit py-4 bg-kaytu-950 relative"
        >
            <Flex
                flexDirection="col"
                className={`h-full ${collapsed ? 'w-fit' : 'w-72'}`}
            >
                <Flex
                    justifyContent={collapsed ? 'center' : 'between'}
                    className={`pb-[18px] pt-[12px] border-b border-b-gray-700 ${
                        collapsed ? '' : 'px-5'
                    }`}
                >
                    {collapsed ? <KaytuIcon /> : <KaytuIconBig />}
                    {!collapsed && (
                        <ChevronLeftIcon
                            className="h-5 text-gray-400 cursor-pointer"
                            onClick={() => setCollapsed(true)}
                        />
                    )}
                </Flex>
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="start"
                    className="h-full p-2 gap-0.5 overflow-y-scroll"
                >
                    {!collapsed && (
                        <Text className="ml-3 mt-4 mb-2 !text-xs">
                            OVERVIEW
                        </Text>
                    )}
                    {collapsed && (
                        <ChevronRightIcon
                            className="m-2 h-5 text-gray-400 cursor-pointer"
                            onClick={() => setCollapsed(false)}
                        />
                    )}
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
                                <AccordionHeader
                                    className={`text-gray-50 ${
                                        collapsed ? 'px-2' : 'px-6'
                                    } py-2 sidebar-accordion relative`}
                                >
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
                                        <Text className="text-inherit">
                                            {item.name}
                                        </Text>
                                    </Flex>
                                    {item.isPreview && !collapsed && (
                                        <Badge className="w-fit absolute right-2 top-1.5">
                                            Preview
                                        </Badge>
                                    )}
                                </AccordionHeader>
                                <AccordionBody className="p-0">
                                    {item.children.map((i) => (
                                        <Link
                                            to={`/${workspace}/${i.page}`}
                                            className={`my-0.5 py-2 flex rounded-md relative 
                                                    ${
                                                        i.page === currentPage
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                        >
                                            <Text className="ml-[54px] text-inherit">
                                                {i.name}
                                            </Text>
                                            {i.isPreview && !collapsed && (
                                                <Badge className="w-fit absolute right-2 top-1.5">
                                                    Preview
                                                </Badge>
                                            )}
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
                                className={`w-full relative px-6 py-2 flex items-center gap-2.5 rounded-md
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
                                                    ${collapsed ? '!p-2' : ''}`}
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
                                    <Text className="text-inherit">
                                        {item.name}
                                    </Text>
                                )}
                                {item.isPreview && !collapsed && (
                                    <Badge className="w-fit absolute right-2 top-1.5">
                                        Preview
                                    </Badge>
                                )}
                            </Link>
                        )
                    )}
                </Flex>
            </Flex>
            {/*  <Utilities isCollapsed={collapsed} /> */}
        </Flex>
    )
}
