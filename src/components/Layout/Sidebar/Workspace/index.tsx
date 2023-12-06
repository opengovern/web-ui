import { Card, Flex, Text, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { KaytuIcon } from '../../../../icons/icons'
import { useWorkspaceApiV1WorkspacesList } from '../../../../api/workspace.gen'
import { workspaceAtom } from '../../../../store'

interface IWorkspace {
    isCollapsed: boolean
}

export default function Workspace({ isCollapsed }: IWorkspace) {
    const [showInfo, setShowInfo] = useState(false)
    const [workspace, setWorkspace] = useAtom(workspaceAtom)
    const wsName = window.location.pathname.split('/')[1]
    const {
        response: workspaceInfo,
        isExecuted,
        sendNow,
    } = useWorkspaceApiV1WorkspacesList({}, false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!workspace.current && workspace.list.length < 1 && !isExecuted) {
            sendNow()
        }
        if (workspace && wsName) {
            if (!workspace.current || workspace.list.length < 1) {
                const current = workspaceInfo?.filter(
                    (ws) => ws.name === wsName
                )

                setWorkspace({
                    list: workspaceInfo || [],
                    current: current ? current[0] : undefined,
                })
            }
        }
    }, [workspace, workspaceInfo])
    console.log(workspace)

    return (
        <Flex className="mt-2 h-16 shrink-0 border-b border-gray-700 relative">
            <Flex
                className="cursor-pointer"
                onClick={() => setShowInfo(!showInfo)}
            >
                <KaytuIcon
                    className={`ml-5 ${isCollapsed ? 'w-8 h-8' : 'w-7 h-7'}`}
                />
                {!isCollapsed && (
                    <Flex>
                        <Title className="text-gray-100 ml-1.5">Kaytu</Title>
                        {showInfo ? (
                            <ChevronLeftIcon className="w-4 text-gray-100 mr-5" />
                        ) : (
                            <ChevronRightIcon className="w-4 text-gray-100 mr-5" />
                        )}
                    </Flex>
                )}
            </Flex>
            {showInfo && (
                <>
                    <Card
                        className="absolute z-20 bg-kaytu-950 p-4"
                        style={{
                            left: 'calc(100% + 4px)',
                            top: '4px',
                        }}
                    >
                        <Flex className="p-2 border-b border-b-gray-600 mb-1">
                            <Title className="text-gray-300">
                                {workspace.current?.name}
                            </Title>
                            <Text>{workspace.current?.version}</Text>
                        </Flex>
                        {workspace.list.length > 1 && (
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="border-b border-b-gray-600 pb-2"
                            >
                                <Text className="font-semibold px-2 mt-2 mb-1">
                                    WORKSPACES
                                </Text>
                                {workspace.list.map((ws) => (
                                    <Flex
                                        onClick={() => navigate(`/${ws.name}`)}
                                        className="p-2 rounded-md cursor-pointer text-gray-300 hover:text-gray-50 hover:bg-kaytu-800"
                                    >
                                        <Text className="text-inherit font-semibold">
                                            {ws.name}
                                        </Text>
                                    </Flex>
                                ))}
                            </Flex>
                        )}
                        <Flex
                            justifyContent="start"
                            onClick={() => navigate('/')}
                            className="p-2 gap-3 mt-2 text-gray-300 rounded-md cursor-pointer hover:text-gray-50 hover:bg-kaytu-800"
                        >
                            <ArrowTopRightOnSquareIcon className="w-5 text-gray-400" />
                            <Text className="text-inherit font-semibold">
                                Workspace list
                            </Text>
                        </Flex>
                    </Card>
                    <Card
                        onClick={() => setShowInfo(false)}
                        className="fixed z-10 w-screen h-screen top-0 left-0 opacity-0"
                    />
                </>
            )}
        </Flex>
    )
}
