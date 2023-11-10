import { Bold, Button, Card, Flex, Icon, Text } from '@tremor/react'
import {
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
import { AWSIcon, AzureIcon } from '../../../icons/icons'

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
                <img src={icon} alt="connector" className="w-12 h-12 mr-1" />
                <Text className="text-gray-800 font-bold">{count}</Text>
            </Flex>

            <Text className="text-gray-800 font-bold py-1.5">{name}</Text>
            <Flex justifyContent="between">
                <Text className="text-gray-500">{description}</Text>
                <ChevronRightIcon className="text-kaytu-600 w-4" />
            </Flex>
        </Card>
    )
}

interface IOnboardConnection {
    open: boolean
    done: boolean
    doDone: () => void
    onAWSClick: () => void
    onAzureClick: () => void
    isLoading: boolean
}
export function OnboardConnection({
    isLoading,
    open,
    done,
    doDone,
    onAWSClick,
    onAzureClick,
}: IOnboardConnection) {
    return (
        <div className="p-6 border-b border-b-gray-200">
            <Flex justifyContent="between">
                <Flex alignItems="start" justifyContent="start">
                    <CheckCircleIcon
                        height={20}
                        className={done ? 'text-emerald-500' : 'text-gray-500'}
                    />
                    <Text className="ml-2 text-sm text-gray-800">
                        3. Select your connections
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
            {open && (
                <>
                    <Text className="text-gray-500 m-3">
                        The setup steps vary depending on the cloud service you
                        choose.
                    </Text>
                    <Flex justifyContent="start">
                        <Connector
                            name="AWS"
                            description="AWS Account"
                            count={1}
                            icon={AWSIcon}
                            onClick={() => {
                                onAWSClick()
                            }}
                        />
                        <Connector
                            name="Azure"
                            description="Azure subscription"
                            count={1}
                            icon={AzureIcon}
                            onClick={() => {
                                onAzureClick()
                            }}
                        />
                    </Flex>
                    <Flex justifyContent="start" className="ml-3">
                        <ExclamationCircleIcon className="w-4" />
                        <Text className="ml-1">
                            Minimum AWS account is 3 and maximum is 10
                        </Text>
                    </Flex>
                    <Flex justifyContent="start" className="ml-3">
                        <ExclamationCircleIcon className="w-4" />
                        <Text className="ml-1">
                            Minimum Azure subscription is 3 and maximum is 10
                        </Text>
                    </Flex>
                    <Flex justifyContent="start" className="m-3">
                        <Button onClick={doDone} loading={isLoading}>
                            Create
                        </Button>
                    </Flex>
                </>
            )}
        </div>
    )
}
