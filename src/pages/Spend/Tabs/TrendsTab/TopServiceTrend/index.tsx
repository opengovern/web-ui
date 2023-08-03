import { useEffect, useState } from 'react'
import { Card, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import {
    useInventoryApiV2CostMetricList,
    useInventoryApiV2ServicesCostTrendList,
} from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { priceDisplay } from '../../../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { dateDisplay } from '../../../../../utilities/dateDisplay'
import { isDemo } from '../../../../../utilities/demo'

const MockData = [
    {
        serviceName: 'AWS::EC2::Instance',
        costTrend: [
            {
                count: 12630.07900738,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 190209.2090010504,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 84004.0190028391,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 251256.629002884,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 21630.07900738,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        serviceName: 'Azure::VM',
        costTrend: [
            {
                count: 18459.33402822,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 16902.9981862763,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 14334.44930136404,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 14849.408132466835,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 13420,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        serviceName: 'Microsoft::SQL::Server',
        costTrend: [
            {
                count: 18785.09410023,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 23284.25565629249,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 20741.18638722364,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 18669.12372823586,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 15420,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        serviceName: 'AWS::RDS::Instance',
        costTrend: [
            {
                count: 10925.761236362,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 10834.967310723943,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 19637.34879541858,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 10180.09984875439,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 25312,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        serviceName: 'Application::Server',
        costTrend: [
            {
                count: 11920.15888781,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 17582.857486154,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 15501.050410370262,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 26353.28582341845,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 16010,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
]

type IProps = {
    categories: {
        label: string
        value: string
    }[]
}

export default function TopServicesTrend({ categories }: IProps) {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [serviceNames, setServiceNames] = useState<string[]>([])
    const [trendData, setTrendData] = useState<object[]>([])
    const { response: metrics, isLoading } = useInventoryApiV2CostMetricList({
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
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
                    startTime: activeTimeRange.start.unix().toString(),
                }),
                ...(activeTimeRange.end && {
                    endTime: activeTimeRange.end.unix().toString(),
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
        if (input === undefined) {
            return result
        }

        const services: string[] = []
        if (input) {
            let length = 0
            if (input[0].costTrend) {
                length =
                    input[0].costTrend.length > 5
                        ? 5
                        : input[0].costTrend.length
            }
            for (let i = 0; i < length; i += 1) {
                const temp: any = {}
                const keys = Object.keys(input)
                for (let j = 1; j < keys.length; j += 1) {
                    const item = keys[j]
                    const name = input[item].serviceName
                    if (!services.includes(name)) {
                        services.push(name)
                    }
                    temp[name] = input[item].costTrend[i].count
                    temp.date = dateDisplay(input[item].costTrend[i].date)
                }
                result.push(temp)
            }
        }
        setServiceNames(services)
        setTrendData(result)
        return result
    }

    useEffect(() => {
        fixTime(isDemo() ? MockData : data)
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
