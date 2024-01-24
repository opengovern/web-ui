import { Grid } from '@tremor/react'
import { useState } from 'react'
import TopHeader from '../../../components/Layout/Header'
import { toErrorMessage } from '../../../types/apierror'
import { AssetChart } from '../../../components/Asset/Chart'
import {
    ChartLayout,
    Granularity,
} from '../../../components/Spend/Chart/Selectors'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../api/inventory.gen'
import { categoryTrend } from '../Overview'
import MetricTable from './Table'
import {
    defaultTime,
    useFilterState,
    useUrlDateRangeState,
} from '../../../utilities/urlstate'

export default function AssetMetrics() {
    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { value: selectedConnections } = useFilterState()
    const [granularity, setGranularity] = useState<Granularity>('daily')
    const [chartLayout, setChartLayout] = useState<ChartLayout>('metrics')

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'count' | undefined
        endTime: number
        startTime: number
        connectionId: string[]
        connector?: ('AWS' | 'Azure')[] | undefined
    } = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'count',
    }

    const duration =
        activeTimeRange.end.diff(activeTimeRange.start, 'second') + 1
    const prevTimeRange = {
        start: activeTimeRange.start.add(-duration, 'second'),
        end: activeTimeRange.end.add(-duration, 'second'),
    }
    const prevQuery = {
        ...query,
        ...(activeTimeRange.start && {
            startTime: prevTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: prevTimeRange.end.unix(),
        }),
    }

    const {
        response: trendResponse,
        isLoading: trendLoading,
        error: trendError,
        sendNow: trendRefresh,
    } = useInventoryApiV2AnalyticsTrendList({
        ...query,
        granularity,
    })

    const {
        response: serviceResponse,
        isLoading: serviceLoading,
        error: serviceErr,
        sendNow: serviceRefresh,
    } = useInventoryApiV2AnalyticsMetricList(query)

    const {
        response: servicePrevResponse,
        isLoading: servicePrevLoading,
        error: servicePrevErr,
        sendNow: servicePrevRefresh,
    } = useInventoryApiV2AnalyticsMetricList(prevQuery)

    const trend = () => {
        if (chartLayout === 'total' || chartLayout === 'metrics') {
            return trendResponse || []
        }
        if (chartLayout === 'categories') {
            return categoryTrend(trendResponse || [])
        }
        return []
    }
    return (
        <>
            <TopHeader datePicker filter />
            <Grid className="w-full gap-10">
                <AssetChart
                    trend={trend()}
                    title="Total resources"
                    timeRange={activeTimeRange}
                    timeRangePrev={prevTimeRange}
                    total={serviceResponse?.total_count || 0}
                    totalPrev={servicePrevResponse?.total_count || 0}
                    chartLayout={chartLayout}
                    setChartLayout={setChartLayout}
                    validChartLayouts={['total', 'metrics', 'categories']}
                    isLoading={
                        trendLoading || serviceLoading || servicePrevLoading
                    }
                    error={toErrorMessage(
                        trendError,
                        serviceErr,
                        servicePrevErr
                    )}
                    onRefresh={() => {
                        trendRefresh()
                        servicePrevRefresh()
                        serviceRefresh()
                    }}
                    onGranularityChanged={setGranularity}
                />
                <MetricTable
                    timeRange={activeTimeRange}
                    connections={selectedConnections}
                />
            </Grid>
        </>
    )
}
