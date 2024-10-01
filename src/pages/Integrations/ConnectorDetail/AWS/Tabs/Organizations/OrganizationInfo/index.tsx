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
import { useOnboardApiV1CredentialDetail } from '../../../../../../../api/onboard.gen'
import DrawerPanel from '../../../../../../../components/DrawerPanel'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential,
} from '../../../../../../../api/api'
import { dateDisplay } from '../../../../../../../utilities/dateDisplay'
import {
    useIntegrationApiV1CredentialDelete,
    useIntegrationApiV1CredentialsAwsAutoonboardCreate,
} from '../../../../../../../api/integration.gen'

interface IOrgInfo {
    data:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityCredential
        | undefined
    open: boolean
    onClose: () => void
    isDemo: boolean
}

export default function OrganizationInfo({
    data,
    open,
    onClose,
    isDemo,
}: IOrgInfo) {
    const { response: credential } = useOnboardApiV1CredentialDetail(
        data?.id || '',
        {},
        !!data && open
    )

    const [key, setKey] = useState('')
    const [ekey, seteKey] = useState(false)
    const [secret, setSecret] = useState('')
    const [esecret, seteSecret] = useState(false)
    const [role, setRole] = useState('')
    const [erole, seteRole] = useState(false)
    const [id, setId] = useState('')
    const [eid, seteId] = useState(false)

    const {
        isExecuted: isDeleteExecuted,
        isLoading: isDeleteLoading,
        sendNow: deleteNow,
    } = useIntegrationApiV1CredentialDelete(data?.id || '', {}, false)

    const {
        isExecuted: isDiscoverExecuted,
        isLoading: isDiscoverLoading,
        sendNow: discoverNow,
    } = useIntegrationApiV1CredentialsAwsAutoonboardCreate(
        data?.id || '',
        {},
        false
    )

    // useEffect(() => {
    //     if (isDeleteExecuted && !isDeleteLoading) {
    //         onClose()
    //     }
    // }, [isDeleteLoading])

    useEffect(() => {
        if (isDiscoverExecuted && !isDiscoverLoading) {
            onClose()
        }
    }, [isDiscoverLoading])

    return (
        <DrawerPanel title="Organization" open={open} onClose={() => onClose()}>
            <Flex flexDirection="col" alignItems="start">
                <Title>Organization info</Title>
                <Divider />
                <Flex>
                    <Text>Name</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {data?.name}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>Email</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {data?.metadata?.organization_master_account_email}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>Onboard date</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {dateDisplay(data?.onboardDate)}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>State</Text>
                    <Badge
                        color={
                            credential?.healthStatus === 'healthy'
                                ? 'emerald'
                                : 'rose'
                        }
                    >
                        {credential?.healthStatus}
                    </Badge>
                </Flex>
                <Divider />
                <Flex>
                    <Text>Last health check</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {dateDisplay(credential?.lastHealthCheckTime)}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>Number of accounts</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {data?.total_connections}
                    </Text>
                </Flex>
                <Title className="mt-12">AWS account info</Title>
                <Divider />
                <Flex>
                    <Text>AWS account name</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {data?.metadata?.iam_user_name}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>AWS account ID</Text>
                    <Text
                        className={isDemo ? 'blur-sm text-black' : 'text-black'}
                    >
                        {data?.metadata?.account_id}
                    </Text>
                </Flex>
                <Divider />
                <Flex>
                    <Text>AWS account health</Text>
                    <Badge
                        color={
                            data?.healthStatus === 'healthy'
                                ? 'emerald'
                                : 'rose'
                        }
                    >
                        {data?.healthStatus}
                    </Badge>
                </Flex>
                <Divider />
                <Flex
                    flexDirection={ekey ? 'col' : 'row'}
                    alignItems={ekey ? 'start' : 'center'}
                >
                    <Text className="whitespace-nowrap">AWS account key</Text>
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
                            <Text
                                className={
                                    isDemo ? 'blur-sm text-black' : 'text-black'
                                }
                            >
                                {credential?.config.accessKey}
                            </Text>
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
                            <Text
                                className={
                                    isDemo ? 'blur-sm text-black' : 'text-black'
                                }
                            >
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
                <Title className="mt-12">Roles</Title>
                <Divider />
                <Flex
                    flexDirection={erole ? 'col' : 'row'}
                    alignItems={erole ? 'start' : 'center'}
                >
                    <Text className="whitespace-nowrap">
                        Role name to assume
                    </Text>
                    {erole ? (
                        <>
                            <TextInput
                                className="w-full my-3"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <Flex justifyContent="end">
                                <Button
                                    variant="secondary"
                                    onClick={() => seteRole(false)}
                                >
                                    Cancel
                                </Button>
                                <Button className="ml-3">Save</Button>
                            </Flex>
                        </>
                    ) : (
                        <Flex justifyContent="end">
                            <Text
                                className={
                                    isDemo
                                        ? 'blur-sm text-black text-end'
                                        : 'text-black text-end'
                                }
                            >
                                {credential?.config.assumeRoleName}
                            </Text>
                            <Button
                                variant="light"
                                className="ml-3"
                                onClick={() => {
                                    setRole(credential?.config.assumeRoleName)
                                    seteRole(true)
                                }}
                            >
                                Edit
                            </Button>
                        </Flex>
                    )}
                </Flex>
                <Divider />
                <Flex
                    flexDirection={eid ? 'col' : 'row'}
                    alignItems={eid ? 'start' : 'center'}
                    className="mb-6"
                >
                    <Text className="whitespace-nowrap">External ID</Text>
                    {eid ? (
                        <>
                            <TextInput
                                className="w-full my-3"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                            />
                            <Flex justifyContent="end">
                                <Button
                                    variant="secondary"
                                    onClick={() => seteId(false)}
                                >
                                    Cancel
                                </Button>
                                <Button className="ml-3">Save</Button>
                            </Flex>
                        </>
                    ) : (
                        <Flex justifyContent="end">
                            <Text
                                className={
                                    isDemo ? 'blur-sm text-black' : 'text-black'
                                }
                            >
                                {credential?.config.externalId}
                            </Text>
                            <Button
                                variant="light"
                                className="ml-3"
                                onClick={() => {
                                    setId(credential?.config.externalId)
                                    seteId(true)
                                }}
                            >
                                Edit
                            </Button>
                        </Flex>
                    )}
                </Flex>
                <Flex justifyContent="end" className="my-6">
                    <Button
                        variant="secondary"
                        color="rose"
                        // loading={isDeleteExecuted && isDeleteLoading}
                        disabled={isDiscoverExecuted && isDiscoverLoading}
                        // onClick={deleteNow}
                    >
                        Delete
                    </Button>

                    <Button
                        className="ml-3"
                        loading={isDiscoverExecuted && isDiscoverLoading}
                        // disabled={isDeleteExecuted && isDeleteLoading}
                        onClick={discoverNow}
                    >
                        Discover New Accounts
                    </Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
