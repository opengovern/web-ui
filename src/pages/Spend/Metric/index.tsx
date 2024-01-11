import { Col, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import Layout from '../../../components/Layout'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTableList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { SpendChart } from '../../../components/Spend/Chart'
import { toErrorMessage } from '../../../types/apierror'
import { Granularity } from '../../../components/Spend/Chart/Selectors'
import MetricTable from './MetricTable'

export function SpendMetrics() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [chartGranularity, setChartGranularity] =
        useState<Granularity>('daily')
    const [tableGranularity, setTableGranularity] =
        useState<Granularity>('daily')

    const query: {
        pageSize: number
        pageNumber: number
        sortBy: 'cost' | undefined
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
        sortBy: 'cost',
    }

    const duration = activeTimeRange.end.diff(activeTimeRange.start, 'second')
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
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: costTrendRefresh,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity: chartGranularity,
    })

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
        sendNow: serviceCostRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
        sendNow: serviceCostPrevRefresh,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)

    const { response, isLoading } = useInventoryApiV2AnalyticsSpendTableList({
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
        dimension: 'metric',
        granularity: tableGranularity,
        connector: [selectedConnections.provider],
        connectionId: selectedConnections.connections,
        connectionGroup: selectedConnections.connectionGroup,
    })

    return (
        <Layout currentPage="spend/metrics" datePicker filter>
            <Grid numItems={3} className="w-full gap-4">
                <Col numColSpan={3}>
                    <SpendChart
                        costTrend={costTrend || []}
                        costField="metric"
                        title="Total spend"
                        timeRange={activeTimeRange}
                        timeRangePrev={prevTimeRange}
                        total={serviceCostResponse?.total_cost || 0}
                        totalPrev={servicePrevCostResponse?.total_cost || 0}
                        isLoading={
                            costTrendLoading ||
                            serviceCostLoading ||
                            servicePrevCostLoading
                        }
                        error={toErrorMessage(
                            costTrendError,
                            serviceCostErr,
                            servicePrevCostErr
                        )}
                        onRefresh={() => {
                            costTrendRefresh()
                            serviceCostPrevRefresh()
                            serviceCostRefresh()
                        }}
                        onGranularityChanged={setChartGranularity}
                    />
                </Col>
                <Col numColSpan={3}>
                    <MetricTable
                        isLoading={isLoading}
                        response={response}
                        onGranularityChange={setTableGranularity}
                        selectedGranularity={tableGranularity}
                    />
                </Col>
            </Grid>
        </Layout>
    )
}
