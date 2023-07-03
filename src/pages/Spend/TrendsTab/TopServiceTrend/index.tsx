import React, { useEffect } from 'react'
import { Card, Title, Flex } from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import MultipleAreaCharts from '../../../../components/Charts/AreaCharts/MultipleAreaCharts'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import {
    useInventoryApiV2CostMetricList,
    useInventoryApiV2ServicesCostTrendList,
} from '../../../../api/inventory.gen'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    timeRange: any
    connections?: []
    connector?: any
}

const trendDataAtom = atom<
    {
        AWS: number
        Azure: number
        date: string
    }[]
>([])

export default function TopServicesTrend({
    timeRange,
    connections,
    categories,
    connector,
}: IProps) {
    const [trendData, setTrendDataAtom] = useAtom(trendDataAtom)
    const { response: metrics, isLoading } = useInventoryApiV2CostMetricList({
        ...(connector && { connector }),
        ...(timeRange.from && {
            startTime: dayjs(timeRange.from).unix(),
        }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(connections && { connectionId: connections }),
        pageSize: 5,
        sortBy: 'cost',
    })

    const { response: data } = useInventoryApiV2ServicesCostTrendList(
        {
            services:
                metrics?.metrics?.map((metric) => metric.cost_dimension_name) ||
                [],
            datapointCount: 5,
            ...(connector && { connector }),
            ...(timeRange.from && {
                startTime: dayjs(timeRange.from).unix(),
            }),
            ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
            ...(connections && { connectionId: connections }),
        },
        {},
        !isLoading
    )

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fixTime = (data: any) => {
        const result: any = []
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        if (data) {
            for (let i = 0; i < 5; i += 1) {
                const temp: any = {}
                const day = dayjs(data[i].date).format('DD')
                const month = dayjs(data[i].date).format('MMM')
                temp.count = data[i].count
                temp.date = `${month} ${day}`
                result.push(temp)
            }
        }
        setTrendDataAtom(result)
        return result
    }

    useEffect(() => {
        fixTime(data)
    }, [data])

    return (
        <Card>
            <Flex justifyContent="between" alignItems="start">
                <div className="flex justify-normal gap-x-2 items-center">
                    <Title className="min-w-[7vw]">Top Services Trend </Title>
                </div>
            </Flex>
            <MultipleAreaCharts
                className="mt-4 h-80"
                index="date"
                yAxisWidth={60}
                categories={['count']}
                data={trendData}
                colors={['indigo']}
                showAnimation
            />
        </Card>
    )
}
