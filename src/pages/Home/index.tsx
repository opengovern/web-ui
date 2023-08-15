import {
    Card,
    Flex,
    Grid,
    Metric,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import dayjs from 'dayjs'
import Menu from '../../components/Menu'
import SummaryCard from '../../components/Cards/SummaryCard'
import {
    exactPriceDisplay,
    numberDisplay,
} from '../../utilities/numericDisplay'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../api/inventory.gen'
import { dateDisplay } from '../../utilities/dateDisplay'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'
import { getErrorMessage } from '../../types/apierror'

export default function Home() {
    const start = dayjs.utc().subtract(2, 'week').startOf('day')
    const end = dayjs.utc().endOf('day')

    const [selectedType, setSelectedType] = useState('resource')
    const {
        response: services,
        isLoading: servicesIsLoading,
        error: servicesError,
        sendNow: serviceRefresh,
    } = useInventoryApiV2AnalyticsMetricList({
        startTime: start.unix(),
        endTime: end.unix(),
    })
    const {
        response: summary,
        isLoading: limitsLoading,
        error: summaryError,
        sendNow: summaryRefresh,
    } = useOnboardApiV1ConnectionsSummaryList({
        pageSize: 0,
        pageNumber: 1,
        startTime: start.unix(),
        endTime: end.unix(),
    })
    const {
        response: resourcesTrend,
        isLoading: resourceTrendLoading,
        error: trendError,
        sendNow: refreshTrend,
    } = useInventoryApiV2AnalyticsTrendList({
        startTime: start.unix(),
        endTime: end.unix(),
    })
    const {
        response: costTrend,
        isLoading: costTrendLoading,
        error: costTrendError,
        sendNow: refreshCostTrend,
    } = useInventoryApiV2AnalyticsSpendTrendList({
        startTime: start.unix(),
        endTime: end.unix(),
    })

    const resourceTrendChart = () => {
        const label = []
        const data = []
        if (resourcesTrend) {
            for (let i = 0; i < resourcesTrend?.length; i += 1) {
                label.push(dateDisplay(resourcesTrend[i]?.date))
                data.push(resourcesTrend[i]?.count)
            }
        }
        return {
            label,
            data,
        }
    }

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

    const renderChart = (type: string) => {
        console.log(costTrendError, trendError)
        if (type === 'spend') {
            return (
                <Chart
                    labels={costTrendChart().label}
                    chartData={costTrendChart().data}
                    chartType="line"
                    isCost
                    loading={costTrendLoading}
                    error={getErrorMessage(costTrendError)}
                    onRefresh={refreshCostTrend}
                />
            )
        }
        return (
            <Chart
                labels={resourceTrendChart().label}
                chartData={resourceTrendChart().data}
                chartType="line"
                loading={resourceTrendLoading}
                error={getErrorMessage(trendError)}
                onRefresh={refreshTrend}
            />
        )
    }

    return (
        <Menu currentPage="home">
            <Metric>Home</Metric>
            <Grid
                numItems={1}
                numItemsMd={4}
                className="gap-4 w-full mt-6 mb-4"
            >
                <SummaryCard
                    title="Cloud Accounts"
                    metric={numberDisplay(summary?.connectionCount, 0)}
                    loading={limitsLoading}
                    error={getErrorMessage(summaryError)}
                    onRefresh={summaryRefresh}
                    blueBorder
                />
                <SummaryCard
                    title="Services"
                    metric={numberDisplay(services?.total_metrics, 0)}
                    loading={servicesIsLoading}
                    error={getErrorMessage(servicesError)}
                    onRefresh={serviceRefresh}
                    blueBorder
                />
                <SummaryCard
                    title="Resource Count"
                    metric={numberDisplay(summary?.totalResourceCount, 0)}
                    loading={limitsLoading}
                    error={getErrorMessage(summaryError)}
                    onRefresh={summaryRefresh}
                    blueBorder
                />
                <SummaryCard
                    title="Total Spend"
                    metric={exactPriceDisplay(summary?.totalCost, 0)}
                    loading={limitsLoading}
                    error={getErrorMessage(summaryError)}
                    onRefresh={summaryRefresh}
                    blueBorder
                />
            </Grid>
            <Card>
                <Flex>
                    <Title className="font-semibold">Growth Trend</Title>
                    <TabGroup className="w-fit rounded-lg">
                        <TabList variant="solid">
                            <Tab
                                className="pt-0.5 pb-1"
                                onClick={() => setSelectedType('resource')}
                            >
                                <Text>Resource</Text>
                            </Tab>
                            <Tab
                                className="pt-0.5 pb-1"
                                onClick={() => setSelectedType('spend')}
                            >
                                <Text>Spend</Text>
                            </Tab>
                        </TabList>
                    </TabGroup>
                </Flex>
                {renderChart(selectedType)}
            </Card>
        </Menu>
    )
}
