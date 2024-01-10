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
import { useEffect, useState } from 'react'
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
import { buildTrend, costTrendChart } from './helpers'
import { generateVisualMap } from '../../../pages/Assets'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint } from '../../../api/api'

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
    costField: 'metric' | 'category' | 'account'
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
    costField,
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

    const trend = costTrendChart(costTrend, aggregation, granularity)
    const trendStacked = buildTrend(
        costTrend,
        aggregation,
        granularity,
        costField,
        5
    )
    const visualMap = generateVisualMap(trend.flag, trend.label)
    useEffect(() => {
        setSelectedDatapoint(undefined)
    }, [chartLayout, chartType, granularity, aggregation])

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
            {chartLayout === 'basic' && selectedDatapoint !== undefined && (
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
                    labels={trendStacked.label}
                    chartData={trendStacked.data}
                    isCost
                    chartType={chartType}
                    loading={isLoading}
                    error={error}
                />
            ) : (
                <Chart
                    labels={trend.label}
                    chartData={trend.data}
                    chartType={chartType}
                    chartLayout={chartLayout}
                    chartAggregation={aggregation}
                    isCost
                    loading={isLoading}
                    error={error}
                    visualMap={
                        aggregation === 'cumulative'
                            ? undefined
                            : visualMap.visualMap
                    }
                    markArea={
                        aggregation === 'cumulative'
                            ? undefined
                            : visualMap.markArea
                    }
                    onClick={(p) => {
                        if (aggregation !== 'cumulative') {
                            const t1 = costTrend
                                ?.filter(
                                    (t) =>
                                        p?.color === '#E01D48' &&
                                        dateDisplay(t.date) === p?.name
                                )
                                .at(0)

                            setSelectedDatapoint(t1)
                        }
                    }}
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
