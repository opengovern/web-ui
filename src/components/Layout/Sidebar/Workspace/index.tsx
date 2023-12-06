import { Card, Flex, Text, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
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
                <Card className="absolute top-0 left-full bg-kaytu-950 p-4">
                    <Flex className="p-2 border-b border-b-gray-600 mb-1">
                        <Title className="text-gray-300">
                            {workspace.current?.name}
                        </Title>
                        <Text>{workspace.current?.version}</Text>
                    </Flex>
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="border-b border-b-gray-600 pb-2"
                    >
                        <Text className="font-semibold p-2">WORKSPACES</Text>
                        {workspace.list.map((ws) => (
                            <Flex className="px-2 py-1 rounded-md cursor-pointer hover:text-gray-50 hover:bg-kaytu-800">
                                <Title className="text-gray-300">
                                    {ws.name}
                                </Title>
                            </Flex>
                        ))}
                    </Flex>
                    <Flex>hi</Flex>
                </Card>
            )}
        </Flex>
    )
}
