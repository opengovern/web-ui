import React, { useEffect, useState } from 'react'
import {
    Bold,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Text,
    Title,
} from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../api/api'
import { useOnboardApiV1CatalogMetricsList } from '../../../../../api/onboard.gen'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import Spinner from '../../../../../components/Spinner'
import SummaryCard from '../../../../../components/Cards/SummaryCard'

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
            <Flex flexDirection="col" className="my-3 gap-y-3">
                <Title>
                    {connection?.providerConnectionName ||
                        connection.providerConnectionID ||
                        connection.id ||
                        ''}
                </Title>
                <Grid
                    numItemsMd={2}
                    numItemsLg={3}
                    className="gap-3 mt-6 mb-10"
                >
                    <SummaryCard
                        title="Resource Count"
                        metric={String(
                            numericDisplay(topAccounts?.totalResourceCount)
                        )}
                        url="accounts-detail"
                        loading={topAccountLoading}
                    />
                    <SummaryCard
                        title="Total Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.totalConnections)
                        )}
                        url="accounts-detail"
                        loading={isLoading}
                    />
                    <SummaryCard
                        title="Total Unhealthy Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.unhealthyConnections)
                        )}
                        url="accounts-detail"
                        loading={isLoading}
                    />
                </Grid>
            </Flex>
            <Grid numItems={3} numItemsLg={5} className="gap-3">
                <Col numColSpan={3}>
                    <Card>
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
                </Col>
                <Col numColSpan={3} numColSpanLg={3}>
                    <Card className="w-[40vw]">
                        <Title>Meta Data</Title>
                        {metaData ? (
                            <RenderObject obj={metaData} />
                        ) : (
                            <Spinner />
                        )}
                    </Card>
                </Col>
            </Grid>
        </main>
    )
}
