import { Badge, Divider, Flex, Text, Title } from '@tremor/react'
import dayjs from 'dayjs'

interface IOrgInfo {
    data: any
}

export default function OrgInfo({ data }: IOrgInfo) {
    console.log(data)
    return (
        <Flex flexDirection="col" alignItems="start">
            <Title>Organization info</Title>
            <Divider />
            <Flex>
                <Text>Name</Text>
                <Text className="text-black">{data?.name}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>Email</Text>
                <Text className="text-black">{data?.email}</Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>Onboard date</Text>
                <Text className="text-black">
                    {dayjs(data?.onboardDate).format('YYYY-MM-DD')}
                </Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>State</Text>
                <Badge
                    color={data?.healthStatus === 'healthy' ? 'green' : 'rose'}
                >
                    {data?.healthStatus}
                </Badge>
            </Flex>
            <Divider />
            <Flex>
                <Text>Last health check</Text>
                <Text className="text-black">
                    {dayjs(data?.lastHealthCheckTime).format('YYYY-MM-DD')}
                </Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>Number of accounts</Text>
                <Text className="text-black">{data?.total_connections}</Text>
            </Flex>
            <Divider />
            <Title className="mt-6">AWS account info</Title>
            <Divider />
            <Flex>
                <Text>AWS account name</Text>
                <Text className="text-black">
                    {data?.metadata.iam_user_name}
                </Text>
            </Flex>
            <Divider />
            <Flex>
                <Text>AWS account ID</Text>
                <Text className="text-black">{data?.metadata.account_id}</Text>
            </Flex>
        </Flex>
    )
}
