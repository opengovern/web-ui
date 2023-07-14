import { Badge, Button, Divider, Flex, Text, Title } from '@tremor/react'
import { useEffect } from 'react'
import {
    useOnboardApiV1SourceDelete,
    useOnboardApiV1SourceHealthcheckCreate,
} from '../../../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'
import { useScheduleApiV1DescribeTriggerUpdate } from '../../../../../../../api/schedule.gen'

interface ISubscriptionInfo {
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    open: boolean
    onClose: () => void
}

export default function SubscriptionInfo({
    data,
    open,
    onClose,
}: ISubscriptionInfo) {
    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useOnboardApiV1SourceDelete(data?.id || '', {}, false)

    const {
        isExecuted: isHealthCheckExecuted,
        isLoading: isHealthCheckLoading,
        sendNow: runHealthCheckNow,
    } = useOnboardApiV1SourceHealthcheckCreate(data?.id || '', {}, false)

    const {
        isExecuted: isDiscoverExecuted,
        isLoading: isDiscoverLoading,
        sendNow: discoverNow,
    } = useScheduleApiV1DescribeTriggerUpdate(data?.id || '', {}, false)

    useEffect(() => {
        if (isDeleteExecuted && !isDeleteLoading) {
            onClose()
        }
    }, [isDeleteLoading])

    useEffect(() => {
        if (isHealthCheckExecuted && !isHealthCheckLoading) {
            onClose()
        }
    }, [isHealthCheckLoading])

    useEffect(() => {
        if (isDiscoverExecuted && !isDiscoverLoading) {
            onClose()
        }
    }, [isDiscoverLoading])

    const buttonsDisabled =
        (isDeleteExecuted && isDeleteLoading) ||
        (isHealthCheckExecuted && isHealthCheckLoading) ||
        (isDiscoverExecuted && isDiscoverLoading)

    return (
        <DrawerPanel
            title="Azure Subscription"
            open={open}
            onClose={() => onClose()}
        >
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title>Info</Title>
                    <Divider />
                    <Flex>
                        <Text>Name</Text>
                        <Text className="text-black">
                            {data?.providerConnectionName}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>ID</Text>
                        <Text className="text-black">
                            {data?.providerConnectionID}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Subscription Lifecycle State</Text>
                        <Badge
                            color={
                                data?.lifecycleState === 'ONBOARD'
                                    ? 'green'
                                    : 'rose'
                            }
                        >
                            {data?.lifecycleState}
                        </Badge>
                    </Flex>
                </Flex>
                <Flex justifyContent="end">
                    <Button
                        variant="secondary"
                        color="rose"
                        loading={isDeleteExecuted && isDeleteLoading}
                        disabled={buttonsDisabled}
                        onClick={deleteNow}
                    >
                        Delete
                    </Button>
                    <Button
                        className="ml-3"
                        loading={isHealthCheckExecuted && isHealthCheckLoading}
                        disabled={buttonsDisabled}
                        onClick={runHealthCheckNow}
                    >
                        Trigger Health Check
                    </Button>
                    <Button
                        className="ml-3"
                        loading={isDiscoverExecuted && isDiscoverLoading}
                        disabled={buttonsDisabled}
                        onClick={discoverNow}
                    >
                        Trigger Discovery
                    </Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
