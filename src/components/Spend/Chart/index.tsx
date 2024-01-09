import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Text,
    Title,
} from '@tremor/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import { numberDisplay } from '../../../utilities/numericDisplay'
import StackedChart from '../../Chart/Stacked'
import Chart from '../../Chart'
import { dateDisplay } from '../../../utilities/dateDisplay'
import { SpendChartMetric } from './Metric'
import {
    Aggregation,
    ChartLayout,
    ChartType,
    Granularity,
    SpendChartSelectors,
} from './Selectors'
import { costTrendChart } from './helpers'
import { generateVisualMap } from '../../../pages/Assets'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint } from '../../../api/api'
import { toErrorMessage } from '../../../types/apierror'

interface ISpendChart {
    title: string
    timeRange: {
        start: dayjs.Dayjs
        end: dayjs.Dayjs
    }
    total: number
    timeRangePrev: {
        start: dayjs.Dayjs
        end: dayjs.Dayjs
    }
    totalPrev: number
    isLoading: boolean
    costTrend: GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
    error: string | undefined
    onRefresh: () => void
    onGranularityChanged: (v: Granularity) => void
}

export function SpendChart({
    title,
    timeRange,
    timeRangePrev,
    total,
    totalPrev,
    costTrend,
    onGranularityChanged,
    isLoading,
    error,
    onRefresh,
}: ISpendChart) {
    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)
    const [chartType, setChartType] = useState<ChartType>('bar')
    const [granularity, setGranularity] = useState<Granularity>('daily')
    const [chartLayout, setChartLayout] = useState<ChartLayout>('stacked')
    const [aggregation, setAggregation] = useState<Aggregation>('trend')

    return (
        <Card>
            <Grid numItems={6} className="gap-4 mb-4">
                <Col numColSpan={2}>
                    <SpendChartMetric
                        title={title}
                        timeRange={timeRange}
                        total={total}
                        timeRangePrev={timeRangePrev}
                        totalPrev={totalPrev}
                        isLoading={isLoading}
                        error={error}
                    />
                </Col>
                <Col numColSpan={4}>
                    <SpendChartSelectors
                        timeRange={timeRange}
                        chartType={chartType}
                        setChartType={setChartType}
                        granularity={granularity}
                        setGranularity={(v) => {
                            setGranularity(v)
                            onGranularityChanged(v)
                        }}
                        chartLayout={chartLayout}
                        setChartLayout={setChartLayout}
                        aggregation={aggregation}
                        setAggregation={setAggregation}
                    />
                </Col>
            </Grid>
            {selectedDatapoint !== undefined && (
                <Callout
                    color="rose"
                    title="Incomplete data"
                    className="w-fit mt-4"
                >
                    Checked{' '}
                    {numberDisplay(
                        selectedDatapoint.totalSuccessfulDescribedConnectionCount,
                        0
                    )}{' '}
                    accounts out of{' '}
                    {numberDisplay(selectedDatapoint.totalConnectionCount, 0)}{' '}
                    on {dateDisplay(selectedDatapoint.date)}
                </Callout>
            )}

            {chartLayout === 'stacked' ? (
                <StackedChart
                    labels={
                        costTrendChart(
                            costTrend,
                            aggregation,
                            chartLayout,
                            granularity
                        ).label
                    }
                    chartData={
                        costTrendChart(
                            costTrend,
                            aggregation,
                            chartLayout,
                            granularity
                        ).data
                    }
                    isCost
                    chartType={chartType}
                    loading={isLoading}
                    error={error}
                    onClick={
                        aggregation === 'cumulative'
                            ? undefined
                            : (p) => setSelectedDatapoint(p)
                    }
                />
            ) : (
                <Chart
                    labels={
                        costTrendChart(
                            costTrend,
                            aggregation,
                            chartLayout,
                            granularity
                        ).label
                    }
                    chartData={
                        costTrendChart(
                            costTrend,
                            aggregation,
                            chartLayout,
                            granularity
                        ).data
                    }
                    chartType={chartType}
                    chartLayout={chartLayout}
                    chartAggregation={aggregation}
                    isCost
                    loading={isLoading}
                    error={error}
                    visualMap={
                        aggregation === 'cumulative'
                            ? undefined
                            : generateVisualMap(
                                  costTrendChart(
                                      costTrend,
                                      aggregation,
                                      chartLayout,
                                      granularity
                                  ).flag,
                                  costTrendChart(
                                      costTrend,
                                      aggregation,
                                      chartLayout,
                                      granularity
                                  ).label
                              ).visualMap
                    }
                    markArea={
                        aggregation === 'cumulative'
                            ? undefined
                            : generateVisualMap(
                                  costTrendChart(
                                      costTrend,
                                      aggregation,
                                      chartLayout,
                                      granularity
                                  ).flag,
                                  costTrendChart(
                                      costTrend,
                                      aggregation,
                                      chartLayout,
                                      granularity
                                  ).label
                              ).markArea
                    }
                    onClick={
                        aggregation === 'cumulative'
                            ? undefined
                            : (p) => setSelectedDatapoint(p)
                    }
                />
            )}

            {error && (
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="absolute top-0 w-full left-0 h-full backdrop-blur"
                >
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Title className="mt-6">Failed to load component</Title>
                        <Text className="mt-2">{error}</Text>
                    </Flex>
                    <Button
                        variant="secondary"
                        className="mb-6"
                        color="slate"
                        onClick={onRefresh}
                    >
                        Try Again
                    </Button>
                </Flex>
            )}
        </Card>
    )
}
