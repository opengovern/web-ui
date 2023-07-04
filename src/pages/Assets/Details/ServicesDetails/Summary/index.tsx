import {
    Bold,
    Card,
    Flex,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import React, { useEffect, useState } from 'react'
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

interface Data {
    name: string
    value: number
}

const item = {
    total: {
        title: 'Services',
        value: 190,
    },
    TopXServices: [
        {
            title: 'Services',
            value: 190,
        },
        {
            title: 'Services',
            value: 190,
        },
        {
            title: 'Services',
            value: 190,
        },
        {
            title: 'Services',
            value: 190,
        },
        {
            title: 'Services',
            value: 190,
        },
    ],
    TopXFastest: [
        {
            title: 'Services',
            value: 190,
            change: 60,
            type: 'moderateIncrease',
        },
        {
            title: 'Services',
            value: 190,
            change: 60,
            type: 'moderateIncrease',
        },
        {
            title: 'Services',
            value: 190,
            change: 60,
            type: 'moderateIncrease',
        },
        {
            title: 'Services',
            value: 190,
            change: 60,
            type: 'moderateIncrease',
        },
        {
            title: 'Services',
            value: 190,
            change: 60,
            type: 'moderateIncrease',
        },
    ],
}

type IProps = {
    TopServices: any
    TopFastestServices: any
    TotalServices: any
}
export default function Summary({
    TopServices,
    TopFastestServices,
    TotalServices,
}: IProps) {
    const [topServices, setTopServices] = useState([])
    const [topFastest, setTopFastest] = useState([])
    useEffect(() => {
        setTopServices(TopServices || [])
        setTopFastest(TopFastestServices || [])
    }, [TopServices, TopFastestServices, TotalServices])
    return (
        <div className="gap-y-10 mt-[24px]">
            {/* <Card key="Total Services" className="h-fit"> */}
            {/*    <Flex justifyContent="start" className="space-x-4"> */}
            {/*        <Title className="truncate">Total Services</Title> */}
            {/*    </Flex> */}
            {/*    <Metric className="mt-4 mb-3"> */}
            {/*        {numericDisplay(TotalServices)} */}
            {/*    </Metric> */}
            {/* </Card> */}
            <div className="flex flex-row justify-between">
                <Metric>Services</Metric>
                <div className="flex flex-row items-baseline">
                    <Metric className="mr-2">
                        {numericDisplay(TotalServices)}
                    </Metric>
                    <Text>Total Services</Text>
                </div>
            </div>
            <div className="flex flex-row gap-x-10 mt-4">
                <Card key="TopXServices" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">Popular Services</Title>
                    </Flex>
                    <List className="mt-2 mb-2">
                        {topServices.map((thing: any) => (
                            <ListItem key={thing.service_label}>
                                <Text>{thing.service_label}</Text>
                                <Text>
                                    <Bold>
                                        {numericDisplay(thing.resource_count)}
                                    </Bold>{' '}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </Card>
                <Card key="TopXFastest" className="h-fit">
                    <Flex justifyContent="start" className="space-x-4">
                        <Title className="truncate">
                            Top Fast-Growing Services
                        </Title>
                    </Flex>
                    <List className="mt-2 mb-2">
                        {topFastest.map((thing: any) => (
                            <ListItem key={thing.service_label}>
                                <Text>{thing.service_label}</Text>
                                <Text>
                                    <Bold>
                                        {numericDisplay(thing.resource_count)}
                                    </Bold>{' '}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                </Card>
            </div>
        </div>
    )
}
