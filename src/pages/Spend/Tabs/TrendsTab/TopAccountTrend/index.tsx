import { Card, Title } from '@tremor/react'
import { useAtomValue } from 'jotai'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { useInventoryApiV2CostTrendConnections } from './apiCostTrends'
import { dateDisplay } from '../../../../../utilities/dateDisplay'
import { isDemo } from '../../../../../utilities/demo'

const MockData = [
    {
        connectionId: 'James Farmy',
        trend: [
            {
                count: 13630.07900738,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 180209.2090010504,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 8404.0190028391,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 131256.629002884,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 12630.07900738,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        connectionId: 'Brad Yeet',
        trend: [
            {
                count: 17459.33402822,
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
                count: 13849.408132466835,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 12000,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        connectionId: 'FishMango',
        trend: [
            {
                count: 17785.09410023,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 22284.25565629249,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 12741.186538722364,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 10669.123728235869,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 15420,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        connectionId: 'POP2SEE',
        trend: [
            {
                count: 9925.761236362,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 10834.967310723943,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 9637.348795418586,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 10180.09984875439,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 40000,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
    {
        connectionId: 'KABEL',
        trend: [
            {
                count: 10920.15888781,
                date: '2023-07-03T12:00:00Z',
            },
            {
                count: 19582.857486154,
                date: '2023-07-08T12:00:00Z',
            },
            {
                count: 12501.050410370262,
                date: '2023-07-14T12:00:00Z',
            },
            {
                count: 19353.28582341845,
                date: '2023-07-26T12:00:00Z',
            },
            {
                count: 16010,
                date: '2023-08-03T12:00:00Z',
            },
        ],
    },
]
export default function TopAccountsTrend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const { response: topAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections?.connections,
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix(),
            }),
            ...(activeTimeRange.end && {
                endTime: activeTimeRange.end.unix(),
            }),
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'cost',
        })

    const { response: accountsTrends, isLoading: accountsTrendsLoading } =
        useInventoryApiV2CostTrendConnections(
            topAccounts?.connections?.map((conn) => conn?.id || ''),
            {
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
            },
            {},
            !isLoadingTopAccount
        )

    const trendData = () => {
        const dateMaps = new Map<
            number,
            { connectionId: string; value: number }[]
        >()
        // eslint-disable-next-line no-unused-expressions
        isDemo()
            ? MockData?.forEach((connTrend) => {
                  connTrend.trend?.forEach((item) => {
                      const date = dayjs(item.date).unix() * 1000
                      const arr = dateMaps.get(date) || []
                      dateMaps.set(date, [
                          ...arr,
                          {
                              connectionId: connTrend.connectionId,
                              value: item.count || 0,
                          },
                      ])
                  })
              })
            : accountsTrends?.forEach((connTrend) => {
                  connTrend.trend?.forEach((item) => {
                      const date = dayjs(item.date).unix() * 1000
                      const arr = dateMaps.get(date) || []
                      dateMaps.set(date, [
                          ...arr,
                          {
                              connectionId: connTrend.connectionId,
                              value: item.count || 0,
                          },
                      ])
                  })
              })

        return Array.from(dateMaps)
            .sort((a, b) => {
                if (a[0] === b[0]) {
                    return 0
                }
                return a[0] > b[0] ? 1 : -1
            })
            .map(([date, valueArray]) => {
                const trendMap = new Map<string, string | number>()
                trendMap.set('date', dateDisplay(date))
                valueArray.forEach((item) => {
                    const name = isDemo()
                        ? item.connectionId
                        : topAccounts?.connections?.find(
                              (conn) => conn.id === item.connectionId
                          )?.providerConnectionName || item.connectionId
                    trendMap.set(name, item.value)
                })
                return Object.fromEntries(trendMap)
            })
            .flat()
    }

    return (
        <Card className="mb-3">
            <Title>Top Accounts Trend</Title>
            {accountsTrendsLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    className="mt-3"
                    index="date"
                    type="area"
                    yAxisWidth={120}
                    connectNulls
                    categories={
                        isDemo()
                            ? MockData.map((conn) => conn.connectionId)
                            : topAccounts?.connections?.map(
                                  (conn) => conn.providerConnectionName || ''
                              ) || []
                    }
                    data={trendData()}
                    showAnimation
                    valueFormatter={exactPriceDisplay}
                    showLegend={false}
                />
            )}
        </Card>
    )
}
