import ReactEcharts from 'echarts-for-react'
import { Flex, Text } from '@tremor/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useAtomValue } from 'jotai'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'
import { colorBlindModeAtom } from '../../../store'

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
    const colorBlindMode = useAtomValue(colorBlindModeAtom)

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
            aria: {
                enable: colorBlindMode,
                decal: {
                    show: colorBlindMode,
                },
            },
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
                left: 45,
                right: 0,
                top: 20,
                bottom: 40,
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
            // color: false
            //     ? [
            //           '#780000',
            //           '#DC0000',
            //           '#FD8C00',
            //           '#FDC500',
            //           '#10B880',
            //           '#D0D4DA',
            //       ]
            //     : [
            //           '#1E7CE0',
            //           '#2ECC71',
            //           '#FFA500',
            //           '#9B59B6',
            //           '#D0D4DA',
            //           '#D0D4DA',
            //       ],

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

    if (loading) {
        return (
            <div className="animate-pulse h-72 mb-2 w-full bg-slate-200 dark:bg-slate-700 rounded" />
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
