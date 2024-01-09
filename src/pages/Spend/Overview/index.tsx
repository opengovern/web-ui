import { Col, Grid } from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useState } from 'react'
import Layout from '../../../components/Layout'
import SingleSpendConnection from '../Single/SingleConnection'
import Breakdown from '../../../components/Breakdown'
import ListCard from '../../../components/Cards/ListCard'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../../api/inventory.gen'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../../api/integration.gen'
import { filterAtom, spendTimeAtom } from '../../../store'
import { pieData, topAccounts, topCategories, topServices } from '..'
import { SpendChart } from '../../../components/Spend/Chart'
import { toErrorMessage } from '../../../types/apierror'
import { Granularity } from '../../../components/Spend/Chart/Selectors'

export function SpendOverview() {
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
    } = useInventoryApiV2AnalyticsSpendTrendList({
        ...query,
        granularity,
    })

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostErr,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)
    const {
        response: servicePrevCostResponse,
        isLoading: servicePrevCostLoading,
        error: servicePrevCostErr,
    } = useInventoryApiV2AnalyticsSpendMetricList(prevQuery)

    const { response: accountCostResponse, isLoading: accountCostLoading } =
        useIntegrationApiV1ConnectionsSummariesList(query)

    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsSpendCompositionList({
            top: 4,
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(selectedConnections.connectionGroup && {
                connectionGroup: selectedConnections.connectionGroup,
            }),
            ...(activeTimeRange.start && {
                endTime: activeTimeRange.end.unix(),
            }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix(),
            }),
        })
    return (
        <Layout currentPage="spend" datePicker filter>
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
                            onGranularityChanged={setGranularity}
                        />
                    </Col>
                    <Col numColSpan={1}>
                        <ListCard
                            title="Top Spend Categories"
                            keyColumnTitle="Category"
                            valueColumnTitle="Spend"
                            loading={compositionLoading}
                            items={topCategories(composition)}
                            url="spend-details#category"
                            type="service"
                            isPrice
                        />
                    </Col>
                    <Col numColSpan={1} className="h-full">
                        <ListCard
                            title="Top Cloud Accounts"
                            keyColumnTitle="Account Names"
                            valueColumnTitle="Spend"
                            loading={accountCostLoading}
                            items={topAccounts(accountCostResponse)}
                            url="spend-details#cloud-accounts"
                            type="account"
                            isPrice
                        />
                    </Col>
                    <Col numColSpan={1} className="h-full">
                        <ListCard
                            title="Top Metrics"
                            keyColumnTitle="Mertic Names"
                            valueColumnTitle="Spend"
                            loading={serviceCostLoading}
                            items={topServices(serviceCostResponse)}
                            url="spend-details#metrics"
                            type="service"
                            isPrice
                        />
                    </Col>
                </Grid>
            )}
        </Layout>
    )
}
