import { Col, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import Layout from '../../../components/Layout'
import SingleSpendConnection from '../Single/SingleConnection'
import {
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { SpendChart } from '../../../components/Spend/Chart'
import { toErrorMessage } from '../../../types/apierror'
import { Granularity } from '../../../components/Spend/Chart/Selectors'

export function SpendAccounts() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)
    const [granularity, setGranularity] = useState<Granularity>('daily')

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
        granularity,
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

    return (
        <Layout currentPage="spend/accounts" datePicker filter>
            {selectedConnections.connections.length === 1 ? (
                <SingleSpendConnection
                    activeTimeRange={activeTimeRange}
                    id={selectedConnections.connections[0]}
                />
            ) : (
                <Grid numItems={3} className="w-full gap-4">
                    <Col numColSpan={3}>
                        <SpendChart
                            costTrend={costTrend || []}
                            costField="account"
                            title="Total spend"
                            timeRange={activeTimeRange}
                            timeRangePrev={prevTimeRange}
                            total={serviceCostResponse?.total_cost || 0}
                            totalPrev={servicePrevCostResponse?.total_cost || 0}
                            noStackedChart
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
                            onGranularityChanged={setGranularity}
                        />
                    </Col>
                </Grid>
            )}
        </Layout>
    )
}
