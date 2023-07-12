import { useEffect, useState } from 'react'
import {
    BadgeDelta,
    Card,
    DeltaType,
    Flex,
    Subtitle,
    Title,
} from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import {
    exactPriceDisplay,
    numericDisplay,
} from '../../../../../utilities/numericDisplay'
import { useInventoryApiV2CostTrendList } from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { filterAtom, timeAtom } from '../../../../../store'

const getConnections = (con: any) => {
    if (con.provider.length) {
        return con.provider
    }
    if (con.connections.length === 1) {
        return con.connections[0]
    }
    if (con.connections.length) {
        return `${con.connections.length} accounts`
    }
    return 'all accounts'
}

export default function GrowthTrend() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const [growthDeltaType, setGrowthDeltaType] =
        useState<DeltaType>('unchanged')
    const [growthDelta, setGrowthDelta] = useState(0)

    const query = {
        ...(selectedConnections.provider.length && {
            connector: [selectedConnections.provider],
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
        <Card className="mb-3">
            <Flex justifyContent="start" className="gap-x-2">
                <Title>Overall Spend Trend </Title>
                <BadgeDelta deltaType={growthDeltaType}>
                    {numericDisplay(growthDelta)}
                </BadgeDelta>
            </Flex>
            {isLoading ? (
                <Spinner className="h-80" />
            ) : (
                <>
                    <Flex justifyContent="end">
                        <Subtitle>
                            {getConnections(selectedConnections)}
                        </Subtitle>
                    </Flex>
                    <Chart
                        className="mt-3"
                        index="date"
                        type="line"
                        yAxisWidth={120}
                        categories={['count']}
                        showLegend={false}
                        data={fixTime(costTrend) || []}
                        showAnimation
                        valueFormatter={exactPriceDisplay}
                    />
                </>
            )}
        </Card>
    )
}
