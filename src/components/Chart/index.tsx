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
                            return value
                        },
                    },
                },
                series: [
                    chartType === 'area' && {
                        data: chartData,
                        type: 'line',
                        areaStyle: { opacity: 0.7 },
                    },
                    (chartType === 'bar' || chartType === 'line') && {
                        data: chartData,
                        type: chartType,
                        areaStyle: { opacity: 0 },
                    },
                ],
                grid: {
                    left: 50,
                    right: 0,
                    top: 20,
                    bottom: 40,
                },
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
            }
        }
        if (chartType === 'doughnut') {
            return {
                series: [
                    {
                        type: 'pie',
                        radius: ['55%', '80%'],
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
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 2,
                        },
                        data: chartData,
                        left: '-45%',
                        // height: 300,
                    },
                ],
                legend: {
                    right: 0,
                    top: 'middle',
                    icon: 'circle',
                    orient: 'vertical',
                    // textStyle: {
                    //     width: 140,
                    //     overflow: 'truncate',
                    // },
                },
            }
        }
        return undefined
    }

    return (
        <ReactEcharts
            option={{
                ...options(),
                color: [
                    '#1D4F85',
                    '#2970BC',
                    '#6DA4DF',
                    '#96BEE8',
                    '#C0D8F1',
                    '#D0D4DA',
                ],
            }}
            echarts={{ height: '100%' }}
        />
    )
}
