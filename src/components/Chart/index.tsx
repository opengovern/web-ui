import ReactEcharts from 'echarts-for-react'
import { Flex, Text } from '@tremor/react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import {
    exactPriceDisplay,
    numberDisplay,
    numericDisplay,
} from '../../utilities/numericDisplay'

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData:
        | (string | number | undefined)[]
        | (
              | {
                    name: string
                    value: string
                    itemStyle?: undefined
                    label?: undefined
                }
              | {
                    value: number
                    name: string
                    itemStyle: { color: string; decal: { symbol: string } }
                    label: { show: boolean }
                }
          )[]
        | (
              | {
                    name: string
                    value: number | undefined
                    itemStyle?: undefined
                    label?: undefined
                }
              | {
                    value: number
                    name: string
                    itemStyle: { color: string; decal: { symbol: string } }
                    label: { show: boolean }
                }
          )[]
        | undefined
    chartType: 'bar' | 'line' | 'area' | 'doughnut' | 'half-doughnut'
    visualMap?: any
    markArea?: any
    isCost?: boolean
    isPercent?: boolean
    loading?: boolean
    error?: string
    onRefresh?: () => void
    onClick?: (param?: any) => void
}

export default function Chart({
    labels,
    labelType = 'category',
    chartData,
    chartType,
    isCost = false,
    isPercent = false,
    markArea,
    visualMap,
    loading,
    error,
    onRefresh,
    onClick,
}: IChart) {
    const options = () => {
        if (
            chartType === 'bar' ||
            chartType === 'line' ||
            chartType === 'area'
        ) {
            return {
                xAxis: {
                    type: labelType,
                    data: labels,
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: (value: string | number) => {
                            if (isCost) {
                                return `$${numericDisplay(value)}`
                            }
                            if (isPercent) {
                                return `${numericDisplay(value)} %`
                            }
                            return numericDisplay(value)
                        },
                    },
                },
                visualMap,
                animation: false,
                series: [
                    chartType === 'area' && {
                        data: chartData,
                        type: 'line',
                        areaStyle: { opacity: 0.7 },
                    },
                    chartType === 'bar' && {
                        data: chartData,
                        type: chartType,
                        areaStyle: { opacity: 0 },
                    },
                    chartType === 'line' && {
                        data: chartData,
                        markArea,
                        type: chartType,
                        areaStyle: { opacity: 0 },
                    },
                ],
                grid: {
                    left: 45,
                    right: 0,
                    top: 20,
                    bottom: 40,
                },
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    valueFormatter: (value: string | number) => {
                        if (isCost) {
                            return `$${numberDisplay(Number(value), 2)}`
                        }
                        if (isPercent) {
                            return `${numericDisplay(value)} %`
                        }
                        return numberDisplay(Number(value), 0)
                    },
                },
                color: [
                    '#1D4F85',
                    '#2970BC',
                    '#6DA4DF',
                    '#96BEE8',
                    '#C0D8F1',
                    '#D0D4DA',
                ],
            }
        }
        if (chartType === 'doughnut') {
            return {
                series: [
                    {
                        type: 'pie',
                        radius: ['47%', '70%'],
                        // center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold',
                                formatter: (params: any) => {
                                    return `${params.data.name} - ${
                                        params.percent
                                    }%\n\n${
                                        isCost
                                            ? exactPriceDisplay(
                                                  params.data.value
                                              )
                                            : numberDisplay(
                                                  params.data.value,
                                                  0
                                              )
                                    }`
                                },
                            },
                        },
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        data: chartData,
                        left: '-5%',
                        width: '70%',
                    },
                ],
                legend: {
                    right: 12,
                    top: 'middle',
                    icon: 'circle',
                    orient: 'vertical',
                    textStyle: {
                        width: 140,
                        overflow: 'truncate',
                    },
                },
                color: [
                    '#0D2239',
                    '#1D4F85',
                    '#1E7CE0',
                    '#6DA4DF',
                    '#C0D8F1',
                    '#D0D4DA',
                ],
            }
        }
        if (chartType === 'half-doughnut') {
            return {
                tooltip: {
                    trigger: 'item',
                },
                series: [
                    {
                        type: 'pie',
                        radius: ['30%', '50%'],
                        center: ['40%', '63%'],
                        // adjust the start angle
                        startAngle: 180,
                        label: {
                            show: false,
                        },
                        data: chartData,
                    },
                ],
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2,
                },
                color: ['#C0D8F1', '#0D2239'],
            }
        }
        return undefined
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
