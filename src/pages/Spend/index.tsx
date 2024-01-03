import { useEffect, useState } from 'react'
import {
    Bold,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import { use } from 'echarts'
import { CheckBadgeIcon, CheckIcon } from '@heroicons/react/24/outline'
import Layout from '../../components/Layout'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../api/inventory.gen'
import { filterAtom, IFilter, spendTimeAtom } from '../../store'
import { useIntegrationApiV1ConnectionsSummariesList } from '../../api/integration.gen'
import Chart from '../../components/Chart'
import { dateDisplay, monthDisplay } from '../../utilities/dateDisplay'
import MetricCard from '../../components/Cards/MetricCard'
import {
    exactPriceDisplay,
    numberDisplay,
} from '../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse,
    SourceType,
} from '../../api/api'
import { BarChartIcon, LineChartIcon } from '../../icons/icons'
import Breakdown from '../../components/Breakdown'
import ListCard from '../../components/Cards/ListCard'
import { checkGranularity, generateItems } from '../../utilities/dateComparator'
import { capitalizeFirstLetter } from '../../utilities/labelMaker'
import Header from '../../components/Header'
import { generateVisualMap } from '../Assets'
import SingleSpendConnection from './Single/SingleConnection'
import FitSelector from '../../components/FitSelector'
import FitSelectorNew from '../../components/FitSelectorNew'

const topServices = (
    input:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse
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
                name: input.metrics[i].cost_dimension_name,
                value: input.metrics[i].total_cost,
                connector: input.metrics[i].connector,
                kaytuId: input.metrics[i].cost_dimension_id,
            })
        }
        top.total = input.total_count
    }
    return top
}

const topAccounts = (
    input:
        | GithubComKaytuIoKaytuEngineServicesIntegrationApiEntityListConnectionsSummaryResponse
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
                name: input.connections[i].providerConnectionName,
                value: input.connections[i].cost,
                connector: input.connections[i].connector,
                id: input.connections[i].providerConnectionID,
                kaytuId: input.connections[i].id,
            })
        }
        top.total = input.connectionCount
    }
    return top
}

export const costTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
        | undefined,
    chart: 'trend' | 'cumulative',
    granularity: 'monthly' | 'daily' | 'yearly'
) => {
    const label = []
    const data: any = []
    const flag = []
    if (trend) {
        if (chart === 'trend') {
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
        if (chart === 'cumulative') {
            for (let i = 0; i < trend?.length; i += 1) {
                label.push(
                    granularity === 'monthly'
                        ? monthDisplay(trend[i]?.date)
                        : dateDisplay(trend[i]?.date)
                )
                if (i === 0) {
                    data.push(trend[i]?.count)
                } else {
                    data.push((trend[i]?.count || 0) + data[i - 1])
                }
            }
        }
    }
    return {
        label,
        data,
        flag,
    }
}

export const pieData = (
    response:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse
        | undefined
) => {
    const data: any[] = []
    if (response && response.top_values) {
        Object.entries(response?.top_values).map(([key, value]) =>
            data.push({
                name: key,
                value: Number(value).toFixed(0),
            })
        )
        data.sort((a, b) => {
            return b.value - a.value
        })
        data.push({
            name: 'Others',
            value: Number(response.others).toFixed(0),
        })
    }
    return data
}

export const getConnections = (con: IFilter) => {
    if (con.provider.length) {
        return `Spend across ${con.provider}`
    }
    if (con.connections.length) {
        return `Spend across ${con.connections.length} accounts`
    }
    return 'Total Spend'
}

export default function Spend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar'>('line')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'daily' | 'monthly' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
            ? 'monthly'
            : 'daily'
    )
    useEffect(() => {
        setSelectedGranularity(
            checkGranularity(activeTimeRange.start, activeTimeRange.end).monthly
                ? 'monthly'
                : 'daily'
        )
    }, [activeTimeRange])

    const generateGranularityList = (
        s = activeTimeRange.start,
        e = activeTimeRange.end
    ) => {
        let List: string[] = []
        if (checkGranularity(s, e).daily) {
            List = [...List, 'daily']
        }
        if (checkGranularity(s, e).monthly) {
            List = [...List, 'monthly']
        }
        if (checkGranularity(s, e).yearly) {
            List = [...List, 'yearly']
        }
        return List
    }

    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)

    const [chartLayout, setChartLayout] = useState<'basic' | 'stacked'>('basic')
    const chartLayoutValues = ['basic', 'stacked']

    const [chartAggregation, setChartAggregation] = useState<
        'trend' | 'cumulative'
    >('trend')
    const chartAggregationValues = ['trend', 'cumulative']

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

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

    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendTrendList({
            ...query,
            granularity: selectedGranularity,
        })

    const { response: serviceCostResponse, isLoading: serviceCostLoading } =
        useInventoryApiV2AnalyticsSpendMetricList(query)

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
        <Layout currentPage="spend">
            <Header datePicker filter />
            {selectedConnections.connections.length === 1 ? (
                <SingleSpendConnection
                    activeTimeRange={activeTimeRange}
                    id={selectedConnections.connections[0]}
                />
            ) : (
                <>
                    <Card className="mb-4">
                        <Grid numItems={6} className="gap-4">
                            <Col numColSpan={2}>
                                <MetricCard
                                    title={getConnections(selectedConnections)}
                                    metric={serviceCostResponse?.total_cost}
                                    // Check with Saleh
                                    metricPrev="2000"
                                    loading={serviceCostLoading}
                                    url="spend-details#cloud-accounts"
                                    isPrice
                                    isExact
                                    border={false}
                                />
                            </Col>
                            <Col numColSpan={4}>
                                <Flex justifyContent="end" className="gap-0">
                                    <FitSelectorNew
                                        values={generateGranularityList(
                                            activeTimeRange.start,
                                            activeTimeRange.end
                                        )}
                                        value={selectedGranularity}
                                        title="Granularity  "
                                        onValueChange={(v) => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            setSelectedGranularity(v)
                                        }}
                                    />

                                    <FitSelectorNew
                                        values={chartLayoutValues.map(
                                            (value) => value
                                        )}
                                        value={chartLayout}
                                        title="Categorization"
                                        onValueChange={(v) => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            setChartLayout(v)
                                        }}
                                    />

                                    <FitSelectorNew
                                        values={chartAggregationValues.map(
                                            (value) => value
                                        )}
                                        value={chartAggregation}
                                        title="Data Aggregation"
                                        onValueChange={(v) => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            setChartAggregation(v)
                                        }}
                                    />

                                    <TabGroup
                                        index={selectedIndex}
                                        onIndexChange={setSelectedIndex}
                                        className="w-fit rounded-lg ml-2"
                                    >
                                        <TabList variant="solid">
                                            <Tab value="line">
                                                <LineChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                                            </Tab>
                                            <Tab value="bar">
                                                <BarChartIcon className="h-4 w-4 m-0.5 my-1.5" />
                                            </Tab>
                                        </TabList>
                                    </TabGroup>
                                </Flex>
                            </Col>
                        </Grid>
                        {costTrend
                            ?.filter(
                                (t) =>
                                    selectedDatapoint?.color === '#E01D48' &&
                                    dateDisplay(t.date) ===
                                        selectedDatapoint?.name
                            )
                            .map((t) => (
                                <Callout
                                    color="rose"
                                    title="Incomplete data"
                                    className="w-fit mt-4"
                                >
                                    Checked{' '}
                                    {numberDisplay(
                                        t.totalSuccessfulDescribedConnectionCount,
                                        0
                                    )}{' '}
                                    accounts out of{' '}
                                    {numberDisplay(t.totalConnectionCount, 0)}{' '}
                                    on {dateDisplay(t.date)}
                                </Callout>
                            ))}
                        <Flex justifyContent="end" className="mt-2 gap-2.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-kaytu-950" />
                            {chartAggregation === 'cumulative' ? (
                                <Text>Accumulated spend</Text>
                            ) : (
                                <Text>Spend</Text>
                            )}
                        </Flex>
                        <Chart
                            labels={
                                costTrendChart(
                                    costTrend,
                                    chartAggregation,
                                    selectedGranularity
                                ).label
                            }
                            chartData={
                                costTrendChart(
                                    costTrend,
                                    chartAggregation,
                                    selectedGranularity
                                ).data
                            }
                            chartType={selectedChart}
                            chartLayout={chartLayout}
                            chartAggregation={chartAggregation}
                            isCost
                            loading={costTrendLoading}
                            visualMap={
                                chartAggregation === 'cumulative'
                                    ? undefined
                                    : generateVisualMap(
                                          costTrendChart(
                                              costTrend,
                                              chartAggregation,
                                              selectedGranularity
                                          ).flag,
                                          costTrendChart(
                                              costTrend,
                                              chartAggregation,
                                              selectedGranularity
                                          ).label
                                      ).visualMap
                            }
                            markArea={
                                chartAggregation === 'cumulative'
                                    ? undefined
                                    : generateVisualMap(
                                          costTrendChart(
                                              costTrend,
                                              chartAggregation,
                                              selectedGranularity
                                          ).flag,
                                          costTrendChart(
                                              costTrend,
                                              chartAggregation,
                                              selectedGranularity
                                          ).label
                                      ).markArea
                            }
                            onClick={
                                chartAggregation === 'cumulative'
                                    ? undefined
                                    : (p) => setSelectedDatapoint(p)
                            }
                        />
                    </Card>
                    <Grid numItems={5} className="w-full gap-4">
                        <Col numColSpan={2}>
                            <Breakdown
                                chartData={pieData(composition)}
                                loading={compositionLoading}
                                seeMore="spend-details#category"
                                isCost
                            />
                        </Col>
                        <Col numColSpan={3} className="h-full">
                            <Grid numItems={2} className="w-full h-full gap-4">
                                <ListCard
                                    title="Top Cloud Accounts"
                                    firstColumnTitle="Account Names"
                                    secondColumnTitle="Spend"
                                    loading={accountCostLoading}
                                    items={topAccounts(accountCostResponse)}
                                    url="spend-details#cloud-accounts"
                                    type="account"
                                    isPrice
                                />
                                <ListCard
                                    title="Top Metrics"
                                    firstColumnTitle="Mertic Names"
                                    secondColumnTitle="Spend"
                                    loading={serviceCostLoading}
                                    items={topServices(serviceCostResponse)}
                                    url="spend-details#metrics"
                                    type="service"
                                    isPrice
                                />
                            </Grid>
                        </Col>
                    </Grid>
                </>
            )}
        </Layout>
    )
}
