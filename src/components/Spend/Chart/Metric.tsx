import { BadgeDelta, Card, Color, Flex, Metric, Text } from '@tremor/react'
import dayjs from 'dayjs'
import Spinner from '../../Spinner'
import { numberDisplay } from '../../../utilities/numericDisplay'
import { badgeTypeByDelta } from '../../../utilities/deltaType'

interface ISpendChartMetric {
    title: string
    timeRange: {
        start: dayjs.Dayjs
        end: dayjs.Dayjs
    }
    total: number
    timeRangePrev: {
        start: dayjs.Dayjs
        end: dayjs.Dayjs
    }
    totalPrev: number
    isLoading: boolean
}

export function SpendChartMetric({
    title,
    timeRange,
    timeRangePrev,
    total,
    totalPrev,
    isLoading,
}: ISpendChartMetric) {
    const deltaColors = new Map<string, Color>()
    deltaColors.set('increase', 'emerald')
    deltaColors.set('moderateIncrease', 'emerald')
    deltaColors.set('unchanged', 'orange')
    deltaColors.set('moderateDecrease', 'rose')
    deltaColors.set('decrease', 'rose')

    const changeRate = (
        ((Number(total) - Number(totalPrev)) / Number(totalPrev)) *
        100
    ).toFixed(1)

    return (
        <Card key={title} className="w-fit ring-0 shadow-transparent p-0">
            <Flex alignItems="baseline">
                <Flex flexDirection="col" className="gap-3" alignItems="start">
                    <Flex justifyContent="start" alignItems="end">
                        <Text className="text-gray-800 dark:text-gray-100 ">
                            {title}
                        </Text>
                        <Text className="pl-2 ml-2 border-l border-gray-100 dark:border-gray-800">
                            {timeRange.start.format('MMM DD, YYYY')} -{' '}
                            {timeRange.end.format('MMM DD, YYYY')} UTC
                        </Text>
                    </Flex>
                    <Flex justifyContent="start" alignItems="end">
                        <Metric> $ {numberDisplay(total, 0)}</Metric>
                    </Flex>
                    <Flex
                        flexDirection="row"
                        alignItems="center"
                        className="cursor-default"
                    >
                        <BadgeDelta
                            deltaType={badgeTypeByDelta(totalPrev, total)}
                        >
                            <Text
                                color={deltaColors.get(
                                    badgeTypeByDelta(totalPrev, total)
                                )}
                                className="ml-2"
                            >
                                {changeRate} %
                            </Text>
                        </BadgeDelta>

                        <Text className="ml-1.5">
                            compared to{' '}
                            {timeRangePrev.start.format('MMM DD, YYYY')} -{' '}
                            {timeRangePrev.end.format('MMM DD, YYYY')} UTC
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    )
}
