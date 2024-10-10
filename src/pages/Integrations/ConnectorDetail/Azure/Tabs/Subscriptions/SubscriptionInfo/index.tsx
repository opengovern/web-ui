import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Button,
    Divider,
    Flex,
    Text,
    Title,
} from '@tremor/react'
import { useEffect } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'
import { useScheduleApiV1DescribeTriggerUpdate } from '../../../../../../../api/schedule.gen'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import Tag from '../../../../../../../components/Tag'
import { snakeCaseToLabel } from '../../../../../../../utilities/labelMaker'
import {
    useIntegrationApiV1ConnectionsAzureHealthcheckDetail,
    useIntegrationApiV1ConnectionsDelete,
} from '../../../../../../../api/integration.gen'
import { KeyValuePairs, Tabs } from '@cloudscape-design/components'

interface ISubscriptionInfo {
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    open: boolean
    onClose: () => void
    isDemo: boolean
}

function getBadgeText(status: string) {
    switch (status) {
        case 'NOT_ONBOARD':
            return 'Not Onboarded'
        case 'IN_PROGRESS':
            return 'In Progress'
        case 'ONBOARD':
            return 'Onboarded'
        case 'UNHEALTHY':
            return 'Unhealthy'
        case 'DISCOVERED':
            return 'Discovered'
        default:
            return 'Archived'
    }
}

export default function SubscriptionInfo({
    data,
    open,
    onClose,
    isDemo,
}: ISubscriptionInfo) {
    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useIntegrationApiV1ConnectionsDelete(data?.id || '', {}, false)

    const {
        response: healthResponse,
        isExecuted: isHealthCheckExecuted,
        isLoading: isHealthCheckLoading,
        sendNow: runHealthCheckNow,
    } = useIntegrationApiV1ConnectionsAzureHealthcheckDetail(
        data?.id || '',
        {},
        {},
        false
    )

    const {
        isExecuted: isDiscoverExecuted,
        isLoading: isDiscoverLoading,
        sendNow: discoverNow,
    } = useScheduleApiV1DescribeTriggerUpdate(
        data?.id || '',
        {
            resource_type: data?.id ? [data?.id] : [''],
        },
        {},
        false
    )

    useEffect(() => {
        if (isDeleteExecuted && !isDeleteLoading) {
            onClose()
        }
    }, [isDeleteLoading])

    useEffect(() => {
        if (isHealthCheckExecuted && !isHealthCheckLoading) {
            onClose()
        }
    }, [isHealthCheckExecuted])

    useEffect(() => {
        if (isDiscoverExecuted && !isDiscoverLoading) {
            onClose()
        }
    }, [isDiscoverLoading])

    const buttonsDisabled =
        (isDeleteExecuted && isDeleteLoading) ||
        (isHealthCheckExecuted && isHealthCheckLoading) ||
        (isDiscoverExecuted && isDiscoverLoading)
    const summaryTab = () => {
        const temp = [
            {
                label: 'Account name',
                value: data?.providerConnectionName,
            },
            {
                label: 'Account ID',
                value: data?.providerConnectionID,
            },
            {
                label: 'Health state',
                value: (
                    <>
                        <Flex className="w-fit gap-4">
                            <Button
                                loading={
                                    isHealthCheckExecuted &&
                                    isHealthCheckLoading
                                }
                                variant="light"
                                disabled={buttonsDisabled}
                                onClick={runHealthCheckNow}
                                icon={ArrowPathRoundedSquareIcon}
                            >
                                Trigger Health Check
                            </Button>
                            {healthResponse ? (
                                <Badge
                                    color={
                                        healthResponse?.healthState ===
                                        'healthy'
                                            ? 'emerald'
                                            : 'rose'
                                    }
                                >
                                    {healthResponse?.healthState}
                                </Badge>
                            ) : (
                                <Badge
                                    color={
                                        data?.healthState === 'healthy'
                                            ? 'emerald'
                                            : 'rose'
                                    }
                                >
                                    {data?.healthState}
                                </Badge>
                            )}
                        </Flex>
                    </>
                ),
            },
        ]

        if (data?.healthState === 'unhealthy') {
            temp.push({
                label: 'Health reason',
                value: data?.healthReason,
            })
        }
        temp.push({
            label: 'Account lifecycle state',
            value: (
                <>
                    <Badge
                        color={
                            data?.lifecycleState === 'ONBOARD'
                                ? 'emerald'
                                : 'rose'
                        }
                    >
                        {getBadgeText(data?.lifecycleState || '')}
                    </Badge>
                </>
            ),
        })
        return temp
    }
    const additionalTabs = () => {
        const temp = []
        temp.push({
            label: 'Subscription type',
            value: <>{snakeCaseToLabel(data?.credentialType || '')}</>,
        })
        temp.push({
            label: 'Last inventory',
            value: dateTimeDisplay(data?.lastInventory),
        })
        temp.push({
            label: 'Onboard date',
            value: dateTimeDisplay(data?.onboardDate),
        })
        temp.push({
            label: 'Last inventory',
            value: dateTimeDisplay(data?.lastInventory),
        })
        temp.push({
            label: 'Last health check',
            value: dateTimeDisplay(data?.lastHealthCheckTime),
        })
        if (
            data?.metadata?.organization_tags 
           
        ) {
            temp.push({
                label: 'Tags',
                value: (
                    <>
                        {Object.entries(data.metadata?.organization_tags).map(
                            ([name, value]) => (
                                <Tag
                                    isDemo={isDemo}
                                    text={`${name}: ${value}`}
                                />
                            )
                        )}
                    </>
                ),
            })
        }

        return temp
    }

    return (
        <>
            <Tabs
                tabs={[
                    {
                        label: 'Summary',
                        id: '1',
                        content: (
                            <>
                                <KeyValuePairs
                                    columns={4}
                                    // @ts-ignore
                                    items={summaryTab()}
                                />
                            </>
                        ),
                    },
                    {
                        label: 'Additional Detail',
                        id: '2',
                        content: (
                            <>
                                <KeyValuePairs
                                    columns={4}
                                    // @ts-ignore
                                    items={additionalTabs()}
                                />
                            </>
                        ),
                    },
                ]}
            />
            <Flex flexDirection="col" className="h-full">
                {/* <Flex flexDirection="col" alignItems="start">
                    <Title>Summary</Title>
                    <Divider />
                    <Flex>
                        <Text>Name</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.providerConnectionName}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>ID</Text>
                        <Text
                            className={
                                isDemo ? 'blur-sm text-black' : 'text-black'
                            }
                        >
                            {data?.providerConnectionID}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Health state</Text>
                        <Flex className="w-fit gap-4">
                            <Button
                                loading={
                                    isHealthCheckExecuted &&
                                    isHealthCheckLoading
                                }
                                variant="light"
                                disabled={buttonsDisabled}
                                onClick={runHealthCheckNow}
                                icon={ArrowPathRoundedSquareIcon}
                            >
                                Trigger health check
                            </Button>
                            {healthResponse ? (
                                <Badge
                                    color={
                                        healthResponse?.healthState ===
                                        'healthy'
                                            ? 'emerald'
                                            : 'rose'
                                    }
                                >
                                    {healthResponse?.healthState}
                                </Badge>
                            ) : (
                                <Badge
                                    color={
                                        data?.healthState === 'healthy'
                                            ? 'emerald'
                                            : 'rose'
                                    }
                                >
                                    {data?.healthState}
                                </Badge>
                            )}
                        </Flex>
                    </Flex>
                    <Divider />
                    {data?.healthState === 'unhealthy' && (
                        <>
                            <Flex>
                                <Text>Health reason</Text>
                                <Text className="text-black">
                                    {data?.healthReason}
                                </Text>
                            </Flex>
                            <Divider />
                        </>
                    )}
                    <Flex className="mb-6">
                        <Text>Lifecycle state</Text>
                        <Badge
                            color={
                                data?.lifecycleState === 'ONBOARD'
                                    ? 'green'
                                    : 'rose'
                            }
                        >
                            {getBadgeText(data?.lifecycleState || '')}
                        </Badge>
                    </Flex>
                    <Accordion className="w-full p-0 !rounded-none border-b-0 border-x-0 border-t-gray-200">
                        <AccordionHeader className="w-full p-0 py-6 border-0">
                            <Title>Additional details</Title>
                        </AccordionHeader>
                        <AccordionBody className="w-full p-0 border-0">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="border-t border-t-gray-200 py-6"
                            >
                                <Flex>
                                    <Text>Subscription Type</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-sm text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {snakeCaseToLabel(
                                            data?.credentialType || ''
                                        )}
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>Last inventory</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-sm text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {dateTimeDisplay(data?.lastInventory)}
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>Last health check</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-sm text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {dateTimeDisplay(
                                            data?.lastHealthCheckTime
                                        )}
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>Onboard date</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-sm text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {dateTimeDisplay(data?.onboardDate)}
                                    </Text>
                                </Flex>
                                {data?.metadata?.subscription_tags && (
                                    <>
                                        <Divider />
                                        <Flex alignItems="start">
                                            <Text className="w-fit">Tags</Text>
                                            <Flex
                                                justifyContent="end"
                                                className="max-w-full flex-wrap gap-2"
                                            >
                                                {Object.entries(
                                                    data?.metadata
                                                        ?.subscription_tags
                                                ).map(([name, value]) => (
                                                    <Tag
                                                        text={`${name}: ${value}`}
                                                        isDemo={isDemo}
                                                    />
                                                ))}
                                            </Flex>
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                </Flex> */}
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
                        loading={isDiscoverExecuted && isDiscoverLoading}
                        disabled={buttonsDisabled}
                        onClick={discoverNow}
                    >
                        Trigger Discovery
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}
