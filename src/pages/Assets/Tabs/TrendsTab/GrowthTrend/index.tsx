import { useState } from 'react'
import { Card, Flex, MultiSelect, MultiSelectItem, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useInventoryApiV2AnalyticsTrendList } from '../../../../../api/inventory.gen'
import Chart from '../../../../../components/Charts'
import { filterAtom, timeAtom } from '../../../../../store'
import { badgeDelta } from '../../../../../utilities/deltaType'
import Spinner from '../../../../../components/Spinner'
import { dateDisplay } from '../../../../../utilities/dateDisplay'
import { isDemo } from '../../../../../utilities/demo'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}
const resourcesTrend2 = [
    {
        count: 349054,
        date: '2023-07-27T12:00:00Z',
    },
    {
        count: 447802,
        date: '2023-07-28T12:00:00Z',
    },
    {
        count: 569084,
        date: '2023-07-29T12:00:00Z',
    },
    {
        count: 169669,
        date: '2023-07-30T12:00:00Z',
    },
    {
        count: 257643,
        date: '2023-07-31T12:00:00Z',
    },
    {
        count: 674350,
        date: '2023-08-01T12:00:00Z',
    },
    {
        count: 970058,
        date: '2023-08-02T12:00:00Z',
    },
    {
        count: 1093813,
        date: '2023-08-03T12:00:00Z',
    },
]

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
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
    }
    const { response: resourcesTrend, isLoading } =
        useInventoryApiV2AnalyticsTrendList(query)

    const trendData = () => {
        return isDemo()
            ? resourcesTrend2.map((item) => {
                  return {
                      'Resource Count': item.count,
                      date: dateDisplay(item.date),
                  }
              })
            : resourcesTrend?.map((item) => {
                  return {
                      'Resource Count': item.count,
                      date: dateDisplay(item.date),
                  }
              }) || []
    }

    return (
        <Card>
            <Flex flexDirection="row">
                <Flex justifyContent="start" className="gap-x-2">
                    <Title>Growth Trend </Title>
                    {!isLoading &&
                        badgeDelta(
                            isDemo()
                                ? resourcesTrend2?.at(0)?.count
                                : resourcesTrend?.at(0)?.count,
                            isDemo()
                                ? resourcesTrend2?.at(
                                      (resourcesTrend2?.length || 0) - 1
                                  )?.count
                                : resourcesTrend?.at(
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
