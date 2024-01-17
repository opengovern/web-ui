import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Card,
    Flex,
    Text,
} from '@tremor/react'
import { Link } from 'react-router-dom'
import {
    BanknotesIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
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
import { useAtom, useAtomValue } from 'jotai'
import { Popover, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAuth0 } from '@auth0/auth0-react'
import { previewAtom, sideBarCollapsedAtom } from '../../../store'
import { KaytuIcon, KaytuIconBig } from '../../../icons/icons'
import Utilities from './Utilities'
import {
    useInventoryApiV2AnalyticsCountList,
    useInventoryApiV2AnalyticsSpendCountList,
} from '../../../api/inventory.gen'
import { useComplianceApiV1FindingsCountList } from '../../../api/compliance.gen'
import { useIntegrationApiV1ConnectionsCountList } from '../../../api/integration.gen'
import { numericDisplay } from '../../../utilities/numericDisplay'

const badgeStyle = {
    color: '#fff',
    borderRadius: '8px',
    backgroundColor: '#15395F80',
}

interface ISidebar {
    workspace: string | undefined
    currentPage: string
}

export default function Sidebar({ workspace, currentPage }: ISidebar) {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const preview = useAtomValue(previewAtom)
    const {
        response: spendCount,
        isLoading: spendCountIsLoading,
        sendNow: sendSpend,
    } = useInventoryApiV2AnalyticsSpendCountList({}, false, workspace)
    const {
        response: assetCount,
        isLoading: assetsIsLoading,
        sendNow: sendAssets,
    } = useInventoryApiV2AnalyticsCountList({}, false, workspace)
    const {
        response: findingsCount,
        isLoading: findingsIsLoading,
        sendNow: sendFindings,
    } = useComplianceApiV1FindingsCountList({}, {}, false, workspace)
    const {
        response: connectionCount,
        isLoading: connectionsIsLoading,
        sendNow: sendConnections,
    } = useIntegrationApiV1ConnectionsCountList({}, {}, false, workspace)

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then((res) => {
                    console.log('')
                })
                .then((res) => {
                    sendSpend()
                    sendAssets()
                    sendFindings()
                    sendConnections()
                })
        }
    }, [isAuthenticated])

    const navigation = [
        {
            name: 'Home',
            page: 'home',
            icon: HomeIcon,
            isPreview: false,
        },
        {
            name: 'Assets',
            page: ['assets', 'assets-detail-account', 'assets-detail-metric'],
            icon: CubeIcon,
            children: [
                {
                    name: 'Summary',
                    page: 'assets',
                    isPreview: false,
                },
                {
                    name: 'Cloud Accounts',
                    page: 'assets/accounts',
                    selected: 'assets-detail-account',
                    isPreview: false,
                    isLoading: assetsIsLoading,
                    count: numericDisplay(assetCount?.connectionCount) || 0,
                },
                {
                    name: 'Metrics',
                    page: 'assets/metrics',
                    selected: 'assets-detail-metric',
                    isPreview: false,
                    isLoading: assetsIsLoading,
                    count: numericDisplay(assetCount?.metricCount) || 0,
                },
            ],
            isPreview: false,
        },
        {
            name: 'Spend',
            page: ['spend', 'spend-detail-account', 'spend-detail-metric'],
            icon: BanknotesIcon,
            children: [
                {
                    name: 'Summary',
                    page: 'spend',
                    isPreview: false,
                },
                {
                    name: 'Cloud Accounts',
                    page: 'spend/accounts',
                    selected: 'spend-detail-account',
                    isPreview: false,
                    isLoading: spendCountIsLoading,
                    count: numericDisplay(spendCount?.connectionCount) || 0,
                },
                {
                    name: 'Metrics',
                    page: 'spend/metrics',
                    selected: 'spend-detail-metric',
                    isPreview: false,
                    isLoading: spendCountIsLoading,
                    count: numericDisplay(spendCount?.metricCount) || 0,
                },
            ],
            isPreview: false,
        },
        {
            name: 'Security',
            icon: ShieldCheckIcon,
            page: ['compliance', 'findings'],
            children: [
                {
                    name: 'Compliance',
                    page: 'compliance',
                    selected: 'compliance',
                    isPreview: false,
                },
                {
                    name: 'Findings',
                    page: 'findings',
                    selected: 'findings',
                    isPreview: false,
                    isLoading: findingsIsLoading,
                    count: numericDisplay(findingsCount?.count) || 0,
                },
            ],
            isPreview: false,
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
            isPreview: false,
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
                {
                    name: 'Rules',
                    page: 'rules',
                    selected: 'rules',
                    isPreview: false,
                },
                {
                    name: 'Alerts',
                    page: 'alerts',
                    selected: 'alerts',
                    isPreview: false,
                },
            ],
            isPreview: true,
        },
        {
            name: 'Integrations',
            page: 'integrations',
            icon: PuzzlePieceIcon,
            isLoading: connectionsIsLoading,
            count: numericDisplay(connectionCount?.count) || 0,
            isPreview: false,
        },
        {
            name: 'Settings',
            page: 'settings',
            icon: Cog6ToothIcon,
            isPreview: false,
        },
    ]

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-50 !max-h-screen h-full w-fit pt-4 bg-kaytu-950 dark:bg-gray-950 relative border-r border-r-gray-700"
        >
            <Flex
                flexDirection="col"
                justifyContent="start"
                className={`h-full ${collapsed ? 'w-fit' : 'w-72'}`}
            >
                <Flex
                    justifyContent={collapsed ? 'center' : 'between'}
                    className={`pb-[17px] pt-[6px] border-b border-b-gray-700 h-fit min-h-fit ${
                        collapsed ? '' : 'px-5'
                    }`}
                >
                    {collapsed ? <KaytuIcon /> : <KaytuIconBig />}
                    {!collapsed && (
                        <ChevronLeftIcon
                            className="h-5 text-gray-400 cursor-pointer"
                            onClick={() => {
                                setCollapsed(true)
                                localStorage.collapse = 'true'
                            }}
                        />
                    )}
                </Flex>
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="h-full max-h-full"
                >
                    <div
                        className={`w-full p-2 gap-0.5 ${
                            collapsed ? '' : 'overflow-y-scroll'
                        } h-full no-scrollbar`}
                        style={{ maxHeight: 'calc(100vh - 300px)' }}
                    >
                        {!collapsed && (
                            <Text className="ml-3 mt-4 mb-2 !text-xs">
                                OVERVIEW
                            </Text>
                        )}
                        {collapsed && (
                            <ChevronRightIcon
                                className="m-2 h-5 text-gray-400 cursor-pointer"
                                onClick={() => {
                                    setCollapsed(false)
                                    localStorage.collapse = 'false'
                                }}
                            />
                        )}
                        {navigation
                            .filter((item) =>
                                preview === 'true'
                                    ? item
                                    : String(item.isPreview) === String(preview)
                            )
                            .map((item) =>
                                // eslint-disable-next-line no-nested-ternary
                                item.children && !collapsed ? (
                                    <Accordion
                                        className="!bg-transparent border-0 w-full min-h-fit"
                                        defaultOpen={
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            item.children.filter(
                                                (c: any) =>
                                                    c.page === currentPage ||
                                                    c.selected === currentPage
                                            ).length > 0
                                        }
                                    >
                                        <AccordionHeader
                                            className={`text-gray-50 ${
                                                collapsed ? 'px-2' : 'px-6'
                                            } py-2 sidebar-accordion relative`}
                                        >
                                            <Flex
                                                justifyContent="start"
                                                className="h-full gap-2.5"
                                            >
                                                <item.icon
                                                    className={`h-5 w-5 stroke-2 ${
                                                        collapsed &&
                                                        item.page.includes(
                                                            currentPage
                                                        )
                                                            ? 'text-gray-200'
                                                            : 'text-gray-400'
                                                    }`}
                                                />
                                                <Text className="text-inherit">
                                                    {item.name}
                                                </Text>
                                            </Flex>
                                            {item.isPreview && !collapsed && (
                                                <Badge
                                                    className="absolute right-2 top-1.5"
                                                    style={badgeStyle}
                                                >
                                                    Preview
                                                </Badge>
                                            )}
                                        </AccordionHeader>
                                        <AccordionBody className="p-0">
                                            {/* <motion.div
                                                    key={item.name}
                                                    initial={{
                                                        translateX: -100,
                                                    }}
                                                    animate={{
                                                        translateX: 0,
                                                    }}
                                                    exit={{
                                                        translateX: -100,
                                                    }}
                                                > */}
                                            {item.children.map((i) => (
                                                <Link
                                                    to={`/${workspace}/${i.page}`}
                                                    className={`my-0.5 py-2 flex rounded-md relative 
                                                    ${
                                                        i.page ===
                                                            currentPage ||
                                                        i.selected ===
                                                            currentPage
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                >
                                                    <Text className="ml-[54px] text-inherit">
                                                        {i.name}
                                                    </Text>
                                                    {i.count && !collapsed && (
                                                        <Badge
                                                            className="absolute right-2 top-1.5"
                                                            style={badgeStyle}
                                                        >
                                                            {i.isLoading ? (
                                                                <div className="animate-pulse h-1 w-4 my-2 bg-gray-700 rounded-md" />
                                                            ) : (
                                                                i.count
                                                            )}
                                                        </Badge>
                                                    )}
                                                    {i.isPreview &&
                                                        !collapsed && (
                                                            <Badge
                                                                className="absolute right-2 top-1.5"
                                                                style={
                                                                    badgeStyle
                                                                }
                                                            >
                                                                Preview
                                                            </Badge>
                                                        )}
                                                </Link>
                                            ))}
                                            {/* </motion.div> */}
                                        </AccordionBody>
                                    </Accordion>
                                ) : item.children && collapsed ? (
                                    <Popover className="relative z-50 border-0 w-full h-[36px]">
                                        <div className="group relative">
                                            <Popover.Button id={item.name}>
                                                <div
                                                    className={`w-full rounded-md p-2
                                                    ${
                                                        item.page.includes(
                                                            currentPage
                                                        )
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                >
                                                    <item.icon
                                                        className={`h-5 w-5 stroke-2 ${
                                                            collapsed &&
                                                            item.page.includes(
                                                                currentPage
                                                            )
                                                                ? 'text-gray-200'
                                                                : 'text-gray-400'
                                                        }`}
                                                    />
                                                </div>
                                            </Popover.Button>
                                            <div
                                                className="absolute z-50 scale-0 transition-all rounded p-2 shadow-md bg-kaytu-950 group-hover:scale-100"
                                                style={{
                                                    left: '50px',
                                                    top: 0,
                                                }}
                                            >
                                                <Text className="text-white">
                                                    {item.name}
                                                </Text>
                                            </div>
                                        </div>
                                        <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-200"
                                            enterFrom="opacity-0 translate-y-1"
                                            enterTo="opacity-100 translate-y-0"
                                            leave="transition ease-in duration-150"
                                            leaveFrom="opacity-100 translate-y-0"
                                            leaveTo="opacity-0 translate-y-1"
                                        >
                                            <Popover.Panel className="absolute left-[163px] top-[1px] z-40 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                <Card className="z-50 rounded p-2 shadow-md !ring-gray-600 w-56 bg-kaytu-950">
                                                    <Text className="ml-1 mb-3 text-white">
                                                        {item.name}
                                                    </Text>
                                                    {item.children.map((i) => (
                                                        <Link
                                                            to={`/${workspace}/${i.page}`}
                                                            className={`my-0.5 py-2 px-4 flex justify-start rounded-md relative 
                                                    ${
                                                        i.page ===
                                                            currentPage ||
                                                        i.selected ===
                                                            currentPage
                                                            ? 'bg-kaytu-500 text-gray-200 font-semibold'
                                                            : 'text-gray-50 hover:bg-kaytu-800'
                                                    }`}
                                                        >
                                                            <Text className="text-inherit">
                                                                {i.name}
                                                            </Text>
                                                            {i.count &&
                                                                collapsed && (
                                                                    <Badge
                                                                        className="absolute right-2 top-1.5"
                                                                        style={
                                                                            badgeStyle
                                                                        }
                                                                    >
                                                                        {i.isLoading ? (
                                                                            <div className="animate-pulse h-1 w-4 my-2 bg-gray-700 rounded-md" />
                                                                        ) : (
                                                                            i.count
                                                                        )}
                                                                    </Badge>
                                                                )}
                                                            {i.isPreview &&
                                                                collapsed && (
                                                                    <Badge
                                                                        className="absolute right-2 top-1.5"
                                                                        style={
                                                                            badgeStyle
                                                                        }
                                                                    >
                                                                        Preview
                                                                    </Badge>
                                                                )}
                                                        </Link>
                                                    ))}
                                                </Card>
                                            </Popover.Panel>
                                        </Transition>
                                    </Popover>
                                ) : (
                                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                    <Link
                                        to={
                                            Array.isArray(item.page)
                                                ? ''
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
                                        <div className="group relative">
                                            <item.icon
                                                className={`h-5 w-5 stroke-2 ${
                                                    item.page === currentPage ||
                                                    (collapsed &&
                                                        item.page.includes(
                                                            currentPage
                                                        ))
                                                        ? 'text-gray-200'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                            {collapsed && (
                                                <div
                                                    className="absolute z-50 scale-0 transition-all rounded p-2 shadow-md bg-kaytu-950 group-hover:scale-100"
                                                    style={{
                                                        left: '43px',
                                                        top: '-8px',
                                                    }}
                                                >
                                                    <Text className="text-white">
                                                        {item.name}
                                                    </Text>
                                                </div>
                                            )}
                                        </div>
                                        {!collapsed && (
                                            <Text className="text-inherit">
                                                {item.name}
                                            </Text>
                                        )}
                                        {item.isPreview && !collapsed && (
                                            <Badge
                                                className="absolute right-2 top-1.5"
                                                style={badgeStyle}
                                            >
                                                Preview
                                            </Badge>
                                        )}
                                    </Link>
                                )
                            )}
                    </div>
                </Flex>
                <Utilities isCollapsed={collapsed} workspace={workspace} />
            </Flex>
        </Flex>
    )
}
