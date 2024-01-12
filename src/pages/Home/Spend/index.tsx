import { Button, Card, Col, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { BanknotesIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai/index'
import { useNavigate } from 'react-router-dom'
import { filterAtom, timeAtom } from '../../../store'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { toErrorMessage } from '../../../types/apierror'
import { buildTrend } from '../../../components/Spend/Chart/helpers'
import StackedChart from '../../../components/Chart/Stacked'
import { SpendChartMetric } from '../../../components/Spend/Chart/Metric'

const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6766', '#73C0DE']

export default function Spend() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const navigate = useNavigate()

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
    const trendStacked = buildTrend(
        costTrend || [],
        'trend',
        'daily',
        'account',
        4
    )

    return (
        <Card className="h-full">
            <Grid numItems={2} className="gap-4">
                <Col numColSpan={1}>
                    <Flex justifyContent="start" className="mb-2">
                        <Icon
                            icon={BanknotesIcon}
                            className="bg-gray-50 rounded mr-2"
                        />
                        <Title>Cloud Spend</Title>
                    </Flex>
                    <StackedChart
                        labels={trendStacked.label}
                        chartData={trendStacked.data}
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
                <Col>
                    <Flex className="h-full" flexDirection="col">
                        <SpendChartMetric
                            title="Total Spend"
                            timeRange={activeTimeRange}
                            total={serviceCostResponse?.total_cost || 0}
                            timeRangePrev={prevTimeRange}
                            totalPrev={servicePrevCostResponse?.total_cost || 0}
                            isLoading={
                                serviceCostLoading || servicePrevCostLoading
                            }
                            error={toErrorMessage(
                                serviceCostErr,
                                servicePrevCostErr
                            )}
                            comparedToNextLine
                        />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-1"
                        >
                            {(trendStacked.data[0]
                                ? trendStacked.data[0]
                                : []
                            ).map((t, i) => (
                                <Flex justifyContent="start" className="gap-2">
                                    <div
                                        className="h-2 w-2 min-w-[8px] rounded-full"
                                        style={{ backgroundColor: colors[i] }}
                                    />
                                    <Text className="line-clamp-1">
                                        {t.label}
                                    </Text>
                                </Flex>
                            ))}
                        </Flex>
                        <Flex justifyContent="end">
                            <Button
                                variant="light"
                                icon={ChevronRightIcon}
                                iconPosition="right"
                                onClick={() => navigate('spend')}
                            >
                                View details
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Grid>
        </Card>
    )
}
