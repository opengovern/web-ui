import React from 'react'
import {
    Card,
    Title,
    Bold,
    Text,
    List,
    ListItem,
    Flex,
    Tab,
    TabList,
    TabGroup,
    Grid,
    Subtitle,
    Metric,
} from '@tremor/react'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

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
    totalAccountCount: 920,
    totalUnhealthyCount: 10,
}

export default function Summary() {
    return (
        <Flex className="mt-10">
            <div className="flex flex-col justify-between h-[33vh] mr-10 w-[14vw]">
                <Card className="flex flex-col h-32 gap-y-2">
                    <Text>Total Accounts</Text>
                    <Metric>
                        {numericDisplay(MockData.totalAccountCount)}
                    </Metric>
                </Card>
                <Card className="flex flex-col h-32 gap-y-2">
                    <Text>Total Unhealthy Accounts</Text>
                    <Metric>
                        {numericDisplay(MockData.totalUnhealthyCount)}
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
