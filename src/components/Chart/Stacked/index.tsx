import ReactEcharts from 'echarts-for-react'
import { Flex, Text } from '@tremor/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import {
    exactPriceDisplay,
    numberDisplay,
    numericDisplay,
} from '../../../utilities/numericDisplay'

export interface StackItem {
    label: string
    value: number
}

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData: StackItem[][]
    chartType: 'bar' | 'line'
    isCost: boolean
    loading?: boolean
    error?: string
    onRefresh?: () => void
    onClick?: (param?: any) => void
}

export default function StackedChart({
    labels,
    labelType = 'category',
    chartData,
    chartType,
    isCost,
    loading,
    error,
    onRefresh,
    onClick,
}: IChart) {
    const uniqueStackLabels = chartData
        .flatMap((v) => v.map((i) => i.label))
        .filter((l, idx, arr) => arr.indexOf(l) === idx)

    const series = uniqueStackLabels.map((label) => {
        return {
            name: label,
            type: chartType === 'bar' ? 'bar' : 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
                focus: 'series',
            },
            data: chartData.map(
                (v) =>
                    v
                        .filter((i) => i.label === label)
                        .map((i) => i.value)
                        .at(0) || 0
            ),
        }
    })

    const options = () => {
        return {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985',
                    },
                },
                valueFormatter: (value: number | string) => {
                    if (isCost) {
                        return exactPriceDisplay(value)
                    }
                    return value.toString()
                },
                order: 'valueDesc',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            xAxis: {
                type: labelType,
                data: labels,
            },
            yAxis: [
                {
                    type: 'value',
                },
            ],
            series,
        }
    }

    const onEvents = {
        click: (params: any) => (onClick ? onClick(params) : undefined),
    }

    if (error !== undefined && error.length > 0) {
        return (
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                className="cursor-pointer w-full h-80"
                onClick={onRefresh}
            >
                <Text className="text-gray-400 mr-2 w-auto">
                    Error loading {error}
                </Text>
                <Flex
                    flexDirection="row"
                    justifyContent="end"
                    className="w-auto"
                >
                    <ArrowPathIcon className="text-kaytu-500 w-4 h-4 mr-1" />
                    <Text className="text-kaytu-500">Reload</Text>
                </Flex>
            </Flex>
        )
    }

    return (
        <ReactEcharts
            option={options()}
            showLoading={loading}
            className="w-full"
            onEvents={
                chartType === 'bar' || chartType === 'line'
                    ? onEvents
                    : undefined
            }
        />
    )
}
