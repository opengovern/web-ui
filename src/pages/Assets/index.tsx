import {
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Select,
    Tab,
    TabGroup,
    TabList,
    Text,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { filterAtom, timeAtom } from '../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import { BarChartIcon, LineChartIcon } from '../../icons/icons'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../api/inventory.gen'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    SourceType,
} from '../../api/api'
import { dateDisplay, monthDisplay } from '../../utilities/dateDisplay'
import Chart from '../../components/Chart'
import Breakdown from '../../components/Breakdown'
import ListCard from '../../components/Cards/ListCard'
import { checkGranularity, generateItems } from '../../utilities/dateComparator'
import { capitalizeFirstLetter } from '../../utilities/labelMaker'
import Header from '../../components/Header'
import SingleConnection from './Single/SingleConnection'
import Trends from '../../components/Trends'

export const resourceTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[]
        | undefined,
    granularity: 'monthly' | 'daily' | 'yearly'
) => {
    const label = []
    const data: any = []
    const flag = []
    if (trend) {
        for (let i = 0; i < trend?.length; i += 1) {
            label.push(
                granularity === 'monthly'
                    ? monthDisplay(trend[i]?.date)
                    : dateDisplay(trend[i]?.date)
            )
            data.push(trend[i]?.count)
            if (
                trend[i].totalConnectionCount !==
                trend[i].totalSuccessfulDescribedConnectionCount
            ) {
                flag.push(true)
            } else flag.push(false)
        }
    }
    return {
        label,
        data,
        flag,
    }
}

export const generateVisualMap = (flag: boolean[], label: string[]) => {
    const pieces = []
    const data = []
    if (flag) {
        for (let i = 0; i < flag.length; i += 1) {
            pieces.push({
                gt: i - 1,
                lte: i,
                color: flag[i] ? '#E01D48' : '#1D4F85',
            })
        }
        for (let i = 0; i < pieces.length; i += 1) {
            if (pieces[i].color === '#E01D48') {
                data.push([
                    { xAxis: label[pieces[i].gt < 0 ? 0 : pieces[i].gt] },
                    { xAxis: label[pieces[i].lte] },
                ])
            }
        }
    }
    return {
        visualMap: pieces.length
            ? { show: false, dimension: 0, pieces }
            : undefined,
        markArea: data.length
            ? {
                  itemStyle: {
                      color: 'rgba(255, 173, 177, 0.1)',
                  },
                  data,
              }
            : undefined,
    }
}

export const pieData = (
    response:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse
        | undefined
) => {
    const newData: any[] = []
    const oldData: any[] = []

    if (response && response.top_values) {
        // eslint-disable-next-line array-callback-return
        Object.entries(response?.top_values).map(([key, value]) => {
            newData.push({
                name: key,
                value: Number(value.count).toFixed(0),
            })
            oldData.push({
                name: key,
                value: Number(value.old_count).toFixed(0),
            })
        })
        newData.sort((a, b) => {
            return b.value - a.value
        })
        oldData.sort((a, b) => {
            return b.value - a.value
        })
        newData.push({
            name: 'Others',
            value: Number(response.others?.count).toFixed(0),
        })
        oldData.push({
            name: 'Others',
            value: Number(response.others?.old_count).toFixed(0),
        })
    }
    return { newData, oldData }
}

const topAccounts = (
    input:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse
        | undefined
) => {
    const top: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType | undefined
            id: string | undefined
            kaytuId: string | undefined
        }[]
        total: number | undefined
    } = { data: [], total: 0 }
    if (input && input.connections) {
        for (let i = 0; i < input.connections.length; i += 1) {
            top.data.push({
                kaytuId: input.connections[i].id,
                name: input.connections[i].providerConnectionName,
                value: input.connections[i].resourceCount,
                connector: input.connections[i].connector,
                id: input.connections[i].providerConnectionID,
            })
        }
        top.total = input.totalOnboardedCount
    }
    return top
}

const topServices = (
    input:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListMetricsResponse
        | undefined
) => {
    const top: {
        data: {
            name: string | undefined
            value: number | undefined
            connector: SourceType[] | undefined
            kaytuId: string | undefined
        }[]
        total: number | undefined
    } = { data: [], total: 0 }
    if (input && input.metrics) {
        for (let i = 0; i < input.metrics.length; i += 1) {
            top.data.push({
                name: input.metrics[i].name,
                value: input.metrics[i].count,
                connector: input.metrics[i]?.connectors,
                kaytuId: input.metrics[i]?.id,
            })
        }
        top.total = input.total_metrics
    }
    return top
}

export default function Assets() {
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections.connections,
        connectionGroup: selectedConnections.connectionGroup,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    }

    const { response: resourceTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList({
            ...query,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            granularity: selectedGranularity,
        })
    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsCompositionDetail('category', {
            ...query,
            top: 4,
        })
    const { response: accountsResponse, isLoading: accountsResponseLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...query,
            pageSize: 5,
            pageNumber: 1,
            needCost: false,
            sortBy: 'resource_count',
        })
    const { response: servicesResponse, isLoading: servicesResponseLoading } =
        useInventoryApiV2AnalyticsMetricList({
            ...query,
            pageSize: 5,
            pageNumber: 1,
            sortBy: 'count',
        })

    return (
        <Layout currentPage="assets">
            <Header datePicker filter />
            {selectedConnections.connections.length === 1 ? (
                <SingleConnection
                    activeTimeRange={activeTimeRange}
                    id={selectedConnections.connections[0]}
                />
            ) : (
                <>
                    <Trends
                        activeTimeRange={activeTimeRange}
                        trend={resourceTrend}
                        trendName="Resources"
                        firstKPI={
                            <SummaryCard
                                title="Resources"
                                metric={servicesResponse?.total_count}
                                metricPrev={servicesResponse?.total_old_count}
                                url="assets-details#resources"
                                loading={servicesResponseLoading}
                                border={false}
                            />
                        }
                        secondKPI={
                            <SummaryCard
                                title="Accounts"
                                metric={accountsResponse?.totalOnboardedCount}
                                metricPrev={
                                    accountsResponse?.totalDiscoveredCount
                                }
                                url="assets-details#cloud-accounts"
                                loading={accountsResponseLoading}
                                border={false}
                            />
                        }
                        labels={
                            resourceTrendChart(
                                resourceTrend,
                                selectedGranularity
                            ).label
                        }
                        chartData={
                            resourceTrendChart(
                                resourceTrend,
                                selectedGranularity
                            ).data
                        }
                        loading={resourceTrendLoading}
                        onGranularityChange={(gra) =>
                            setSelectedGranularity(gra)
                        }
                    />
                    <Grid
                        numItems={1}
                        numItemsLg={5}
                        className="w-full gap-4 mt-4"
                    >
                        <Col numColSpan={1} numColSpanLg={2}>
                            <Breakdown
                                chartData={pieData(composition).newData}
                                oldChartData={pieData(composition).oldData}
                                activeTime={activeTimeRange}
                                loading={compositionLoading}
                                seeMore="assets-details#category"
                            />
                        </Col>
                        <Col numColSpan={1} numColSpanLg={3} className="h-full">
                            <Grid numItems={2} className="w-full h-full gap-4">
                                <ListCard
                                    title="Top Cloud Accounts"
                                    loading={accountsResponseLoading}
                                    items={topAccounts(accountsResponse)}
                                    url="assets-details#cloud-accounts"
                                    type="account"
                                />
                                <ListCard
                                    title="Top Metrics"
                                    loading={servicesResponseLoading}
                                    items={topServices(servicesResponse)}
                                    url="assets-details#resources"
                                    type="service"
                                />
                            </Grid>
                        </Col>
                    </Grid>
                </>
            )}
        </Layout>
    )
}
