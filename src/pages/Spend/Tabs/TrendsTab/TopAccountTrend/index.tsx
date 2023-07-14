import { Card, Title } from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import {
    exactPriceDisplay,
    priceDisplay,
} from '../../../../../utilities/numericDisplay'
import { filterAtom, spendTimeAtom } from '../../../../../store'
import { useInventoryApiV2CostTrendConnections } from './apiCostTrends'
import { dateDisplay } from '../../../../../utilities/dateDisplay'

export default function TopAccountsTrend() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(spendTimeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const { response: topAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            ...(activeTimeRange.start && {
                startTime: dayjs(activeTimeRange.start.toString()).unix(),
            }),
            ...(activeTimeRange.end && {
                endTime: dayjs(activeTimeRange.end.toString())
                    .endOf('day')
                    .unix(),
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
                    startTime: dayjs(activeTimeRange.start.toString())
                        .unix()
                        .toString(),
                }),
                ...(activeTimeRange.end && {
                    endTime: dayjs(activeTimeRange.end.toString())
                        .endOf('day')
                        .unix()
                        .toString(),
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
        accountsTrends?.forEach((connTrend) => {
            connTrend.trend?.forEach((item) => {
                const date = dayjs(item.date).unix()
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
                    const name =
                        topAccounts?.connections?.find(
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
                        topAccounts?.connections?.map(
                            (conn) => conn.providerConnectionName || ''
                        ) || []
                    }
                    data={trendData()}
                    showAnimation
                    valueFormatter={priceDisplay}
                    showLegend={false}
                />
            )}
        </Card>
    )
}
