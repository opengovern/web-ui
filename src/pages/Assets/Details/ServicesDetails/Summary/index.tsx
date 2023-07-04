import {
    Card,
    Metric,
    Text,
    Flex,
    Title,
    Bold,
    List,
    ListItem,
} from '@tremor/react'
import React, { useEffect, useState } from 'react'
import { numericDisplay } from '../../../../../utilities/numericDisplay'

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
                        <Title className="truncate">Top Services</Title>
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
                        <Title className="truncate">Top Growing Services</Title>
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
