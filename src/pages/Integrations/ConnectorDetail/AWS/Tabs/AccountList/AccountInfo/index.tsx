import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Badge,
    Button,
    Divider,
    Flex,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import { useSetAtom } from 'jotai'
import {
    useOnboardApiV1CredentialDetail,
    useOnboardApiV1SourceDelete,
} from '../../../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'
import { useScheduleApiV1DescribeTriggerUpdate } from '../../../../../../../api/schedule.gen'
import Tag from '../../../../../../../components/Tag'
import { dateTimeDisplay } from '../../../../../../../utilities/dateDisplay'
import { notificationAtom } from '../../../../../../../store'
import { useIntegrationApiV1ConnectionsAwsHealthcheckDetail } from '../../../../../../../api/integration.gen'

interface IAccInfo {
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    open: boolean
    type: string
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

export default function AccountInfo({
    data,
    open,
    type,
    onClose,
    isDemo,
}: IAccInfo) {
    const { response: credential } = useOnboardApiV1CredentialDetail(
        data?.credentialID || '',
        {},
        !!data && open
    )

    const [key, setKey] = useState('')
    const [ekey, seteKey] = useState(false)
    const [secret, setSecret] = useState('')
    const [esecret, seteSecret] = useState(false)
    const setNotification = useSetAtom(notificationAtom)

    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useOnboardApiV1SourceDelete(data?.id || '', {}, false)

    const {
        response: healthResponse,
        isExecuted: isHealthCheckExecuted,
        isLoading: isHealthCheckLoading,
        sendNow: runHealthCheckNow,
    } = useIntegrationApiV1ConnectionsAwsHealthcheckDetail(
        data?.id || '',
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
            setNotification({ text: 'Health check triggered', type: 'info' })
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

    return (
        <DrawerPanel title="AWS Account" open={open} onClose={() => onClose()}>
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title>Summary</Title>
                    <Divider />
                    <Flex>
                        <Text>Account name</Text>
                        <Text
                            className={
                                isDemo ? 'blur-md text-black' : 'text-black'
                            }
                        >
                            {data?.providerConnectionName}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Account ID</Text>
                        <Text
                            className={
                                isDemo ? 'blur-md text-black' : 'text-black'
                            }
                        >
                            {data?.metadata?.account_id}
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
                    </Flex>
                    <Divider />
                    {data?.healthState === 'unhealthy' && (
                        <>
                            <Flex>
                                <Text>Health reason</Text>
                                <Text className="text-black">
                                    {healthResponse?.healthReason}
                                </Text>
                            </Flex>
                            <Divider />
                        </>
                    )}
                    <Flex className="mb-6">
                        <Text>Account lifecycle state</Text>
                        <Badge
                            color={
                                data?.lifecycleState === 'ONBOARD'
                                    ? 'emerald'
                                    : 'rose'
                            }
                        >
                            {getBadgeText(data?.lifecycleState || '')}
                        </Badge>
                    </Flex>
                    <Accordion className="w-full p-0 !rounded-none border-b-0 border-x-0 border-t-gray-200">
                        <AccordionHeader className="w-full p-0 py-6 border-0">
                            <Title>Additional detail</Title>
                        </AccordionHeader>
                        <AccordionBody className="w-full p-0 border-0">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="border-t border-t-gray-200 py-6"
                            >
                                <Flex>
                                    <Text>Account type</Text>
                                    <Text className="text-black">{type}</Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>ARN</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-md text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {
                                            data?.metadata?.account_organization
                                                ?.Arn
                                        }
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>Onboard date</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-md text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {dateTimeDisplay(data?.onboardDate)}
                                    </Text>
                                </Flex>
                                <Divider />
                                <Flex>
                                    <Text>Last inventory</Text>
                                    <Text
                                        className={
                                            isDemo
                                                ? 'blur-md text-black'
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
                                                ? 'blur-md text-black'
                                                : 'text-black'
                                        }
                                    >
                                        {dateTimeDisplay(
                                            data?.lastHealthCheckTime
                                        )}
                                    </Text>
                                </Flex>
                                {data?.metadata?.organization_tags &&
                                    (type === 'Organization member' ||
                                        type === 'Organization manager') && (
                                        <>
                                            <Divider />
                                            <Flex alignItems="start">
                                                <Text className="w-fit">
                                                    Tags
                                                </Text>
                                                <Flex
                                                    justifyContent="end"
                                                    className="flex-wrap gap-2"
                                                >
                                                    {Object.entries(
                                                        data.metadata
                                                            ?.organization_tags
                                                    ).map(([name, value]) => (
                                                        <Tag
                                                            isDemo={isDemo}
                                                            text={`${name}: ${value}`}
                                                        />
                                                    ))}
                                                </Flex>
                                            </Flex>
                                        </>
                                    )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    {(type === 'Organization member' ||
                        type === 'Organization manager') && (
                        <Accordion className="w-full p-0 !rounded-none border-b-0 border-x-0 border-t-gray-200">
                            <AccordionHeader className="w-full p-0 py-6 border-0">
                                <Title>Organization info</Title>
                            </AccordionHeader>
                            <AccordionBody className="w-full p-0 border-0">
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="border-t border-t-gray-200 py-6"
                                >
                                    <Flex>
                                        <Text>Organization ID</Text>
                                        <Text className="text-black">
                                            {
                                                data?.metadata
                                                    ?.account_organization?.Id
                                            }
                                        </Text>
                                    </Flex>
                                    <Divider />
                                    <Flex>
                                        <Text>Master account ARN</Text>
                                        <Text className="text-black text-end">
                                            {
                                                data?.metadata
                                                    ?.account_organization
                                                    ?.MasterAccountArn
                                            }
                                        </Text>
                                    </Flex>
                                    <Divider />
                                    <Flex>
                                        <Text>Email</Text>
                                        <Text className="text-black">
                                            {
                                                data?.metadata
                                                    ?.account_organization
                                                    ?.MasterAccountEmail
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </AccordionBody>
                        </Accordion>
                    )}
                    {(type === 'Organization manager' ||
                        type === 'Standalone') && (
                        <Accordion className="w-full p-0 !rounded-none border-b-0 border-x-0 border-t-gray-200">
                            <AccordionHeader className="w-full p-0 py-6">
                                <Title>Access credentials</Title>
                            </AccordionHeader>
                            <AccordionBody className="w-full p-0 border-0">
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="border-t border-t-gray-200 py-6"
                                >
                                    <Flex
                                        flexDirection={ekey ? 'col' : 'row'}
                                        alignItems={ekey ? 'start' : 'center'}
                                    >
                                        <Text className="whitespace-nowrap">
                                            AWS account key
                                        </Text>
                                        {ekey ? (
                                            <>
                                                <TextInput
                                                    className="w-full my-3"
                                                    value={key}
                                                    onChange={(e) =>
                                                        setKey(e.target.value)
                                                    }
                                                />
                                                <Flex justifyContent="end">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() =>
                                                            seteKey(false)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button className="ml-3">
                                                        Save
                                                    </Button>
                                                </Flex>
                                            </>
                                        ) : (
                                            <Flex justifyContent="end">
                                                <Text className="text-black">
                                                    {
                                                        credential?.config
                                                            .accessKey
                                                    }
                                                </Text>
                                                {type ===
                                                    'Organization manager' && (
                                                    <Button
                                                        variant="light"
                                                        className="ml-3"
                                                        onClick={() => {
                                                            setKey(
                                                                credential
                                                                    ?.config
                                                                    .accessKey
                                                            )
                                                            seteKey(true)
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </Flex>
                                        )}
                                    </Flex>
                                    <Divider />
                                    <Flex
                                        flexDirection={esecret ? 'col' : 'row'}
                                        alignItems={
                                            esecret ? 'start' : 'center'
                                        }
                                    >
                                        <Text className="whitespace-nowrap">
                                            AWS account secret
                                        </Text>
                                        {esecret ? (
                                            <>
                                                <TextInput
                                                    className="w-full my-3"
                                                    value={secret}
                                                    onChange={(e) =>
                                                        setSecret(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Flex justifyContent="end">
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() =>
                                                            seteSecret(false)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button className="ml-3">
                                                        Save
                                                    </Button>
                                                </Flex>
                                            </>
                                        ) : (
                                            <Flex justifyContent="end">
                                                <Text className="text-black">
                                                    *****************
                                                </Text>
                                                <Button
                                                    variant="light"
                                                    className="ml-3"
                                                    onClick={() =>
                                                        seteSecret(true)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            </Flex>
                                        )}
                                    </Flex>
                                </Flex>
                            </AccordionBody>
                        </Accordion>
                    )}
                </Flex>
                <Flex justifyContent="end" className="mt-6">
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
        </DrawerPanel>
    )
}
