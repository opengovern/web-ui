import React, { useEffect, useState } from 'react'
import {
    Card,
    SearchSelect,
    SearchSelectItem,
    Title,
    BadgeDelta,
    DeltaType,
    Flex,
} from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import MultipleAreaCharts from '../../../../../components/Charts/AreaCharts/MultipleAreaCharts'
import { numericDisplay } from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2ResourcesTrendList } from '../../../../../api/inventory.gen'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
    provider?: any
    timeRange: any
    connections?: []
}

const selectedTrendResourceCategoryAtom = atom<string>('')
export default function GrowthTrend({
    categories,
    provider,
    timeRange,
    connections,
}: IProps) {
    const [growthDeltaType, setGrowthDeltaType] =
        useState<DeltaType>('unchanged')
    const [growthDelta, setGrowthDelta] = useState(0)
    const [selectedResourceCategory, setSelectedResourceCategory] = useAtom(
        selectedTrendResourceCategoryAtom
    )
    const activeCategory =
        selectedResourceCategory === 'All Categories'
            ? ''
            : selectedResourceCategory
    const query = {
        ...(provider && { connector: provider }),
        ...(activeCategory && { tag: [`category=${activeCategory}`] }),
        ...(timeRange.from && {
            startTime: dayjs(timeRange.from).unix(),
        }),
        ...(timeRange.to && { endTime: dayjs(timeRange.to).unix() }),
        ...(connections && { connectionId: connections }),
    }
    const { response: data } = useInventoryApiV2ResourcesTrendList(query)
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const fixTime = (data: any) => {
        const result: any = []
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const item in data) {
            const temp: any = {}
            const day = dayjs(data[item].date).format('DD')
            const month = dayjs(data[item].date).format('MMM')
            temp['Resource Count'] = data[item].count
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
                <div className="flex justify-normal gap-x-2">
                    <Title className="min-w-[7vw] truncate">
                        Growth Trend{' '}
                    </Title>
                    <BadgeDelta deltaType={growthDeltaType}>
                        {numericDisplay(growthDelta)}
                    </BadgeDelta>
                </div>
                <SearchSelect
                    onValueChange={(e) => setSelectedResourceCategory(e)}
                    value={selectedResourceCategory}
                    placeholder="Source Selection"
                    className="max-w-xs mb-6"
                >
                    {categories.map((category) => (
                        <SearchSelectItem
                            key={category.label}
                            value={category.value}
                        >
                            {category.value}
                        </SearchSelectItem>
                    ))}
                </SearchSelect>
            </Flex>
            <MultipleAreaCharts
                // title="Resource Count"
                className="mt-4 h-80"
                index="date"
                yAxisWidth={60}
                categories={['Resource Count']}
                data={fixTime(data) || []}
                colors={['indigo']}
            />
        </Card>
    )
}
