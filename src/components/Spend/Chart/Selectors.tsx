import { Flex, Icon, Tab, TabGroup, TabList } from '@tremor/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import Selector from '../../Selector'
import { checkGranularity } from '../../../utilities/dateComparator'
import { BarChartIcon, LineChartIcon } from '../../../icons/icons'

export type ChartType = 'bar' | 'line'
const chartTypeValues: ChartType[] = ['bar', 'line']

export type Granularity = 'daily' | 'monthly' | 'yearly'
const granularityValues: Granularity[] = ['daily', 'monthly', 'yearly']

export type ChartLayout = 'basic' | 'stacked'
const chartLayoutValues: ChartLayout[] = ['basic', 'stacked']

export type Aggregation = 'trend' | 'cumulative'
const aggregationValues: Aggregation[] = ['trend', 'cumulative']

interface ISpendChartSelectors {
    timeRange: {
        start: dayjs.Dayjs
        end: dayjs.Dayjs
    }
    chartType: ChartType
    setChartType: (v: ChartType) => void
    granularity: Granularity
    setGranularity: (v: Granularity) => void
    chartLayout: ChartLayout
    setChartLayout: (v: ChartLayout) => void
    aggregation: Aggregation
    setAggregation: (v: Aggregation) => void
}

export function SpendChartSelectors({
    timeRange,
    chartType,
    setChartType,
    granularity,
    setGranularity,
    chartLayout,
    setChartLayout,
    aggregation,
    setAggregation,
}: ISpendChartSelectors) {
    const generateGranularityList = (
        s = timeRange.start,
        e = timeRange.end
    ) => {
        let List: string[] = []
        if (checkGranularity(s, e).daily) {
            List = [...List, 'daily']
        }
        if (checkGranularity(s, e).monthly) {
            List = [...List, 'monthly']
        }
        if (checkGranularity(s, e).yearly) {
            List = [...List, 'yearly']
        }
        return List
    }

    return (
        <Flex justifyContent="end" className="gap-0">
            <Selector
                values={generateGranularityList(timeRange.start, timeRange.end)}
                value={granularity}
                title="Granularity  "
                onValueChange={(v) => {
                    setGranularity(v as Granularity)
                }}
            />

            <Selector
                values={chartLayoutValues.map((v) => String(v))}
                value={chartLayout}
                title="Categorization"
                onValueChange={(v) => {
                    setChartLayout(v as ChartLayout)
                }}
            />

            <Selector
                values={aggregationValues.map((v) => String(v))}
                value={aggregation}
                title="Data Aggregation"
                onValueChange={(v) => {
                    setAggregation(v as Aggregation)
                }}
            />

            <TabGroup
                index={chartTypeValues.indexOf(chartType)}
                onIndexChange={(i) =>
                    setChartType(chartTypeValues.at(i) || 'bar')
                }
                className="w-fit rounded-lg ml-2"
            >
                <TabList variant="solid">
                    <Tab value="line">
                        <LineChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                    </Tab>
                    <Tab value="bar">
                        <BarChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                    </Tab>
                </TabList>
            </TabGroup>
        </Flex>
    )
}
