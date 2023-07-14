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
import {
    exactPriceDisplay,
    priceDisplay,
} from '../../../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../../../store'

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}

const trendDataAtom = atom<object[]>([])
const serviceNamesAtom = atom<string[]>([])

export default function TopServicesTrend({ categories }: IProps) {
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)

    const [serviceNames, setServiceNames] = useAtom(serviceNamesAtom)
    const [trendData, setTrendData] = useAtom(trendDataAtom)
    const { response: metrics, isLoading } = useInventoryApiV2CostMetricList({
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
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
        pageSize: 5,
        sortBy: 'cost',
    })

    const { response: data, isLoading: costTrendLoading } =
        useInventoryApiV2ServicesCostTrendList(
            {
                services:
                    metrics?.metrics?.map(
                        (metric) => metric.cost_dimension_name || ''
                    ) || [],
                datapointCount: '5',
                ...(selectedConnections.provider && {
                    connector: [selectedConnections.provider],
                }),
                ...(activeTimeRange.start && {
                    startTime: dayjs(activeTimeRange.start.toString())
                        .unix()
                        .toString(),
                }),
                ...(activeTimeRange.end && {
                    endTime: dayjs(activeTimeRange.end.toString())
                        .unix()
                        .toString(),
                }),
                ...(selectedConnections.connections && {
                    connectionId: selectedConnections.connections,
                }),
            },
            {},
            !isLoading
        )

    const fixTime = (input: any) => {
        const result: object[] = []
        if (data === undefined) {
            return result
        }

        const services: string[] = []
        if (input) {
            for (let i = 0; i < 5; i += 1) {
                const temp: any = {}
                const keys = Object.keys(input)
                for (let j = 1; j < keys.length; j += 1) {
                    const item = keys[j]
                    const name = input[item].serviceName
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
            <Title>Top Services Trend</Title>
            {!costTrendLoading ? (
                <Chart
                    className="mt-3"
                    index="date"
                    type="area"
                    yAxisWidth={120}
                    showLegend={false}
                    categories={serviceNames}
                    data={trendData}
                    showAnimation
                    valueFormatter={priceDisplay}
                />
            ) : (
                <Spinner className="h-80" />
            )}
        </Card>
    )
}
