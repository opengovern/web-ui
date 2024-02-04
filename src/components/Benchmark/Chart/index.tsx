import dayjs from 'dayjs'
import { Card, Flex, Tab, TabGroup, TabList, Title } from '@tremor/react'
import { trendChart } from './helpers'
import StackedChart from '../../Chart/Stacked'
import Selector from '../../Selector'
import { ChartType, chartTypeValues } from '../../Asset/Chart/Selectors'
import { BarChartIcon, LineChartIcon } from '../../../icons/icons'

interface IBenchmarkChart {
    title: string
    isLoading: boolean
    trend: any[] | undefined
    error: string | undefined
    onRefresh: () => void
    chartLayout: 'count' | 'percent'
    setChartLayout: (v: 'count' | 'percent') => void
    validChartLayouts: ('count' | 'percent')[]
    chartType: ChartType
    setChartType: (v: ChartType) => void
}

export default function BenchmarkChart({
    title,
    isLoading,
    trend,
    error,
    onRefresh,
    chartLayout,
    setChartLayout,
    validChartLayouts,
    chartType,
    setChartType,
}: IBenchmarkChart) {
    const theTrend = trendChart(trend)
    console.log(theTrend)

    return (
        <Card>
            <Flex>
                <Title>{title}</Title>
                <Selector
                    values={validChartLayouts.map((v) => String(v))}
                    value={chartLayout}
                    title="Show"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onValueChange={(v) => setChartLayout(v)}
                />
                <TabGroup
                    index={chartTypeValues.indexOf(chartType)}
                    onIndexChange={(i) =>
                        setChartType(chartTypeValues.at(i) || 'bar')
                    }
                    className="w-fit rounded-lg ml-2"
                >
                    <TabList variant="solid">
                        <Tab value="bar">
                            <BarChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                        </Tab>
                        <Tab value="line">
                            <LineChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                        </Tab>
                    </TabList>
                </TabGroup>
            </Flex>
            <StackedChart
                labels={theTrend.label}
                chartData={theTrend.data}
                chartType={chartType}
                loading={isLoading}
                error={error}
                isCost={false}
            />
        </Card>
    )
}
