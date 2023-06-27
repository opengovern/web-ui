import React from 'react'
import {
    Card,
    Title,
    Bold,
    Text,
    List,
    ListItem,
    Flex,
    Grid,
    Metric,
} from '@tremor/react'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useOnboardApiV1CatalogMetricsList } from '../../../../../api/onboard.gen'

const MockData = {
    TopTotalResCount: [
        {
            name: 'gbs-pipeline-test15',
            resourceCount: 43445,
        },
        {
            name: 'TAA-BO-CPM_GEAC-Z-DevTest-Labs',
            resourceCount: 35545,
        },
        {
            name: 'gbs-pipeline-test17',
            resourceCount: 34552,
        },
        {
            name: 'Gurutestsub',
            resourceCount: 30545,
        },
        {
            name: 'testOleskandrk2',
            resourceCount: 20545,
        },
    ],
    TopResCount: [
        {
            name: 'gbs-pipeline-test15',
            resourceCount: 43445,
        },
        {
            name: 'TAA-BO-CPM_GEAC-Z-DevTest-Labs',
            resourceCount: 35545,
        },
        {
            name: 'gbs-pipeline-test17',
            resourceCount: 34552,
        },
        {
            name: 'Gurutestsub',
            resourceCount: 30545,
        },
        {
            name: 'testOleskandrk2',
            resourceCount: 20545,
        },
    ],
}

export default function Summary() {
    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()
    return (
        <Flex className="mt-10 h-[34vh]">
            <div className="flex flex-col justify-between h-full mr-10 w-[14vw]">
                <Card className="flex flex-col h-32 gap-y-2">
                    <Text>Total Accounts</Text>
                    <Metric>
                        {numericDisplay(topMetrics?.totalConnections)}
                    </Metric>
                </Card>
                <Card className="flex flex-col h-32 gap-y-2">
                    <Text>Total Unhealthy Accounts</Text>
                    <Metric>
                        {numericDisplay(topMetrics?.unhealthyConnections)}
                    </Metric>
                </Card>
            </div>
            <Card>
                <Title>Top Accounts</Title>
                <Grid numItemsMd={2} className="gap-x-40 mt-5">
                    <div>
                        <Title>Total Resource Count</Title>
                        <List className="mt-2">
                            {MockData.TopTotalResCount.map((item) => (
                                <ListItem key={item.name}>
                                    <Text>{item.name}</Text>
                                    <Text>
                                        <Bold>
                                            {numericDisplay(item.resourceCount)}
                                        </Bold>{' '}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                    <div>
                        <Title>Resource Count</Title>
                        <List className="mt-2">
                            {MockData.TopResCount.map((item) => (
                                <ListItem key={item.name}>
                                    <Text>{item.name}</Text>
                                    <Text>
                                        <Bold>
                                            {numericDisplay(item.resourceCount)}
                                        </Bold>{' '}
                                    </Text>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Grid>
            </Card>
        </Flex>
    )
}
