import { useEffect, useState } from 'react'
import {
    BadgeDelta,
    Card,
    DeltaType,
    Flex,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { atom, useAtom } from 'jotai'
import dayjs from 'dayjs'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { filterAtom, timeAtom } from '../../../../../store'
import { KaytuProvider, StringToProvider } from '../../../../../types/provider'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}

export default function GrowthTrend({ categories }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const [growthDeltaType, setGrowthDeltaType] =
        useState<DeltaType>('unchanged')
    const [growthDelta, setGrowthDelta] = useState(0)
    const [selectedTrendCostProvider, setSelectedTrendCostProvider] =
        useState<KaytuProvider>('')
    const query = {
        ...(selectedTrendCostProvider && {
            connector: [selectedTrendCostProvider],
        }),
        ...(activeTimeRange.from && {
            startTime: dayjs(activeTimeRange.from).unix().toString(),
        }),
        ...(activeTimeRange.to && {
            endTime: dayjs(activeTimeRange.to).unix().toString(),
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
    }
    const { response: costTrend, isLoading } =
        useInventoryApiV2CostTrendList(query)
    const fixTime = (data: any) => {
        const result: any = []
        if (data === undefined) {
            return result
        }
        const keys = Object.keys(data)
        for (let j = 1; j < keys.length; j += 1) {
            const item = keys[j]
            const temp: any = {}
            const day = dayjs(data[item].date).format('DD')
            const month = dayjs(data[item].date).format('MMM')
            temp.count = data[item].count
            temp.date = `${month} ${day}`
            result.push(temp)
        }
        return result
    }
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
        fixTime(costTrend)
        findDeltaType(costTrend)
    }, [costTrend])

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
                        <Select
                            onValueChange={(e) =>
                                setSelectedTrendCostProvider(
                                    StringToProvider(e)
                                )
                            }
                            placeholder={
                                selectedTrendCostProvider === ''
                                    ? 'All'
                                    : selectedTrendCostProvider
                            }
                            className="max-w-xs mb-6"
                        >
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.label}
                                    value={category.value}
                                >
                                    {category.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>
            </Flex>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <Chart
                    className="mt-4 h-80"
                    index="date"
                    type="line"
                    yAxisWidth={120}
                    categories={['count']}
                    data={fixTime(costTrend) || []}
                    showAnimation
                    valueFormatter={exactPriceDisplay}
                />
            )}
        </Card>
    )
}
