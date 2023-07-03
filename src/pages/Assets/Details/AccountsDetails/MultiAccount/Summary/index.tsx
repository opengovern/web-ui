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
import { numericDisplay } from '../../../../../../utilities/numericDisplay'
import { useOnboardApiV1CatalogMetricsList } from '../../../../../../api/onboard.gen'
import Spinner from '../../../../../../components/Spinner'

type IProps = {
    accounts: any
    loading: boolean
}

export default function Summary({ accounts, loading }: IProps) {
    const [topAccounts, setTopAccounts] = useState<any>([])
    useEffect(() => {
        setTopAccounts(accounts || [])
    }, [accounts])
    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()
    return (
        <Flex className="mt-10 h-[34vh]">
            <div className="flex flex-col justify-start h-[33vh] gap-y-4 mr-4 w-[33vw]">
                <Card className="flex flex-col gap-y-2 h-[16vh] justify-center">
                    <Text className="font-medium">Total Accounts</Text>
                    <Metric>
                        {numericDisplay(topMetrics?.totalConnections)}
                    </Metric>
                </Card>
                <Card className="flex flex-col gap-y-2 h-[16vh] justify-center">
                    <Text className="font-medium">
                        Total Unhealthy Accounts
                    </Text>
                    <Metric>
                        {numericDisplay(topMetrics?.unhealthyConnections)}
                    </Metric>
                </Card>
            </div>
            <Card className="h-[33vh]">
                <Title>Top Accounts</Title>
                <Grid numItemsMd={1} className="gap-x-10 mt-5">
                    {loading && (
                        <div className="flex justify-center items-center h-[10vh]">
                            <Spinner />
                        </div>
                    )}
                    {!loading && (
                        <div>
                            <Title>Resource Count</Title>
                            <List className="mt-2">
                                {topAccounts.map(
                                    (item: {
                                        providerConnectionName:
                                            | boolean
                                            | React.Key
                                            | React.ReactElement<
                                                  any,
                                                  | string
                                                  | React.JSXElementConstructor<any>
                                              >
                                            | Iterable<React.ReactNode>
                                            | null
                                            | undefined
                                        resourceCount:
                                            | string
                                            | number
                                            | undefined
                                    }) => (
                                        <ListItem>
                                            <Text>
                                                {item.providerConnectionName}
                                            </Text>
                                            <Text>
                                                <Bold>
                                                    {numericDisplay(
                                                        item.resourceCount
                                                    )}
                                                </Bold>{' '}
                                            </Text>
                                        </ListItem>
                                    )
                                )}
                            </List>
                        </div>
                    )}
                </Grid>
            </Card>
        </Flex>
    )
}
