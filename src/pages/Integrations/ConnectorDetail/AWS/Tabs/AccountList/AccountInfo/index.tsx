import {
    Badge,
    Button,
    Divider,
    Flex,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import {
    useOnboardApiV1CredentialDetail,
    useOnboardApiV1SourceDelete,
    useOnboardApiV1SourceHealthcheckDetail,
} from '../../../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'
import { RenderObject } from '../../../../../../../components/RenderObject'
import { useScheduleApiV1DescribeTriggerUpdate } from '../../../../../../../api/schedule.gen'

interface IAccInfo {
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    open: boolean
    type: string
    onClose: () => void
    notification: (text: string) => void
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
        default:
            return 'Archived'
    }
}

const renderMetadata = (
    type: string,
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
) => {
    if (data) {
        if (
            type === 'Organization Management Account' ||
            type === 'Organization Member Account'
        ) {
            return (
                <>
                    <Title className="mt-6">Metadata</Title>
                    <Divider />
                    <Flex>
                        <Text>ARN</Text>
                        <Text className="text-black">
                            {data.metadata?.account_organization.Arn}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Email</Text>
                        <Text className="text-black">
                            {
                                data.metadata?.account_organization
                                    .MasterAccountEmail
                            }
                        </Text>
                    </Flex>
                    <Title className="mt-6">Tags</Title>
                    <Divider className="mb-0" />
                    {data.metadata?.organization_tags && (
                        <RenderObject obj={data.metadata?.organization_tags} />
                    )}
                </>
            )
        }
    }
    return null
}

export default function AccountInfo({
    data,
    open,
    type,
    onClose,
    notification,
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

    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useOnboardApiV1SourceDelete(data?.id || '', {}, false)

    const {
        isExecuted: isHealthCheckExecuted,
        isLoading: isHealthCheckLoading,
        sendNow: runHealthCheckNow,
    } = useOnboardApiV1SourceHealthcheckDetail(data?.id || '', {}, false)

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
            notification('Health check completed')
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
        <DrawerPanel title="AWS Account" open={open} onClose={() => onClose()}>
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title>Account info</Title>
                    <Divider />
                    <Flex>
                        <Text>AWS account name</Text>
                        <Text className="text-black">
                            {data?.providerConnectionName}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>AWS account ID</Text>
                        <Text className="text-black">
                            {data?.metadata?.account_id}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Account Type</Text>
                        <Text className="text-black">{type}</Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>AWS account lifecycle state</Text>
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
                    <Divider />
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
                                    onChange={(e) => setKey(e.target.value)}
                                />
                                <Flex justifyContent="end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => seteKey(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="ml-3">Save</Button>
                                </Flex>
                            </>
                        ) : (
                            <Flex justifyContent="end">
                                <Text className="text-black">
                                    {credential?.config.accessKey}
                                </Text>
                                {type !== 'Organization Member Account' && (
                                    <Button
                                        variant="light"
                                        className="ml-3"
                                        onClick={() => {
                                            setKey(credential?.config.accessKey)
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
                        alignItems={esecret ? 'start' : 'center'}
                    >
                        <Text className="whitespace-nowrap">
                            AWS account secret
                        </Text>
                        {esecret ? (
                            <>
                                <TextInput
                                    className="w-full my-3"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                />
                                <Flex justifyContent="end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => seteSecret(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className="ml-3">Save</Button>
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
                                    onClick={() => seteSecret(true)}
                                >
                                    Edit
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Last Inventory</Text>
                        <Text className="text-black">
                            {dayjs(data?.lastInventory).format(
                                'MMM DD, YYYY HH:mm'
                            )}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Last Health Check</Text>
                        <Text className="text-black">
                            {dayjs(data?.lastHealthCheckTime).format(
                                'MMM DD, YYYY HH:mm'
                            )}
                        </Text>
                    </Flex>
                    {renderMetadata(type, data)}
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
