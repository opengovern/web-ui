import { Card, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendMetricsTrendList,
} from '../../../../../api/inventory.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { isDemo } from '../../../../../utilities/demo'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiListServicesCostTrendDatapoint } from '../../../../../api/api'

const MockData: GithubComKaytuIoKaytuEnginePkgInventoryApiListServicesCostTrendDatapoint[] =
    [
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

    // const [serviceNames, setServiceNames] = useState<string[]>([])
    // const [trendData, setTrendData] = useState<object[]>([])
    const { response: metrics, isLoading } =
        useInventoryApiV2AnalyticsSpendMetricList({
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

    const { response: costTrendResponse, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendMetricsTrendList(
            {
                metricIds:
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

    const data = () => {
        return isDemo() ? MockData : costTrendResponse
    }

    const serviceNames = () => {
        const services: string[] = []
        const input = data()
        if (input === undefined || input == null) {
            return services
        }

        input.forEach((item) => {
            const name = item.serviceName || ''
            if (!services.includes(name)) {
                services.push(name)
            }
        })
        return services
    }

    const trendData = () => {
        const result: object[] = []
        const input = data()
        if (input === undefined || input == null) {
            return result
        }

        const dateMap = new Map<string, Map<string, number>>()

        input.forEach((item, index, array) => {
            item.costTrend?.forEach((trend, trendIdx, trendArr) => {
                const key = trend.date || ''
                if (dateMap.has(key)) {
                    const m = dateMap.get(key)
                    if (m !== undefined) {
                        m.set(item.serviceName || '', trend.count || 0)
                        dateMap.set(key, m)
                    }
                } else {
                    dateMap.set(
                        trend.date || '',
                        new Map([[item.serviceName || '', trend.count || 0]])
                    )
                }
            })
        })

        dateMap.forEach((valueMap, date) => {
            const m = new Map<string, string | number>()
            m.set('date', date)

            valueMap.forEach((value, key) => {
                m.set(key, value)
            })

            result.push(Object.entries(m))
        })
        return result
    }

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
                    categories={serviceNames()}
                    data={trendData()}
                    showAnimation
                    valueFormatter={exactPriceDisplay}
                />
            ) : (
                <Spinner className="h-80" />
            )}
        </Card>
    )
}
