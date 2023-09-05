import {
    BadgeDelta,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectionsSummaryList,
} from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../../utilities/deltaType'
import { filterAtom, timeAtom } from '../../../../../store'
import { getConnectorIcon } from '../../../../../components/Cards/ConnectorCard'

export default function Summary() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: topAccounts, isLoading: topAccountLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections?.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'resource_count',
            needCost: false,
        })

    return (
        <Flex className="mt-12">
            <Grid numItems={3} className="w-full gap-4">
                <Col numColSpan={1}>
                    <Flex flexDirection="col" className="gap-y-4 h-full">
                        <Card className="gap-y-2 h-1/2">
                            <Flex>
                                <Text className="font-medium">
                                    Total Accounts
                                </Text>
                                {!topAccountLoading && (
                                    <BadgeDelta
                                        deltaType={badgeTypeByDelta(
                                            topAccounts?.totalOldResourceCount,
                                            topAccounts?.connectionCount
                                        )}
                                    >
                                        {percentageByChange(
                                            topAccounts?.totalOldResourceCount,
                                            topAccounts?.connectionCount
                                        )}
                                        %
                                    </BadgeDelta>
                                )}
                            </Flex>
                            {topAccountLoading ? (
                                <Spinner className="my-6" />
                            ) : (
                                <Flex
                                    justifyContent="start"
                                    alignItems="baseline"
                                    className="truncate space-x-1"
                                >
                                    <Metric>
                                        {topAccounts?.connectionCount}
                                    </Metric>
                                    <Text className="truncate">
                                        from{' '}
                                        {topAccounts?.totalOldResourceCount}
                                    </Text>
                                </Flex>
                            )}
                        </Card>
                        <Card className="gap-y-2 h-1/2">
                            <Text className="font-medium">
                                Total Unhealthy Accounts
                            </Text>
                            <Metric className="mt-1">
                                {metricsLoading ? (
                                    <Spinner className="my-6" />
                                ) : (
                                    numericDisplay(
                                        topMetrics?.unhealthyConnections
                                    )
                                )}
                            </Metric>
                        </Card>
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <Card className="h-full">
                        <Title>Top Accounts</Title>
                        {topAccountLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner />
                            </div>
                        ) : (
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
                                    {topAccounts?.connections?.map((item) => (
                                        <ListItem className="p-1">
                                            <Flex justifyContent="start">
                                                {getConnectorIcon(
                                                    item?.connector
                                                )}
                                                <Text className="ml-4">
                                                    {
                                                        item.providerConnectionName
                                                    }
                                                </Text>
                                            </Flex>
                                            <Flex className="w-1/4">
                                                <Subtitle>
                                                    {numericDisplay(
                                                        item.resourceCount
                                                    )}
                                                </Subtitle>
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
