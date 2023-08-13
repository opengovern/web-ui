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
import { snakeCaseToLabel } from '../../utilities/labelMaker'

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
            })
        }
    }
    return top
}

const pieData = (response: any) => {
    const data: any = []
    if (response) {
        Object.entries(response?.top_values).map(([key, value]) =>
            data.push({
                name: snakeCaseToLabel(key),
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

export default function Spend() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix().toString(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix().toString(),
        }),
        pageSize: 5000,
        pageNumber: 1,
        sortBy: 'cost',
    }

    const { response: costTrend, isLoading } =
        useInventoryApiV2AnalyticsSpendTrendList(query)

    const {
        response: serviceCostResponse,
        isLoading: serviceCostLoading,
        error: serviceCostError,
        sendNow: serviceCostSendNow,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
    } = useInventoryApiV2AnalyticsSpendMetricList(query)

    const {
        response: accountCostResponse,
        isLoading: accountCostLoading,
        error: accountCostError,
        sendNow: accountCostSendNow,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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
                endTime: activeTimeRange.end.unix().toString(),
            }),
            ...(activeTimeRange.start && {
                startTime: activeTimeRange.start.unix().toString(),
            }),
        })

    const costTrendChart = () => {
        const label = []
        const data = []
        if (costTrend) {
            for (let i = 0; i < costTrend?.length; i += 1) {
                label.push(dateDisplay(costTrend[i]?.date))
                data.push(costTrend[i]?.count)
            }
        }
        return {
            label,
            data,
        }
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
                                url="spend-metrics#accounts"
                                border={false}
                            />
                            <Flex className="border-l border-l-gray-200 pl-4">
                                <SummaryCard
                                    title="Services"
                                    metric={Number(
                                        serviceCostResponse?.total_count
                                    )}
                                    loading={serviceCostLoading}
                                    url="spend-metrics#services"
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
                                <Select>
                                    <SelectItem value="line">
                                        <Text>Daily</Text>
                                    </SelectItem>
                                    <SelectItem value="area">
                                        <Text>Monthly</Text>
                                    </SelectItem>
                                    <SelectItem value="bar">
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
                            <Flex justifyContent="end" className="mt-6 gap-3">
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-950" />
                                <Text>Accumulated Cost</Text>
                            </Flex>
                        </Flex>
                    </Col>
                </Grid>
                <Chart
                    labels={costTrendChart().label}
                    chartData={costTrendChart().data}
                    chartType={selectedChart}
                    isCost
                />
            </Card>
            <Grid
                numItems={1}
                numItemsMd={2}
                numItemsLg={3}
                className="w-full gap-4"
            >
                <Card>
                    <Title className="font-semibold">Breakdown</Title>
                    <Chart
                        labels={[]}
                        chartData={pieData(composition)}
                        chartType="doughnut"
                        isCost
                    />
                </Card>
                <TopListCard
                    title="Top Accounts"
                    loading={serviceCostLoading}
                    data={topAccounts(accountCostResponse?.connections)}
                    count={5}
                    isPrice
                />
                <TopListCard
                    title="Top Services"
                    loading={serviceCostLoading}
                    data={topServices(serviceCostResponse?.metrics)}
                    count={5}
                    isPrice
                />
            </Grid>
        </Menu>
    )
}
