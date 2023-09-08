import { useEffect, useState } from 'react'
import {
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
import Menu from '../../components/Menu'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../api/inventory.gen'
import { filterAtom, IFilter, spendTimeAtom } from '../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'
import { dateDisplay } from '../../utilities/dateDisplay'
import SummaryCard from '../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../utilities/numericDisplay'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiListCostMetricsResponse,
    GithubComKaytuIoKaytuEnginePkgOnboardApiListConnectionSummaryResponse,
    SourceType,
} from '../../api/api'
import { AreaChartIcon, BarChartIcon, LineChartIcon } from '../../icons/icons'
import Breakdown from '../../components/Breakdown'
import ListCard from '../../components/Cards/ListCard'
import { checkGranularity, generateItems } from '../../utilities/dateComparator'
import { capitalizeFirstLetter } from '../../utilities/labelMaker'
import Header from '../../components/Header'

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
        }[]
        total: number | undefined
    } = { data: [], total: 0 }
    if (input && input.metrics) {
        for (let i = 0; i < input.metrics.length; i += 1) {
            top.data.push({
                name: input.metrics[i].cost_dimension_name,
                value: input.metrics[i].total_cost,
                connector: input.metrics[i]?.connector,
            })
        }
        top.total = input.total_count
    }
    return top
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
                name: input.connections[i].providerConnectionName,
                value: input.connections[i].cost,
                connector: input.connections[i].connector,
                id: input.connections[i].providerConnectionID,
                kaytuId: input.connections[i].id,
            })
        }
        top.total = input.totalDiscoveredCount
    }
    return top
}

const costTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint[]
        | undefined,
    chart: 'line' | 'bar' | 'area'
) => {
    const label = []
    const data: any = []
    if (trend) {
        if (chart === 'bar' || chart === 'line') {
            for (let i = 0; i < trend?.length; i += 1) {
                label.push(dateDisplay(trend[i]?.date))
                data.push(trend[i]?.count)
            }
        }
        if (chart === 'area') {
            for (let i = 0; i < trend?.length; i += 1) {
                label.push(dateDisplay(trend[i]?.date))
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
                name: `${key} - ${Math.abs(
                    (Math.round(value) /
                        Math.round(response.total_cost_value || 1)) *
                        100
                ).toFixed(1)}%`,
                value: Number(value).toFixed(0),
            })
        )
        data.sort((a, b) => {
            return b.value - a.value
        })
        data.push({
            name: `Others - ${Math.abs(
                (Math.round(response.others || 0) /
                    Math.round(response.total_cost_value || 1)) *
                    100
            ).toFixed(1)}%`,
            value: Number(response.others).toFixed(0),
        })
    }
    return data
}

const getConnections = (con: IFilter) => {
    if (con.provider.length) {
        return `Spend across ${con.provider}`
    }
    if (con.connections.length) {
        return `Spend across ${con.connections.length} accounts`
    }
    return 'Total cost'
}

export default function Spend() {
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'area'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('area')
        if (selectedIndex === 1) setSelectedChart('line')
        if (selectedIndex === 2) setSelectedChart('bar')
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
        useOnboardApiV1ConnectionsSummaryList(query)

    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsSpendCompositionList({
            top: 4,
            ...(selectedConnections.provider && {
                connector: [selectedConnections.provider],
            }),
            ...(selectedConnections.connections && {
                connectionId: selectedConnections.connections,
            }),
            ...(activeTimeRange.start && {
                endTime: activeTimeRange.end.unix(),
            }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix(),
            }),
        })

    return (
        <Menu currentPage="spend">
            <Header datePicker filter />
            <Card className="mb-4">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={1}>
                        <SummaryCard
                            title={getConnections(selectedConnections)}
                            metric={exactPriceDisplay(
                                accountCostResponse?.totalCost
                            )}
                            loading={accountCostLoading}
                            url="spend-details#connections"
                            border={false}
                        />
                    </Col>
                    <Col numColSpan={3} />
                    <Col numColSpan={2}>
                        <Flex
                            flexDirection="col"
                            alignItems="end"
                            className="h-full"
                        >
                            <Flex justifyContent="end" className="gap-4">
                                <Select
                                    value={selectedGranularity}
                                    placeholder={capitalizeFirstLetter(
                                        selectedGranularity
                                    )}
                                    onValueChange={(v) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setSelectedGranularity(v)
                                    }}
                                    className="w-10"
                                >
                                    {generateItems(
                                        activeTimeRange.start,
                                        activeTimeRange.end
                                    )}
                                </Select>
                                <TabGroup
                                    index={selectedIndex}
                                    onIndexChange={setSelectedIndex}
                                    className="w-fit rounded-lg"
                                >
                                    <TabList variant="solid">
                                        <Tab value="area">
                                            <AreaChartIcon className="h-5" />
                                        </Tab>
                                        <Tab value="line">
                                            <LineChartIcon className="h-5" />
                                        </Tab>
                                        <Tab value="bar">
                                            <BarChartIcon className="h-5" />
                                        </Tab>
                                    </TabList>
                                </TabGroup>
                            </Flex>
                            <Flex justifyContent="end" className="mt-6 gap-2.5">
                                <div className="h-2.5 w-2.5 rounded-full bg-kaytu-950" />
                                {selectedChart === 'area' ? (
                                    <Text>Accumulated Cost</Text>
                                ) : (
                                    <Text>Spend</Text>
                                )}
                            </Flex>
                        </Flex>
                    </Col>
                </Grid>
                <Chart
                    labels={costTrendChart(costTrend, selectedChart).label}
                    chartData={costTrendChart(costTrend, selectedChart).data}
                    chartType={selectedChart}
                    isCost
                    loading={costTrendLoading}
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
                            title="Top Accounts"
                            loading={accountCostLoading}
                            items={topAccounts(accountCostResponse)}
                            url="spend-details#connections"
                            type="account"
                            isPrice
                        />
                        <ListCard
                            title="Top Services"
                            loading={serviceCostLoading}
                            items={topServices(serviceCostResponse)}
                            url="spend-details#services"
                            type="service"
                            isPrice
                        />
                    </Grid>
                </Col>
            </Grid>
        </Menu>
    )
}
