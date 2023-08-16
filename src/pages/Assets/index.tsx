import {
    Card,
    Col,
    Flex,
    Grid,
    Metric,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
} from '@tremor/react'
import { useAtomValue } from 'jotai/index'
import { useEffect, useState } from 'react'
import DateRangePicker from '../../components/DateRangePicker'
import Menu from '../../components/Menu'
import ConnectionList from '../../components/ConnectionList'
import { filterAtom, timeAtom } from '../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numericDisplay } from '../../utilities/numericDisplay'
import { AreaChartIcon, BarChartIcon, LineChartIcon } from '../../icons/icons'
import {
    useInventoryApiV2AnalyticsCompositionDetail,
    useInventoryApiV2AnalyticsTrendList,
} from '../../api/inventory.gen'
import {
    GithubComKaytuIoKaytuEnginePkgInventoryApiListResourceTypeCompositionResponse,
    GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint,
} from '../../api/api'
import { dateDisplay } from '../../utilities/dateDisplay'
import Chart from '../../components/Chart'
import Breakdown from '../../components/Breakdown'

const resourceTrendChart = (
    trend:
        | GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint[]
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

const pieData = (
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
                name: `${key} - ${Math.abs(
                    (Math.round(value.count || 0) /
                        Math.round(response.total_count || 1)) *
                        100
                ).toFixed(1)}%`,
                value: Number(value.count).toFixed(0),
            })
            oldData.push({
                name: `${key} - ${Math.abs(
                    (Math.round(value.old_count || 0) /
                        Math.round(response.total_count || 1)) *
                        100
                ).toFixed(1)}%`,
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
            name: `Others - ${Math.abs(
                (Math.round(response?.others?.count || 0) /
                    Math.round(response.total_count || 1)) *
                    100
            ).toFixed(1)}%`,
            value: Number(response.others?.count).toFixed(0),
        })
        oldData.push({
            name: `Others - ${Math.abs(
                (Math.round(response?.others?.old_count || 0) /
                    Math.round(response.total_count || 1)) *
                    100
            ).toFixed(1)}%`,
            value: Number(response.others?.old_count).toFixed(0),
        })
    }
    return { newData, oldData }
}

export default function Assets() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >('daily')
    const activeTimeRange = useAtomValue(timeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('area')
        if (selectedIndex === 2) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections.connections,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    }

    const { response: accounts, isLoading: accountIsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...query,
            pageSize: 0,
            pageNumber: 1,
            needCost: false,
        })
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

    return (
        <Menu currentPage="assets">
            <Flex>
                <Metric>Assets</Metric>
                <Flex justifyContent="end" alignItems="start">
                    <DateRangePicker />
                    <ConnectionList />
                </Flex>
            </Flex>
            <Card className="mb-4 mt-6">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={1}>
                        <SummaryCard
                            title="Accounts"
                            metric={numericDisplay(accounts?.connectionCount)}
                            url="accounts-detail"
                            loading={accountIsLoading}
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
                                    onValueChange={(v) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setSelectedGranularity(v)
                                    }}
                                    className="w-10"
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
                                <TabGroup
                                    index={selectedIndex}
                                    onIndexChange={setSelectedIndex}
                                    className="w-fit rounded-lg"
                                >
                                    <TabList variant="solid">
                                        <Tab value="line">
                                            <LineChartIcon className="h-5" />
                                        </Tab>
                                        <Tab value="area">
                                            <AreaChartIcon className="h-5" />
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
                                    <Text>Accumulated resources</Text>
                                ) : (
                                    <Text>Resources</Text>
                                )}
                            </Flex>
                        </Flex>
                    </Col>
                </Grid>
                <Chart
                    labels={
                        resourceTrendChart(resourceTrend, selectedChart).label
                    }
                    chartData={
                        resourceTrendChart(resourceTrend, selectedChart).data
                    }
                    chartType={selectedChart}
                    loading={resourceTrendLoading}
                />
            </Card>
            <Grid numItems={5} className="w-full gap-4">
                <Col numColSpan={2}>
                    <Breakdown
                        chartData={pieData(composition).newData}
                        oldChartData={pieData(composition).oldData}
                        activeTime={activeTimeRange}
                        loading={compositionLoading}
                        seeMore="details"
                    />
                </Col>
            </Grid>
        </Menu>
    )
}
