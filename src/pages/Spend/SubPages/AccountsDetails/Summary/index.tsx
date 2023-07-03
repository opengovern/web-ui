import React, { useEffect, useState } from 'react'
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

type IProps = {
    accounts: any
}

export default function Summary({ accounts }: IProps) {
    const [topAccounts, setTopAccounts] = useState<any>([])
    useEffect(() => {
        setTopAccounts(accounts || [])
    }, [accounts])
    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()
    return (
        <Flex className="mt-10 h-[34vh]">
            <div className="flex flex-col justify-between h-full mr-10 w-[20vw]">
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
                <Grid numItemsMd={1} className="gap-x-10 mt-5">
                    <div>
                        <Title>Resource Count</Title>
                        <List className="mt-2">
                            {topAccounts.map((item: any) => (
                                <ListItem key={item.providerConnectionName}>
                                    <Text>{item.providerConnectionName}</Text>
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
