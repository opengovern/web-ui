import React, { useEffect, useState } from 'react'
import { Bold, Card, List, ListItem, Metric, Text, Title } from '@tremor/react'
import dayjs from 'dayjs'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectionsSummaryList,
} from '../../../../api/onboard.gen'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Spinner from '../../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../api/api'

type IProps = {
    selectedConnections: any
    timeRange: any
}
export default function SingleAccountDetails({
    selectedConnections,
    timeRange,
}: IProps) {
    const [connection, setConnection] =
        useState<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>({})
    const [metaData, setMetaData] = useState<any>()
    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: TopAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            startTime: timeRange[0],
            endTime: timeRange[1],
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'resource_count',
        })
    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        TopAccounts?.connections?.map((res) => {
            setConnection(res)
            setMetaData(res.metadata)
        })
    }, [TopAccounts])

    // eslint-disable-next-line react/no-unstable-nested-components
    function RenderObject({ obj }: any) {
        return (
            <List>
                {Object.keys(obj).map((key) => {
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        return (
                            <div>
                                {key !== '0' ? (
                                    <Text className="font-bold mt-10 mb-2">
                                        {key}
                                    </Text>
                                ) : null}
                                <RenderObject obj={obj[key]} />
                            </div>
                        )
                    }
                    return (
                        <ListItem key={key} className="break-words">
                            <Text>{key}</Text>
                            <div>
                                <Bold>{String(obj[key])}</Bold>
                            </div>
                        </ListItem>
                    )
                })}
            </List>
        )
    }

    return (
        <main>
            <div className="mt-[24px] mb-[24px] flex flex-col gap-y-[24px]">
                <Title>{connection?.credentialName}</Title>
                <div className="flex flex-row gap-x-[24px]">
                    <Card>
                        <Text className="font-medium">Resource Count</Text>
                        {!isLoadingTopAccount ? (
                            <Metric>
                                {numericDisplay(
                                    TopAccounts?.totalResourceCount
                                )}
                            </Metric>
                        ) : (
                            <Spinner />
                        )}
                    </Card>
                    <Card>
                        <Text className="font-medium">Total Accounts</Text>
                        {!isLoading ? (
                            <Metric>
                                {numericDisplay(topMetrics?.totalConnections)}
                            </Metric>
                        ) : (
                            <Spinner />
                        )}
                    </Card>
                    <Card>
                        <Text className="font-medium">
                            Total Unhealthy Accounts
                        </Text>
                        {!isLoading ? (
                            <Metric>
                                {numericDisplay(
                                    topMetrics?.unhealthyConnections
                                )}
                            </Metric>
                        ) : (
                            <Spinner />
                        )}
                    </Card>
                </div>
                <div className="flex -flex-row gap-x-[24px]">
                    <Card className="w-[50vw]">
                        <Title>Main Data</Title>
                        <List className="mt-2">
                            <ListItem>
                                <Text>Account ID</Text>
                                <Text>
                                    <Bold>{connection.id}</Bold>
                                </Text>
                            </ListItem>
                            <ListItem>
                                <Text>Onboard Date</Text>
                                <Text>
                                    <Bold>
                                        {connection?.onboardDate &&
                                            new Date(
                                                Date.parse(
                                                    connection?.onboardDate
                                                )
                                            ).toLocaleDateString('en-US')}
                                    </Bold>
                                </Text>
                            </ListItem>
                            <ListItem>
                                <Text>Last Inventory</Text>
                                <Text>
                                    <Bold>
                                        {connection?.lastInventory &&
                                            new Date(
                                                Date.parse(
                                                    connection?.lastInventory
                                                )
                                            ).toLocaleDateString('en-US')}
                                    </Bold>
                                </Text>
                            </ListItem>
                        </List>
                    </Card>
                    <Card className="w-[40vw]">
                        <Title>Meta Data</Title>
                        {metaData ? (
                            <RenderObject obj={metaData} />
                        ) : (
                            <Spinner />
                        )}
                    </Card>
                </div>
            </div>
        </main>
    )
}
