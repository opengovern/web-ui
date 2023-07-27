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
import {
    useOnboardApiV1CredentialDetail,
    useOnboardApiV1SourceDelete,
    useOnboardApiV1SourceHealthcheckCreate,
} from '../../../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../api/api'
import { useScheduleApiV1DescribeTriggerUpdate } from '../../../../../../../api/schedule.gen'
import { RenderObject } from '../../../../../../../components/RenderObject'

interface IAccInfo {
    data: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    open: boolean
    type: string
    onClose: () => void
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

export default function AccountInfo({ data, open, type, onClose }: IAccInfo) {
    const { response: credential } = useOnboardApiV1CredentialDetail(
        data?.credentialID || '',
        {},
        !!data && open
    )
    console.log(data)

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
                            {data?.lifecycleState}
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
                    {renderMetadata(type, data)}
                </Flex>
                <Flex justifyContent="end" className="mt-6 mb-12">
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
