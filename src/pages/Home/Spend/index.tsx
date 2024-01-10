import { Card, Col, Flex, Grid, Icon, Legend, Text, Title } from '@tremor/react'
import { BanknotesIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai/index'
import { useEffect, useState } from 'react'
import { filterAtom, spendTimeAtom } from '../../../store'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { toErrorMessage } from '../../../types/apierror'
import SummaryCard from '../../../components/Cards/SummaryCard'
import {
    costTrendChart,
    topFiveStackedMetrics,
} from '../../../components/Spend/Chart/helpers'
import StackedChart from '../../../components/Chart/Stacked'

const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6766', '#73C0DE']

export default function Spend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [topCategories, setTopCategories] = useState<any>([])

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'cost' | undefined
        endTime: number
        startTime: number
        connectionId: string[]
        connector?: ('AWS' | 'Azure')[] | undefined
    } = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost',
    }
    const duration = activeTimeRange.end.diff(activeTimeRange.start, 'second')
    const prevTimeRange = {
        start: activeTimeRange.start.add(-duration, 'second'),
        end: activeTimeRange.end.add(-duration, 'second'),
    }
    const prevQuery = {
        ...query,
        ...(activeTimeRange.start && {
            startTime: prevTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: prevTimeRange.end.unix(),
        }),
    }

    const {
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: costTrendRefresh,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity: 'daily',
    })
    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)
    const top3 = topFiveStackedMetrics(costTrend || [], 4)
    console.log(top3)

    return (
        <Card className="h-full">
            <Grid numItems={3}>
                <Col>
                    <Flex justifyContent="start" className="mb-2">
                        <Icon
                            icon={BanknotesIcon}
                            className="bg-gray-50 rounded mr-2"
                        />
                        <Title>Spend</Title>
                    </Flex>
                    <SummaryCard
                        title="Total spend"
                        metric={serviceCostResponse?.total_cost || 0}
                        metricPrev={servicePrevCostResponse?.total_cost || 0}
                        loading={
                            costTrendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            costTrendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                        isPrice
                        border={false}
                    />
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                        className="gap-1 mt-5"
                    >
                        {[...top3, { metricName: 'Other' }]
                            .sort((a, b) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                if (a.metricName < b.metricName) {
                                    return -1
                                }
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                if (a.metricName > b.metricName) {
                                    return 1
                                }
                                return 0
                            })
                            .map((t, i) => (
                                <Flex justifyContent="start" className="gap-2">
                                    <div
                                        className="h-2 w-2 min-w-[8px] rounded-full"
                                        style={{ backgroundColor: colors[i] }}
                                    />
                                    <Text className="line-clamp-1">
                                        {t.metricName}
                                    </Text>
                                </Flex>
                            ))}
                    </Flex>
                </Col>
                <Col numColSpan={2}>
                    <StackedChart
                        labels={
                            costTrendChart(
                                costTrend,
                                'trend',
                                'stacked',
                                'daily',
                                5,
                                4
                            ).label
                        }
                        chartData={
                            costTrendChart(
                                costTrend,
                                'trend',
                                'stacked',
                                'daily',
                                5,
                                4
                            ).data
                        }
                        isCost
                        chartType="bar"
                        loading={
                            costTrendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            costTrendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                    />
                </Col>
            </Grid>
        </Card>
    )
}
