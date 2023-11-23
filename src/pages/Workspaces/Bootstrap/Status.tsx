import { Button, Flex, Text, TextInput } from '@tremor/react'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWorkspaceApiV1BootstrapDetail } from '../../../api/workspace.gen'

interface INode {
    first?: boolean
    totalJobs?: number
    finishedJobs?: number
    done?: boolean
    running?: boolean
    text?: string
}

function Node({ first, done, running, totalJobs, finishedJobs, text }: INode) {
    const nodeRunning =
        running !== undefined
            ? running
            : finishedJobs !== 0 && (finishedJobs || 0) < (totalJobs || 0)
    const nodeDone =
        done !== undefined
            ? done
            : finishedJobs !== 0 && (finishedJobs || 0) === (totalJobs || 0)

    const roundStyles = () => {
        if (nodeDone) {
            return 'bg-kaytu-500'
        }
        if (nodeRunning) {
            return 'border-2 border-kaytu-500 bg-white'
        }
        return 'border-2 border-gray-300 bg-white'
    }

    const progressPercentage = () => {
        if (finishedJobs !== undefined && totalJobs !== undefined) {
            if (finishedJobs > 0) {
                if (finishedJobs === totalJobs) {
                    return '100%'
                }
                const percentage = (finishedJobs / totalJobs) * 100
                return `${percentage}%`
            }
        }
        return '0%'
    }

    return (
        <>
            {!first && (
                <Flex className="relative" aria-hidden="true">
                    <div
                        className={`h-6 w-0.5 ml-3.5 ${
                            nodeRunning || nodeDone
                                ? 'bg-kaytu-500'
                                : 'bg-gray-200'
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
                    {nodeDone && (
                        <CheckIcon
                            className={`h-5 w-5 font-extrabold ${
                                nodeDone ? 'text-white' : ''
                            }`}
                            aria-hidden="true"
                        />
                    )}

                    {nodeRunning && (
                        <span
                            className="h-2.5 w-2.5 rounded-full bg-kaytu-500"
                            aria-hidden="true"
                        />
                    )}
                </Flex>
                <Flex flexDirection="col" className="pl-3">
                    <Flex alignItems="start">
                        <Text className="font-medium text-sm text-gray-800">
                            {text}
                        </Text>
                        <Text className="font-medium text-sm text-gray-500">
                            {finishedJobs === undefined ||
                            totalJobs === undefined
                                ? ''
                                : ` (${finishedJobs} of ${totalJobs} completed)`}
                        </Text>
                    </Flex>
                    <div className="w-full h-1 mt-2 bg-gray-300 rounded-xl">
                        <div
                            style={{ width: progressPercentage() }}
                            className="h-1 bg-gradient-to-r from-kaytu-400 to-kaytu-800 rounded-xl"
                        />
                    </div>
                </Flex>
            </Flex>
        </>
    )
}

interface IStatus {
    workspaceName: string
}

export function Status({ workspaceName }: IStatus) {
    const navigate = useNavigate()
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

    const wsCreateDone = statusResponse?.workspaceCreationStatus?.done || 0
    const wsCreateTotal = statusResponse?.workspaceCreationStatus?.total || 0

    const discoveryDone = statusResponse?.discoveryStatus?.done || 0
    const discoveryTotal = statusResponse?.discoveryStatus?.total || 0

    const analyticsDone = statusResponse?.analyticsStatus?.done || 0
    const analyticsTotal = statusResponse?.analyticsStatus?.total || 0

    const complianceDone = statusResponse?.complianceStatus?.done || 0
    const complianceTotal = statusResponse?.complianceStatus?.total || 0

    const insightDone = statusResponse?.insightsStatus?.done || 0
    const insightTotal = statusResponse?.insightsStatus?.total || 0

    const finished =
        wsCreateDone !== 0 &&
        wsCreateDone === wsCreateTotal &&
        discoveryDone !== 0 &&
        discoveryDone === discoveryTotal &&
        analyticsDone !== 0 &&
        analyticsDone === analyticsTotal &&
        complianceDone !== 0 &&
        complianceDone === complianceTotal &&
        insightDone !== 0 &&
        insightDone === insightTotal

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
                    finishedJobs={wsCreateDone}
                    totalJobs={wsCreateTotal}
                    text="Creating Workspace"
                />
                <Node
                    finishedJobs={discoveryDone}
                    totalJobs={discoveryTotal}
                    text="Gathering Inventory"
                />
                <Node
                    finishedJobs={analyticsDone}
                    totalJobs={analyticsTotal}
                    text="Reviewing Infrastructure & Cost"
                />
                <Node
                    finishedJobs={complianceDone}
                    totalJobs={complianceTotal}
                    text="Evaluating Compliances"
                />
                <Node
                    finishedJobs={insightDone}
                    totalJobs={insightTotal}
                    text="Gathering Insights"
                />
                <Node done={finished} text="Finishing Up" />
                <Button
                    className="mt-8"
                    disabled={!finished}
                    onClick={() => navigate(`/${workspaceName}`)}
                >
                    Access the workspace
                </Button>
            </Flex>
            <Flex className="w-2/3 h-full" flexDirection="col">
                <Text>Start the game</Text>
            </Flex>
        </Flex>
    )
}
