import { Bold, Button, Card, Flex, Icon, Text } from '@tremor/react'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { useNavigate } from 'react-router-dom'
import { AWSIcon, AzureIcon } from '../../../icons/icons'
import { useWorkspaceApiV1BootstrapDetail } from '../../../api/workspace.gen'
import Spinner from '../../../components/Spinner'

interface IConnector {
    onClick: () => void
    icon: string
    name: string
    description: string
    count: number
}
function Connector({ onClick, icon, name, description, count }: IConnector) {
    return (
        <Card className="m-3 w-1/3 cursor-pointer" onClick={onClick}>
            <Flex className="mb-2">
                <img
                    src={icon}
                    alt="connector"
                    className="w-12 h-12 mr-1 rounded-full"
                />
                <Text className="text-gray-800 font-bold">{count}</Text>
            </Flex>

            <Text className="text-gray-800 font-bold py-1.5">{name}</Text>
            <Flex justifyContent="between">
                <Text className="text-gray-500">{description}</Text>
                <Flex flexDirection="row" className="w-fit">
                    <Text className="text-openg-500 h-5">Add</Text>
                    <PlusIcon className="text-openg-500 w-4" />
                </Flex>
            </Flex>
        </Card>
    )
}

interface IOnboardConnection {
    open: boolean
    done: boolean
    workspaceName: string
    doDone: () => void
    onAWSClick: () => void
    onAzureClick: () => void
    isLoading: boolean
}
export function OnboardConnection({
    isLoading,
    open,
    done,
    workspaceName,
    doDone,
    onAWSClick,
    onAzureClick,
}: IOnboardConnection) {
    const navigate = useNavigate()
    const [firstLoading, setFirstLoading] = useState(true)
    const {
        response: statusResponse,
        isExecuted: statusIsExecuted,
        isLoading: statusIsLoading,
        error: statusError,
        sendNow: refreshStatus,
    } = useWorkspaceApiV1BootstrapDetail(workspaceName, {}, open)

    useEffect(() => {
        if (statusIsExecuted && !statusIsLoading) {
            setFirstLoading(false)
            setTimeout(() => {
                refreshStatus()
            }, 5000)
        }
    }, [statusIsLoading])

    const connectionCount = statusResponse?.connection_count
        ? Object.entries(statusResponse?.connection_count)
        : []
    const awsCount = connectionCount
        .filter((item) => item[0] === 'AWS')
        .at(0)?.[1]
    const azureCount = connectionCount
        .filter((item) => item[0] === 'Azure')
        .at(0)?.[1]

    const allConnectionCount = (awsCount || 0) + (azureCount || 0)

    return (
        <div className="p-6 border-b border-b-gray-200">
            <Flex justifyContent="between">
                <Flex alignItems="start" justifyContent="start">
                    <CheckCircleIcon
                        height={20}
                        className={done ? 'text-emerald-500' : 'text-gray-500'}
                    />
                    <Text className="ml-2 text-sm text-gray-800">
                        2. Onboard your AWS accounts & Azure Subscriptions
                    </Text>
                </Flex>
                <div>
                    {open ? (
                        <ChevronUpIcon height={20} color="text-blue-500" />
                    ) : (
                        <ChevronDownIcon height={20} color="text-blue-500" />
                    )}
                </div>
            </Flex>
            {open && firstLoading && (
                <Flex className="h-60">
                    <Spinner />
                </Flex>
            )}
            {open && !firstLoading && (
                <>
                    <Text className="text-gray-500 m-3">
                        The setup steps vary depending on the cloud provider you
                        choose.
                    </Text>
                    <Flex justifyContent="start">
                        <Connector
                            name="AWS"
                            description="AWS Account"
                            count={awsCount || 0}
                            icon={AWSIcon}
                            onClick={() => {
                                onAWSClick()
                            }}
                        />
                        <Connector
                            name="Azure"
                            description="Azure subscription"
                            count={azureCount || 0}
                            icon={AzureIcon}
                            onClick={() => {
                                onAzureClick()
                            }}
                        />
                    </Flex>
                    <Flex justifyContent="start" className="ml-3">
                        <ExclamationCircleIcon
                            className={`w-4 ${
                                allConnectionCount >=
                                (statusResponse?.minRequiredConnections || 9999)
                                    ? 'text-emerald-500'
                                    : 'text-red-500'
                            }`}
                        />
                        <Text
                            className={`ml-1 ${
                                allConnectionCount >=
                                (statusResponse?.minRequiredConnections || 9999)
                                    ? 'text-emerald-500'
                                    : 'text-red-500'
                            }`}
                        >
                            Minimum of {statusResponse?.minRequiredConnections}{' '}
                            accounts are required
                        </Text>
                    </Flex>
                    <Flex justifyContent="start" className="ml-3">
                        <ExclamationCircleIcon className="w-4" />
                        <Text className="ml-1">
                            Maximum allowed accounts are{' '}
                            {statusResponse?.maxConnections}
                        </Text>
                    </Flex>
                    <Flex justifyContent="start" className="m-3">
                        <Button
                            onClick={doDone}
                            loading={isLoading}
                            // disabled={
                            //     allConnectionCount === 0 ||
                            //     allConnectionCount <
                            //         (statusResponse?.minRequiredConnections ||
                            //             0)
                            // }
                        >
                            Finish
                        </Button>
                        <Button
                            variant="secondary"
                            className="ml-3"
                            onClick={() => navigate('/')}
                        >
                            Back
                        </Button>
                    </Flex>
                </>
            )}
        </div>
    )
}
