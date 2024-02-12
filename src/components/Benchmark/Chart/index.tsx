import { Card, Flex, Tab, TabGroup, TabList, Title } from '@tremor/react'
import { trendChart } from './helpers'
import StackedChart from '../../Chart/Stacked'
import Selector from '../../Selector'
import { ChartType, chartTypeValues } from '../../Asset/Chart/Selectors'
import { BarChartIcon, LineChartIcon } from '../../../icons/icons'
import { errorHandlingWithErrorMessage } from '../../../types/apierror'
import {
    IStackItem,
    ITrendItem,
} from '../../../pages/Governance/Compliance/BenchmarkSummary'

export type BenchmarkChartShowType =
    | 'Conformance Status'
    | 'Severity'
    | 'Security Score'
export const BenchmarkChartShowValues = [
    'Conformance Status',
    'Severity',
    'Security Score',
]

export type BenchmarkChartViewType = 'Findings' | 'Controls'
export const BenchmarkChartViewValues = ['Findings', 'Controls']

export type BenchmarkChartIncludePassedType = 'True' | 'False'
export const BenchmarkChartIncludePassedValues = ['True', 'False']

interface IBenchmarkChart {
    title: string
    isLoading: boolean
    trend: ITrendItem[] | undefined
    error: string | undefined
    onRefresh: () => void
    includePassed: 'True' | 'False'
    setIncludePassed: (v: 'True' | 'False') => void
    show: 'Conformance Status' | 'Severity' | 'Security Score'
    setShow: (v: 'Conformance Status' | 'Severity' | 'Security Score') => void
    view: 'Findings' | 'Controls'
    setView: (v: 'Findings' | 'Controls') => void
    chartType: ChartType
    setChartType: (v: ChartType) => void
}

export default function BenchmarkChart({
    title,
    isLoading,
    trend,
    error,
    onRefresh,
    chartType,
    setChartType,
    includePassed,
    setIncludePassed,
    show,
    setShow,
    view,
    setView,
}: IBenchmarkChart) {
    const theTrend = trendChart(trend)

    return (
        <Card className="mb-6">
            <Flex>
                <Title>{title}</Title>
                <Flex className="w-fit gap-6">
                    <Selector
                        values={['True', 'False']}
                        value={includePassed}
                        title="Include passed"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onValueChange={(v) => setIncludePassed(v)}
                    />
                    <Selector
                        values={[
                            'Conformance Status',
                            'Severity',
                            'Security Score',
                        ]}
                        value={show}
                        title="Show"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onValueChange={(v) => setShow(v)}
                    />
                    <Selector
                        values={['Findings', 'Controls']}
                        value={view}
                        title="View"
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onValueChange={(v) => setView(v)}
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
            </Flex>
            <StackedChart
                labels={theTrend.label}
                chartData={theTrend.data}
                chartType={chartType}
                loading={isLoading}
                error={error}
                isCost={false}
            />
            {errorHandlingWithErrorMessage(onRefresh, error)}
        </Card>
    )
}
