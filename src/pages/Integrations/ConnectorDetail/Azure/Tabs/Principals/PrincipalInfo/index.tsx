import {
    Badge,
    Button,
    Divider,
    Flex,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import dayjs from 'dayjs'
import DrawerPanel from '../../../../../../../components/DrawerPanel'

interface IPriInfo {
    data: any
    open: boolean
    onClose: any
}

export default function PrincipalInfo({ data, open, onClose }: IPriInfo) {
    // const { response: credential } = useOnboardApiV1CredentialDetail(
    //     data?.id,
    //     {},
    //     !!data && open
    // )
    const [id, setId] = useState('')
    const [eid, seteId] = useState(false)
    const [value, setValue] = useState('')
    const [evalue, seteValue] = useState(false)
    // console.log(credential)
    return (
        <DrawerPanel
            title="Service Principal"
            open={open}
            onClose={() => onClose()}
        >
            <Flex flexDirection="col" className="h-full">
                <Flex flexDirection="col" alignItems="start">
                    <Title>SPN info</Title>
                    <Divider />
                    <Flex>
                        <Text>Name</Text>
                        <Text className="text-black">{data?.name}</Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Application ID</Text>
                        <Text className="text-black">
                            {data?.metadata.organization_master_account_email}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Object ID</Text>
                        <Text className="text-black">
                            {data?.metadata.object_id}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Directory ID</Text>
                        <Text className="text-black">
                            {data?.metadata.organization_master_account_email}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>State</Text>
                        <Badge
                            color={
                                data?.healthStatus === 'healthy'
                                    ? 'green'
                                    : 'rose'
                            }
                        >
                            {data?.healthStatus}
                        </Badge>
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Last health check</Text>
                        <Text className="text-black">
                            {dayjs(data?.lastHealthCheckTime).format(
                                'YYYY-MM-DD'
                            )}
                        </Text>
                    </Flex>
                    <Divider />
                    <Flex
                        flexDirection={eid ? 'col' : 'row'}
                        alignItems={eid ? 'start' : 'center'}
                    >
                        <Text className="whitespace-nowrap">Secret ID</Text>
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
                                <Text className="text-black">
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore */}
                                    {data?.metadata.secret_id}
                                </Text>
                                <Button
                                    variant="light"
                                    className="ml-3"
                                    onClick={() => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setId(data?.metadata.secret_id)
                                        seteId(true)
                                    }}
                                >
                                    Edit
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Divider />
                    <Flex
                        flexDirection={evalue ? 'col' : 'row'}
                        alignItems={evalue ? 'start' : 'center'}
                    >
                        <Text className="whitespace-nowrap">Secret value</Text>
                        {evalue ? (
                            <>
                                <TextInput
                                    className="w-full my-3"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <Flex justifyContent="end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => seteValue(false)}
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
                                    onClick={() => seteValue(true)}
                                >
                                    Edit
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                    <Divider />
                    <Flex>
                        <Text>Number of subscriptions</Text>
                        <Text className="text-black">
                            {data?.total_connections}
                        </Text>
                    </Flex>
                </Flex>
                <Flex justifyContent="end" className="my-6">
                    <Button variant="secondary">Delete</Button>
                    <Button className="ml-3">Discover New Subscriptions</Button>
                </Flex>
            </Flex>
        </DrawerPanel>
    )
}
