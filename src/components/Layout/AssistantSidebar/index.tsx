import { Badge, Button, Card, Flex, Icon, Subtitle, Text } from '@tremor/react'
import {
    ArrowLeftIcon,
    BackwardIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import { previewAtom, sideBarCollapsedAtom, ssTokenAtom } from '../../../store'
import { KaytuIcon, KaytuIconBig } from '../../../icons/icons'
import Profile from '../Sidebar/Utilities/Profile'
import { useComplianceApiV1SupersetDashboardsTokenCreate } from '../../../api/compliance.gen'
import Workspaces from '../Sidebar/Workspaces'
import { setAuthHeader } from '../../../api/ApiConfig'
import { useURLParam } from '../../../utilities/urlstate'

interface IAssistantSidebar {
    workspace: string | undefined
    currentPage: string
}

const history = [
    { title: '2024-2-1', assisstant: 'Compliance' },
    { title: '2024-1-31', assisstant: 'Score' },
    { title: '2024-1-30', assisstant: 'Cloud Inventory' },
    { title: '2024-1-29', assisstant: 'Compliance' },
    { title: '2024-1-28', assisstant: 'Spend' },
]

export default function AssistantSidebar({
    workspace,
    currentPage,
}: IAssistantSidebar) {
    const [threadID, setThreadID] = useURLParam('threadID', '')
    const [runID, setRunID] = useURLParam('runID', '')
    const [assistantIdx, setAssistantIdx] = useURLParam('assistantIdx', 0)

    const navigate = useNavigate()
    const { isAuthenticated, getAccessTokenSilently } = useAuth0()
    const [collapsed, setCollapsed] = useAtom(sideBarCollapsedAtom)
    const [selectedTopic, setSelectedTopic] = useState<string>(history[0].title)

    const {
        response: dashboardToken,
        isLoading,
        isExecuted,
        error: dashboardTokenErr,
        sendNow: fetchDashboardToken,
    } = useComplianceApiV1SupersetDashboardsTokenCreate({}, false, workspace)
    const [ssToken, setSSToken] = useAtom(ssTokenAtom)
    useEffect(() => {
        setSSToken(dashboardToken)
    }, [isLoading])

    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently()
                .then((accessToken) => {
                    setAuthHeader(accessToken)
                    fetchDashboardToken()
                })
                .catch((e) => {
                    console.log('====> failed to get token due to', e)
                })
        }
    }, [isAuthenticated, workspace])

    return (
        <Flex
            flexDirection="col"
            alignItems="start"
            className="z-50 !max-h-screen h-full w-fit pt-4 bg-gray-950 dark:bg-gray-950 border-r border-r-gray-700 relative"
        >
            <Flex
                flexDirection="col"
                justifyContent="start"
                className={`h-full ${collapsed ? 'w-fit' : 'w-72'}`}
            >
                <Flex
                    flexDirection="col"
                    justifyContent="start"
                    className={`pb-8 pt-2 gap-4 ${collapsed ? 'px-4' : 'px-4'}`}
                >
                    <Flex justifyContent="start" className="gap-4 mb-4">
                        <ArrowLeftIcon
                            className="w-6 text-gray-300 cursor-pointer"
                            onClick={() => navigate(`/${workspace}`)}
                        />

                        {collapsed ? (
                            ''
                        ) : (
                            <KaytuIconBig
                                className="cursor-pointer"
                                onClick={() => navigate(`/${workspace}`)}
                            />
                        )}
                    </Flex>
                    <Button
                        variant="secondary"
                        icon={PlusIcon}
                        className={`text-white border-white h-12  ${
                            collapsed ? 'w-12' : 'w-full'
                        }`}
                        onClick={() => {
                            setThreadID('')
                            setRunID('')
                            setAssistantIdx(0)
                        }}
                    >
                        {collapsed ? '' : 'New Topic'}
                    </Button>
                    <Flex
                        justifyContent="center"
                        className={
                            collapsed
                                ? ' rounded-lg bg-kaytu-800 px-[1px] py-[2px]'
                                : ''
                        }
                    >
                        <Workspaces isCollapsed={collapsed} />
                    </Flex>
                </Flex>

                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="h-full max-h-full"
                >
                    <div
                        className={`w-full px-4 ${
                            collapsed ? '' : 'overflow-y-scroll'
                        } h-full no-scrollbar`}
                        style={{ maxHeight: 'calc(100vh - 374px)' }}
                    >
                        {!collapsed && (
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-2"
                            >
                                <Text className="my-2 !text-xs">Today</Text>
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="gap-2"
                                >
                                    {history.map((item) => (
                                        <Flex
                                            alignItems="start"
                                            flexDirection="col"
                                            className={`gap-1 border-l py-1 hover:bg-gray-900 cursor-pointer ${
                                                item.title === selectedTopic
                                                    ? 'border-white'
                                                    : 'border-gray-700'
                                            } pl-4`}
                                            onClick={() =>
                                                setSelectedTopic(item.title)
                                            }
                                        >
                                            <Subtitle className="text-blue-500">
                                                {item.assisstant}
                                            </Subtitle>
                                            <Text className="text-gray-400">
                                                {item.title}
                                            </Text>
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        )}
                    </div>
                </Flex>
                <Flex
                    justifyContent="center"
                    className={collapsed ? 'w-fit p-3' : ''}
                >
                    <Profile isCollapsed={collapsed} />
                </Flex>
            </Flex>
            {collapsed ? (
                <ChevronRightIcon
                    className="absolute -right-6 bottom-1/2 h-5 text-gray-400 hover:text-gray-800 cursor-pointer"
                    onClick={() => {
                        setCollapsed(false)
                        localStorage.collapse = 'false'
                    }}
                />
            ) : (
                <ChevronLeftIcon
                    className="absolute -right-6 bottom-1/2 h-5 text-gray-400  hover:text-gray-800 cursor-pointer"
                    onClick={() => {
                        setCollapsed(true)
                        localStorage.collapse = 'true'
                    }}
                />
            )}
        </Flex>
    )
}
