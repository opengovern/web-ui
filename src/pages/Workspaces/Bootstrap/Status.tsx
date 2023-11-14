import { Button, Flex, Text, TextInput } from '@tremor/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import { GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus } from '../../../api/api'
import { useWorkspaceApiV1BootstrapDetail } from '../../../api/workspace.gen'

interface INode {
    first?: boolean
    done?: boolean
    running?: boolean
    text?: string
}

function Node({ first, done, running, text }: INode) {
    const roundStyles = () => {
        if (done) {
            return 'bg-kaytu-500'
        }
        if (running) {
            return 'border-2 border-kaytu-500 bg-white'
        }
        return 'border-2 border-gray-300 bg-white'
    }
    return (
        <>
            {!first && (
                <Flex className="relative" aria-hidden="true">
                    <div
                        className={`h-4 w-0.5 ml-4 ${
                            running || done ? 'bg-kaytu-500' : 'bg-gray-200'
                        }`}
                    />
                </Flex>
            )}
            <Flex flexDirection="row">
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className={`relative h-8 w-8 rounded-full ${roundStyles()}`}
                >
                    {done && (
                        <CheckIcon
                            className={`h-5 w-5 font-extrabold ${
                                done ? 'text-white' : ''
                            }`}
                            aria-hidden="true"
                        />
                    )}

                    {running && (
                        <span
                            className="h-2.5 w-2.5 rounded-full bg-kaytu-500"
                            aria-hidden="true"
                        />
                    )}
                </Flex>
                <Flex className="pl-3">
                    <Text className="font-medium text-sm text-gray-800">
                        {text}
                    </Text>
                </Flex>
            </Flex>
        </>
    )
}

interface IStatus {
    workspaceName: string
}

export function Status({ workspaceName }: IStatus) {
    const {
        response: statusResponse,
        isExecuted: statusIsExecuted,
        isLoading: statusIsLoading,
        error: statusError,
        sendNow: refreshStatus,
    } = useWorkspaceApiV1BootstrapDetail(workspaceName)

    useEffect(() => {
        if (statusIsExecuted && !statusIsLoading) {
            setTimeout(() => {
                refreshStatus()
            }, 5000)
        }
    }, [statusIsLoading])

    const step = (
        stepStatus?: GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus
    ) => {
        switch (stepStatus) {
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusOnboardConnection:
                return 0
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusCreatingWorkspace:
                return 1
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForDiscovery:
                return 2
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForAnalytics:
                return 3
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForCompliance:
                return 4
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForInsights:
                return 5
            case GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusFinished:
                return 6
            default:
                return -1
        }
    }

    const stepValue = step(statusResponse?.status)

    return (
        <Flex justifyContent="start" className="h-full" alignItems="start">
            <Flex
                className="w-1/3 h-full"
                flexDirection="col"
                alignItems="start"
            >
                <Text className="font-bold text-sm text-gray-800">
                    In Progress
                </Text>
                <Text className="text-sm text-gray-800 mb-4">
                    Kaytu is working on creating your workspace
                </Text>
                <Node
                    first
                    running={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusCreatingWorkspace
                    }
                    done={
                        stepValue >
                        step(
                            GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusCreatingWorkspace
                        )
                    }
                    text="Creating Workspace"
                />
                <Node
                    running={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForDiscovery
                    }
                    done={
                        stepValue >
                        step(
                            GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForDiscovery
                        )
                    }
                    text="Gathering Inventory"
                />
                <Node
                    running={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForAnalytics
                    }
                    done={
                        stepValue >
                        step(
                            GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForAnalytics
                        )
                    }
                    text="Reviewing Infrastructure & Cost"
                />
                <Node
                    running={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForCompliance
                    }
                    done={
                        stepValue >
                        step(
                            GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForCompliance
                        )
                    }
                    text="Evaluating Compliances"
                />
                <Node
                    running={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForInsights
                    }
                    done={
                        stepValue >
                        step(
                            GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusWaitingForInsights
                        )
                    }
                    text="Gathering Insights"
                />
                <Node
                    done={
                        statusResponse?.status ===
                        GithubComKaytuIoKaytuEnginePkgWorkspaceApiBootstrapStatus.BootstrapStatusFinished
                    }
                    text="Finishing Up"
                />
            </Flex>
            <Flex className="w-2/3 h-full" flexDirection="col">
                <Text>Start the game</Text>
            </Flex>
        </Flex>
    )
}
