import ReactEcharts from 'echarts-for-react'
import { numericDisplay } from '../../utilities/numericDisplay'

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData: (string | number | undefined)[]
    chartType: 'bar' | 'line' | 'area' | 'doughnut'
    isCost?: boolean
}

export default function Chart({
    labels,
    labelType = 'category',
    chartData,
    chartType,
    isCost = false,
}: IChart) {
    const seriesType = () => {
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
                            return value
                        },
                    },
                },
                series: [
                    chartType === 'area'
                        ? {
                              data: chartData,
                              type: 'line',
                              areaStyle: {},
                          }
                        : {
                              data: chartData,
                              type: chartType,
                          },
                ],
                grid: {
                    left: 50,
                    right: 0,
                    top: 20,
                    bottom: 40,
                },
            }
        }
        if (chartType === 'doughnut') {
            return {
                series: [
                    {
                        type: 'pie',
                        radius: ['60%', '80%'],
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
                                // eslint-disable-next-line no-template-curly-in-string
                                formatter: isCost ? '{b}\n\n ${c}' : '{c}',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: chartData,
                    },
                ],
                // left: 'left',
                legend: {
                    right: '0',
                    top: 'center',
                    icon: 'circle',
                    orient: 'vertical',
                    textStyle: {
                        width: 140,
                        overflow: 'truncate',
                    },
                },
            }
        }
        return undefined
    }

    return (
        <ReactEcharts
            option={{
                ...seriesType(),
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    valueFormatter: (value: string | number) => {
                        if (isCost) {
                            return `$${Number(value).toFixed(2)}`
                        }
                        return value
                    },
                },
                // legend: {
                //     top: '0',
                //     left: 'center',
                // },
            }}
        />
    )
}
