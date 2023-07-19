import { useState } from 'react'
import { Card, Flex, MultiSelect, MultiSelectItem, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { useInventoryApiV2ResourcesTrendList } from '../../../../../api/inventory.gen'
import Chart from '../../../../../components/Charts'
import { filterAtom, timeAtom } from '../../../../../store'
import { badgeDelta } from '../../../../../utilities/deltaType'
import Spinner from '../../../../../components/Spinner'
import { dateDisplay } from '../../../../../utilities/dateDisplay'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}

export default function GrowthTrend({ categories }: IProps) {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedResourceCategory, setSelectedResourceCategory] = useState<
        string[]
    >([])
    const activeCategory: string[] = selectedResourceCategory.map(
        (item) => `category=${item}`
    )
    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(activeCategory.length > 0 && {
            tag: activeCategory,
        }),
        ...(activeTimeRange.start && {
            startTime: dayjs(activeTimeRange.start.toString())
                .unix()
                .toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: dayjs(activeTimeRange.end.toString()).unix().toString(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
    }
    const { response: resourcesTrend, isLoading } =
        useInventoryApiV2ResourcesTrendList(query)

    const trendData = () => {
        return (
            resourcesTrend?.map((item) => {
                return {
                    'Resource Count': item.count,
                    date: dateDisplay(item.date),
                }
            }) || []
        )
    }

    return (
        <Card>
            <Flex flexDirection="row">
                <Flex justifyContent="start" className="gap-x-2">
                    <Title>Growth Trend </Title>
                    {!isLoading &&
                        badgeDelta(
                            resourcesTrend?.at(0)?.count,
                            resourcesTrend?.at(
                                (resourcesTrend?.length || 0) - 1
                            )?.count
                        )}
                </Flex>
                <MultiSelect
                    onValueChange={(e) => {
                        setSelectedResourceCategory(e)
                    }}
                    value={selectedResourceCategory}
                    placeholder="Source Selection"
                    className="max-w-xs"
                    disabled={isLoading}
                >
                    {categories.map((category) => (
                        <MultiSelectItem
                            key={category.label}
                            value={category.value}
                        >
                            {category.value}
                        </MultiSelectItem>
                    ))}
                </MultiSelect>
            </Flex>
            {isLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    className="mt-3"
                    index="date"
                    type="line"
                    categories={['Resource Count']}
                    data={trendData()}
                />
            )}
        </Card>
    )
}
