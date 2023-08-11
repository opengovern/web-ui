import ReactEcharts from 'echarts-for-react'
import { numericDisplay } from '../../utilities/numericDisplay'

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData: (string | number | undefined)[]
    chartType: 'bar' | 'line' | 'area'
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
        if (chartType === 'bar' || chartType === 'line') {
            return {
                data: chartData,
                type: chartType,
            }
        }
        if (chartType === 'area') {
            return {
                data: chartData,
                type: 'line',
                areaStyle: {},
            }
        }
        return undefined
    }

    return (
        <ReactEcharts
            option={{
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
                series: [seriesType()],
                tooltip: {
                    show: true,
                    trigger: 'axis',
                },
                legend: {
                    top: '5%',
                    left: 'center',
                },
            }}
            className="scale-110"
        />
    )
}
