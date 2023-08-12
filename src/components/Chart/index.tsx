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
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        label: {
                            show: false,
                            position: 'center',
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 16,
                                fontWeight: 'bold',
                            },
                        },
                        labelLine: {
                            show: false,
                        },
                        data: [
                            { value: 1048, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                            { value: 580, name: 'Email' },
                            { value: 484, name: 'Union Ads' },
                            { value: 300, name: 'Video Ads' },
                        ],
                    },
                ],
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
                },
                // legend: {
                //     top: '0',
                //     left: 'center',
                // },
            }}
        />
    )
}
