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
    BadgeDelta,
    Col,
    Badge,
} from '@tremor/react'
import { numericDisplay } from '../../../../../../utilities/numericDisplay'
import { useOnboardApiV1CatalogMetricsList } from '../../../../../../api/onboard.gen'
import Spinner from '../../../../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../api/api'
import { ReactComponent as AzureIcon } from '../../../../../../assets/icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../../../assets/icons/elements-supplemental-provider-logo-aws-original.svg'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../../../utilities/deltaType'

type IProps = {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    loading: boolean
}

export default function Summary({ accounts, loading }: IProps) {
    const [topAccounts, setTopAccounts] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    >([])
    useEffect(() => {
        setTopAccounts(accounts || [])
    }, [accounts])
    const { response: topMetrics, isLoading } =
        useOnboardApiV1CatalogMetricsList()
    return (
        <Flex className="mt-10">
            <Grid numItems={3} className="w-full gap-3">
                <Col numColSpan={1}>
                    <Flex flexDirection="col" className="gap-y-3 h-full">
                        <Card className="flex flex-col gap-y-2  justify-center h-1/2">
                            <Flex alignItems="start">
                                <Text className="truncate">Top Accounts</Text>
                                <BadgeDelta
                                    deltaType={badgeTypeByDelta(
                                        topMetrics?.totalConnections,
                                        topMetrics?.totalConnections
                                    )}
                                >
                                    {percentageByChange(
                                        topMetrics?.totalConnections,
                                        topMetrics?.totalConnections
                                    )}{' '}
                                    %
                                </BadgeDelta>
                            </Flex>
                            <Flex
                                justifyContent="start"
                                alignItems="baseline"
                                className="truncate space-x-3"
                            >
                                <Metric>{topMetrics?.totalConnections}</Metric>
                                <Text className="truncate">
                                    from {topMetrics?.totalConnections}
                                </Text>
                            </Flex>
                        </Card>
                        <Card className="flex flex-col gap-y-2  justify-center h-1/2">
                            <Text className="font-medium">
                                Total Unhealthy Accounts
                            </Text>
                            <Metric>
                                {numericDisplay(
                                    topMetrics?.unhealthyConnections
                                )}
                            </Metric>
                        </Card>
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <Card className="h-full">
                        <Title>Top Accounts</Title>
                        {loading && (
                            <div className="flex justify-center items-center h-full">
                                <Spinner />
                            </div>
                        )}
                        {!loading && (
                            <div>
                                <List className="mt-2">
                                    <ListItem>
                                        <Text className="font-semibold">
                                            Connection Name
                                        </Text>
                                        <Text className="font-semibold">
                                            Resource Count
                                        </Text>
                                    </ListItem>
                                    {topAccounts.map((item) => (
                                        <ListItem className="p-1">
                                            <Flex justifyContent="start">
                                                {item?.connector === 'Azure' ? (
                                                    <AzureIcon />
                                                ) : (
                                                    <AWSIcon />
                                                )}
                                                <Text className="ml-1">
                                                    {
                                                        item.providerConnectionName
                                                    }
                                                </Text>
                                            </Flex>
                                            <Flex justifyContent="end">
                                                <Bold>
                                                    {numericDisplay(
                                                        item.resourceCount
                                                    )}
                                                </Bold>{' '}
                                                <BadgeDelta
                                                    size="xs"
                                                    deltaType={badgeTypeByDelta(
                                                        item.oldResourceCount,
                                                        item.resourceCount
                                                    )}
                                                    className="text-xs ml-2"
                                                >
                                                    {`${percentageByChange(
                                                        item.oldResourceCount,
                                                        item.resourceCount
                                                    )}%`}
                                                </BadgeDelta>
                                            </Flex>
                                        </ListItem>
                                    ))}
                                </List>
                            </div>
                        )}
                    </Card>
                </Col>
            </Grid>
        </Flex>
    )
}
