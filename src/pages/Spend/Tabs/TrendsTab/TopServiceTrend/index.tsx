import React, { useEffect } from 'react'
import { Card, Title } from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import {
    useInventoryApiV2CostMetricList,
    useInventoryApiV2ServicesCostTrendList,
} from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    timeRange: any
    connections?: []
    connector?: any
}

const trendDataAtom = atom<object[]>([])
const serviceNamesAtom = atom<string[]>([])

export default function TopServicesTrend({
    timeRange,
    connections,
    categories,
    connector,
}: IProps) {
    const [serviceNames, setServiceNames] = useAtom(serviceNamesAtom)
    const [trendData, setTrendData] = useAtom(trendDataAtom)
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
    const fixTime = (input: any) => {
        const result: object[] = []
        const services: string[] = []
        if (input) {
            for (let i = 0; i < 5; i += 1) {
                const temp: any = {}
                // eslint-disable-next-line guard-for-in,no-restricted-syntax
                for (const item in input) {
                    const name = input[item].serviceName
                    // eslint-disable-next-line no-unused-expressions
                    if (!services.includes(name)) {
                        services.push(name)
                    }
                    const day = dayjs(input[item].costTrend[i].date).format(
                        'DD'
                    )
                    const month = dayjs(input[item].costTrend[i].date).format(
                        'MMM'
                    )
                    temp[name] = input[item].costTrend[i].count
                    temp.date = `${month} ${day}`
                }
                result.push(temp)
            }
        }
        setServiceNames(services)
        setTrendData(result)
        return result
    }

    useEffect(() => {
        fixTime(data)
    }, [data])

    return (
        <Card>
            <Title className="min-w-[7vw]">Top Services Trend</Title>
            {trendData.length > 0 ? (
                <Chart
                    className="mt-4 h-80"
                    index="date"
                    type="area"
                    yAxisWidth={60}
                    categories={serviceNames}
                    data={trendData}
                    showAnimation
                />
            ) : (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            )}
        </Card>
    )
}
