import React, { useEffect, useState } from 'react'
import { Bold, Card, List, ListItem, Metric, Text, Title } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../api/api'
import { useOnboardApiV1CatalogMetricsList } from '../../../../../api/onboard.gen'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import Spinner from '../../../../../components/Spinner'

interface ISingleAccount {
    topAccounts: any
    topAccountLoading: boolean
}

const RenderObject = ({ obj }: any) => {
    return (
        <List>
            {Object.keys(obj).map((key) => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    return (
                        <>
                            {key !== '0' ? (
                                <Text className="font-bold mt-10 mb-2">
                                    {key}
                                </Text>
                            ) : null}
                            <RenderObject obj={obj[key]} />
                        </>
                    )
                }
                return (
                    <ListItem key={key} className="break-words">
                        <Text>{key}</Text>
                        <Bold>{String(obj[key])}</Bold>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default function SingleAccount({
    topAccounts,
    topAccountLoading,
}: ISingleAccount) {
    const [connection, setConnection] =
        useState<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>({})
    const [metaData, setMetaData] = useState<any>()

    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()

    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        topAccounts?.connections?.map((res: any) => {
            setConnection(res)
            setMetaData(res.metadata)
        })
    }, [topAccounts])

    return (
        <main>
            <div className="mt-[24px] mb-[24px] flex flex-col gap-y-[24px]">
                <Title>
                    {connection?.providerConnectionName ||
                        connection.providerConnectionID ||
                        connection.id ||
                        ''}
                </Title>
                <div className="flex flex-row gap-x-[24px]">
                    <Card>
                        <Text className="font-medium">Resource Count</Text>
                        {!topAccountLoading ? (
                            <Metric>
                                {numericDisplay(
                                    topAccounts?.totalResourceCount
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
