import { useEffect, useState } from 'react'
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
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../api/api'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectionsSummaryList,
} from '../../../../../api/onboard.gen'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import Spinner from '../../../../../components/Spinner'
import SummaryCard from '../../../../../components/Cards/SummaryCard'
import { filterAtom, timeAtom } from '../../../../../store'
import { RenderObject } from '../../../../../components/RenderObject'

export default function SingleAccount() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: topAccounts, isLoading: topAccountLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
            pageSize: 1,
            pageNumber: 1,
            sortBy: 'resource_count',
        })

    if (
        metricsLoading ||
        topAccountLoading ||
        topAccounts?.connections?.length === 0
    ) {
        return (
            <main>
                <Spinner className="py-80" />
            </main>
        )
    }

    const connection = topAccounts?.connections?.at(0)

    return (
        <main>
            <Flex
                flexDirection="col"
                alignItems="start"
                className="w-full my-3 gap-y-3"
            >
                <Title>
                    {connection?.providerConnectionName ||
                        connection?.providerConnectionID ||
                        connection?.id ||
                        ''}
                </Title>
                <Grid
                    numItemsMd={2}
                    numItemsLg={3}
                    className="gap-3 mt-6 mb-10 w-full"
                >
                    <SummaryCard
                        title="Resource Count"
                        metric={String(
                            numericDisplay(topAccounts?.totalResourceCount)
                        )}
                        loading={topAccountLoading}
                    />
                    <SummaryCard
                        title="Total Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.totalConnections)
                        )}
                        loading={metricsLoading}
                    />
                    <SummaryCard
                        title="Total Unhealthy Accounts"
                        metric={String(
                            numericDisplay(topMetrics?.unhealthyConnections)
                        )}
                        loading={metricsLoading}
                    />
                </Grid>

                <Card className="w-full">
                    <Title>Main Data</Title>
                    <List className="mt-2">
                        <ListItem>
                            <Text>Account ID</Text>
                            <Text>
                                <Bold>{connection?.id}</Bold>
                            </Text>
                        </ListItem>
                        <ListItem>
                            <Text>Onboard Date</Text>
                            <Text>
                                <Bold>
                                    {connection?.onboardDate &&
                                        new Date(
                                            Date.parse(connection?.onboardDate)
                                        ).toLocaleDateString()}
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
                                        ).toLocaleDateString()}
                                </Bold>
                            </Text>
                        </ListItem>
                    </List>
                </Card>
                <Card className="w-full">
                    <Title>Meta Data</Title>
                    {connection?.metadata ? (
                        <RenderObject obj={connection.metadata} />
                    ) : (
                        <Spinner />
                    )}
                </Card>
            </Flex>
        </main>
    )
}
