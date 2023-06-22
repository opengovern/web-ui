import React from 'react'
import { Card, SearchSelect, SearchSelectItem, Title } from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import MultipleAreaCharts from '../../../components/Charts/AreaCharts/MultipleAreaCharts'
import { useInventoryApiV2ResourcesTrendList } from '../../../api/inventory.gen'

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

    return (
        <Card>
            <div className="flex justify-normal gap-x-2">
                <Title>Growth Trend in </Title>
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
            </div>
            <MultipleAreaCharts
                title="Resource Count"
                className="mt-4 h-80"
                index="date"
                yAxisWidth={60}
                categories={['count']}
                data={data || []}
                colors={['indigo']}
            />
        </Card>
    )
}
