import { Card, Divider, Flex, Text, Title } from '@tremor/react'
import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import Spinner from '../../../../../components/Spinner'
import Chart from '../../../../../components/Charts'
import { exactPriceDisplay } from '../../../../../utilities/numericDisplay'
import { filterAtom, timeAtom } from '../../../../../store'
import { useInventoryApiV2CostTrendConnections } from './apiCostTrends'

export default function TopAccountsTrend() {
    const [activeTimeRange, setActiveTimeRange] = useAtom(timeAtom)
    const [selectedConnections, setSelectedConnections] = useAtom(filterAtom)
    const { response: topAccounts, isLoading: isLoadingTopAccount } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: [selectedConnections?.provider],
            connectionId: selectedConnections?.connections,
            ...(activeTimeRange.from && {
                startTime: dayjs(activeTimeRange.from).unix(),
            }),
            ...(activeTimeRange.to && {
                endTime: dayjs(activeTimeRange.to).unix(),
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
                ...(activeTimeRange.from && {
                    startTime: dayjs(activeTimeRange.from).unix().toString(),
                }),
                ...(activeTimeRange.to && {
                    endTime: dayjs(activeTimeRange.to).unix().toString(),
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
                trendMap.set('date', dayjs.unix(date).format('DD MMM'))
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
        <Card>
            <Flex justifyContent="between" alignItems="start">
                <div className="flex justify-normal gap-x-2 items-center">
                    <Title className="min-w-[7vw]">Top Accounts Trend </Title>
                </div>
            </Flex>
            {accountsTrendsLoading ? (
                <div className="flex items-center justify-center">
                    <Spinner />
                </div>
            ) : (
                <Chart
                    className="mt-4 h-80"
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
                    valueFormatter={exactPriceDisplay}
                    showLegend={false}
                />
            )}
        </Card>
    )
}
