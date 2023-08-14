import React, { useState } from 'react'
import {
    Card,
    Col,
    Flex,
    Grid,
    Metric,
    Select,
    SelectItem,
    Text,
    Title,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import DateRangePicker from '../../components/DateRangePicker'
import Menu from '../../components/Menu'
import {
    useInventoryApiV2AnalyticsSpendCompositionList,
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import { filterAtom, IFilter, spendTimeAtom } from '../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'
import { dateDisplay } from '../../utilities/dateDisplay'
import SummaryCard from '../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../utilities/numericDisplay'
import TopListCard from '../../components/Cards/TopListCard'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiCostTrendDatapoint } from '../../api/api'

const topServices = (metrics: any) => {
    const top = []
    if (metrics) {
        for (let i = 0; i < metrics.length; i += 1) {
            top.push({
                name: metrics[i].cost_dimension_name,
                value: metrics[i].total_cost,
            })
        }
    }
    return top
}

const topAccounts = (metrics: any) => {
    const top = []
    if (metrics) {
        for (let i = 0; i < metrics.length; i += 1) {
            top.push({
                name: metrics[i].providerConnectionName,
                value: metrics[i].cost,
                connector: metrics[i].connector,
            })
        }
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

const pieData = (response: any) => {
    const data: any = []
    if (response) {
        Object.entries(response?.top_values).map(([key, value]) =>
            data.push({
                name: key,
                value: Number(value).toFixed(2),
            })
        )
        data.push({
            name: 'Others',
            value: Number(response.others).toFixed(2),
        })
    }
    return data
}

const getConnections = (con: IFilter) => {
    if (con.provider.length) {
        return con.provider
    }
    if (con.connections.length) {
        return `${con.connections.length} accounts`
    }
    return 'all accounts'
}

export default function Spend() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >('daily')
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

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
        pageSize: 5000,
        pageNumber: 1,
        sortBy: 'cost',
    }

    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendTrendList({
            ...query,
            granularity: selectedGranularity,
        })

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostError,
        sendNow: serviceCostSendNow,
    } = useInventoryApiV2AnalyticsSpendMetricList(query)

    const {
        response: accountCostResponse,
        isLoading: accountCostLoading,
        error: accountCostError,
        sendNow: accountCostSendNow,
    } = useOnboardApiV1ConnectionsSummaryList(query)

    const { response: composition, isLoading: compositionLoading } =
        useInventoryApiV2AnalyticsSpendCompositionList({
            top: 5,
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
    console.log(accountCostResponse)

    return (
        <Menu currentPage="spend">
            <Flex
                flexDirection="row"
                justifyContent="between"
                alignItems="center"
            >
                <Metric>Spend</Metric>
                <Flex flexDirection="row" justifyContent="end">
                    <DateRangePicker isSpend />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Card className="mb-4 mt-6">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={3}>
                        <Flex>
                            <SummaryCard
                                title={`Spend across ${getConnections(
                                    selectedConnections
                                )}`}
                                metric={exactPriceDisplay(
                                    accountCostResponse?.totalCost
                                )}
                                loading={accountCostLoading}
                                url="details#connections"
                                border={false}
                            />
                            <Flex className="border-l border-l-gray-200 pl-4">
                                <SummaryCard
                                    title="Services"
                                    metric={Number(
                                        serviceCostResponse?.total_count
                                    )}
                                    loading={serviceCostLoading}
                                    url="details#services"
                                    border={false}
                                />
                            </Flex>
                        </Flex>
                    </Col>
                    <Col />
                    <Col numColSpan={2}>
                        <Flex
                            flexDirection="col"
                            alignItems="end"
                            className="h-full"
                        >
                            <Grid numItems={2} className="gap-4">
                                <Select
                                    value={selectedGranularity}
                                    onValueChange={(v) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setSelectedGranularity(v)
                                    }}
                                >
                                    <SelectItem value="daily">
                                        <Text>Daily</Text>
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        <Text>Monthly</Text>
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                        <Text>Yearly</Text>
                                    </SelectItem>
                                </Select>
                                <Select
                                    value={selectedChart}
                                    onValueChange={(v) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setSelectedChart(v)
                                    }}
                                >
                                    <SelectItem value="line">
                                        <Text>Line Chart</Text>
                                    </SelectItem>
                                    <SelectItem value="area">
                                        <Text>Area Chart</Text>
                                    </SelectItem>
                                    <SelectItem value="bar">
                                        <Text>Bar Chart</Text>
                                    </SelectItem>
                                </Select>
                            </Grid>
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
                    <Card className="pb-0">
                        <Title className="font-semibold">Breakdown</Title>
                        <Chart
                            labels={[]}
                            chartData={pieData(composition)}
                            chartType="doughnut"
                            isCost
                            loading={compositionLoading}
                        />
                    </Card>
                </Col>
                <Col numColSpan={3} className="h-full">
                    <TopListCard
                        columns={2}
                        count={5}
                        title="Top Accounts"
                        loading={serviceCostLoading}
                        data={topAccounts(accountCostResponse?.connections)}
                        isPrice
                        title2="Top Services"
                        loading2={serviceCostLoading}
                        data2={topServices(serviceCostResponse?.metrics)}
                        isPrice2
                        url="details#connections"
                        url2="details#services"
                    />
                </Col>
            </Grid>
        </Menu>
    )
}
