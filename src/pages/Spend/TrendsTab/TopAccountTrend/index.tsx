import React, { useEffect } from 'react'
import { Card, Title, Flex } from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import MultipleAreaCharts from '../../../../components/Charts/AreaCharts/MultipleAreaCharts'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../api/inventory.gen'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    timeRange: any
    connections?: []
}

const trendDataAtom = atom<
    {
        AWS: number
        Azure: number
        date: string
    }[]
>([])

export default function TopAccountTrend({
    timeRange,
    connections,
    categories,
}: IProps) {
    const [trendData, setTrendDataAtom] = useAtom(trendDataAtom)
    const { response: AWSData } = useInventoryApiV2CostTrendList({
        connector: 'AWS',
        datapointCount: 5,
        ...(timeRange.from && {
            startTime: dayjs(timeRange.from).unix(),
        }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(connections && { connectionId: connections }),
    })
    const { response: AzureData } = useInventoryApiV2CostTrendList({
        connector: 'Azure',
        datapointCount: 5,
        ...(timeRange.from && {
            startTime: dayjs(timeRange.from).unix(),
        }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(connections && { connectionId: connections }),
    })
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fixTime = (data: any, secondData: any) => {
        const result: any = []
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        if (data && secondData) {
            for (let i = 0; i < 5; i += 1) {
                const temp: any = {}
                const day = dayjs(data[i].date).format('DD')
                const month = dayjs(data[i].date).format('MMM')
                temp.AWS = data[i].count
                temp.Azure = secondData[i].count
                temp.date = `${month} ${day}`
                result.push(temp)
            }
        }
        setTrendDataAtom(result)
        return result
    }

    useEffect(() => {
        fixTime(AWSData, AzureData)
    }, [AWSData, AzureData])

    return (
        <Card>
            <Flex justifyContent="between" alignItems="start">
                <div className="flex justify-normal gap-x-2 items-center">
                    <Title className="min-w-[7vw]">Top Account Trend </Title>
                </div>
            </Flex>
            <MultipleAreaCharts
                className="mt-4 h-80"
                index="date"
                yAxisWidth={60}
                categories={['AWS', 'Azure']}
                data={trendData}
                colors={['indigo']}
                showAnimation
            />
        </Card>
    )
}
