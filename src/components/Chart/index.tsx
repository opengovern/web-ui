import ReactEcharts from 'echarts-for-react'
import { numericDisplay } from '../../utilities/numericDisplay'

interface IChart {
    labels: string[]
    labelType?: 'category' | 'time' | 'value' | 'log'
    chartData: (string | number | undefined)[]
    chartType: 'bar' | 'line'
    isCost?: boolean
}

export default function Chart({
    labels,
    labelType = 'category',
    chartData,
    chartType,
    isCost = false,
}: IChart) {
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
                series: [
                    {
                        data: chartData,
                        type: chartType,
                    },
                ],
                tooltip: {
                    show: true,
                    trigger: 'axis',
                },
            }}
            className="scale-110"
        />
    )
}
