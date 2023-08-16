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
import { filterAtom, spendTimeAtom } from '../../store'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numericDisplay } from '../../utilities/numericDisplay'
import { AreaChartIcon, BarChartIcon, LineChartIcon } from '../../icons/icons'
import { useInventoryApiV2AnalyticsTrendList } from '../../api/inventory.gen'
import { GithubComKaytuIoKaytuEnginePkgInventoryApiResourceTypeTrendDatapoint } from '../../api/api'
import { dateDisplay } from '../../utilities/dateDisplay'
import Chart from '../../components/Chart'

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

export default function Assets() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >('daily')
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('area')
        if (selectedIndex === 2) setSelectedChart('bar')
    }, [selectedIndex])

    const { response: accounts, isLoading: accountIsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            pageSize: 0,
            pageNumber: 1,
            needCost: false,
        })
    const { response: resourceTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList({
            ...(selectedConnections.provider !== '' && {
                connector: [selectedConnections.provider],
            }),
            connectionId: selectedConnections.connections,
            startTime: activeTimeRange.start.unix(),
            endTime: activeTimeRange.end.unix(),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            granularity: selectedGranularity,
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
        </Menu>
    )
}
