import {
    BadgeDelta,
    Bold,
    Card,
    Col,
    Flex,
    Grid,
    List,
    ListItem,
    Metric,
    Text,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { numericDisplay } from '../../../../../../utilities/numericDisplay'
import {
    useOnboardApiV1CatalogMetricsList,
    useOnboardApiV1ConnectionsSummaryList,
} from '../../../../../../api/onboard.gen'
import Spinner from '../../../../../../components/Spinner'
import { ReactComponent as AzureIcon } from '../../../../../../icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../../../icons/elements-supplemental-provider-logo-aws-original.svg'
import {
    badgeTypeByDelta,
    percentageByChange,
} from '../../../../../../utilities/deltaType'
import { filterAtom, timeAtom } from '../../../../../../store'

export default function Summary() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const { response: topMetrics, isLoading: metricsLoading } =
        useOnboardApiV1CatalogMetricsList()
    const { response: topAccounts, isLoading: topAccountLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            startTime: dayjs(activeTimeRange.start.toString()).unix(),
            endTime: dayjs(activeTimeRange.end.toString()).unix(),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'resource_count',
        })

    return (
        <Flex className="mt-10">
            <Grid numItems={3} className="w-full gap-3">
                <Col numColSpan={1}>
                    <Flex flexDirection="col" className="gap-y-3 h-full">
                        <Card className="gap-y-2 h-1/2">
                            <Flex>
                                <Text className="font-medium">
                                    Total Accounts
                                </Text>
                                {!topAccountLoading && (
                                    <BadgeDelta
                                        deltaType={badgeTypeByDelta(
                                            topAccounts?.oldConnectionCount,
                                            topAccounts?.connectionCount
                                        )}
                                    >
                                        {percentageByChange(
                                            topAccounts?.oldConnectionCount,
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
                                        from {topAccounts?.oldConnectionCount}
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