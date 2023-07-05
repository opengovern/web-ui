import React, { useEffect, useState } from 'react'
import {
    Card,
    SearchSelect,
    SearchSelectItem,
    MultiSelect,
    MultiSelectItem,
    Title,
    BadgeDelta,
    DeltaType,
    Flex,
    Text,
} from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import MultipleAreaCharts from '../../../../../components/Charts/AreaCharts/MultipleAreaCharts'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    timeRange: any
    connections?: []
}

const selectedTrendCostProviderAtom = atom<string>('')
export default function GrowthTrend({
    timeRange,
    connections,
    categories,
}: IProps) {
    const [growthDeltaType, setGrowthDeltaType] =
        useState<DeltaType>('unchanged')
    const [growthDelta, setGrowthDelta] = useState(0)
    const [selectedTrendCostProvider, setSelectedTrendCostProvider] = useAtom(
        selectedTrendCostProviderAtom
    )
    const query = {
        ...(selectedTrendCostProvider && {
            connector: selectedTrendCostProvider,
        }),
        ...(timeRange.from && {
            startTime: dayjs(timeRange.from).unix(),
        }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(connections && { connectionId: connections }),
    }
    const { response: data, isLoading } = useInventoryApiV2CostTrendList(query)
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fixTime = (data: any) => {
        const result: any = []
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const item in data) {
            const temp: any = {}
            const day = dayjs(data[item].date).format('DD')
            const month = dayjs(data[item].date).format('MMM')
            temp.count = data[item].count
            temp.date = `${month} ${day}`
            result.push(temp)
        }
        return result
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const findDeltaType = (data: any) => {
        if (data && data.length > 1) {
            const first = data[0].count
            const last = data[data.length - 1].count
            if (first > last) {
                setGrowthDeltaType('moderateDecrease')
                setGrowthDelta(Math.abs(last - first))
            } else if (first < last) {
                setGrowthDeltaType('moderateIncrease')
                setGrowthDelta(Math.abs(last - first))
            } else {
                setGrowthDeltaType('unchanged')
                setGrowthDelta(0)
            }
        }
    }

    useEffect(() => {
        fixTime(data)
        findDeltaType(data)
    }, [data])

    return (
        <Card>
            <Flex justifyContent="between" alignItems="start">
                <div className="flex justify-normal gap-x-2 items-center">
                    <Title className="min-w-[7vw]">Overall Spend Trend </Title>
                    <BadgeDelta deltaType={growthDeltaType}>
                        {numericDisplay(growthDelta)}
                    </BadgeDelta>
                </div>
                <div className="flex flex-row justify-normal gap-x-2 items-start">
                    <div>
                        <Text>
                            <span className="text-gray-500">Provider: </span>
                        </Text>
                        <SearchSelect
                            onValueChange={(e) =>
                                setSelectedTrendCostProvider(e)
                            }
                            value={selectedTrendCostProvider}
                            placeholder="Provider Selection"
                            className="max-w-xs mb-6"
                        >
                            {categories.map((category) => (
                                <SearchSelectItem
                                    key={category.label}
                                    value={category.value}
                                >
                                    {category.label}
                                </SearchSelectItem>
                            ))}
                        </SearchSelect>
                    </div>
                </div>
            </Flex>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <MultipleAreaCharts
                    className="mt-4 h-80"
                    index="date"
                    yAxisWidth={60}
                    categories={['count']}
                    data={fixTime(data) || []}
                    colors={['indigo']}
                    showAnimation
                />
            )}
        </Card>
    )
}
