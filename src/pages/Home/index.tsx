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
import dayjs from 'dayjs'
import { useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import Menu from '../../components/Menu'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import {
    useInventoryApiV2AnalyticsMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
    useInventoryApiV2AnalyticsTrendList,
} from '../../api/inventory.gen'
import Spinner from '../../components/Spinner'
import { dateDisplay } from '../../utilities/dateDisplay'
import { isDemo } from '../../utilities/demo'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'

export default function Home() {
    const [selectedType, setSelectedType] = useState('resource')
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2AnalyticsMetricList(
            {},
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )
    const { response: summary, isLoading: limitsLoading } =
        useOnboardApiV1ConnectionsSummaryList(
            {
                pageSize: 0,
                pageNumber: 1,
            },
            {
                ...(isDemo() && { headers: { prefer: 'dynamic=false' } }),
            }
        )
    const { response: resourcesTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList()
    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendTrendList()

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

    const fixTime = (data: any) => {
        const result: any = []
        if (data) {
            const keys = Object.keys(data)
            for (let j = 1; j < keys.length; j += 1) {
                const item = keys[j]
                const temp: any = {}
                const title = 'Spent on all accounts'
                temp[title] = data[item].count
                temp.date = dateDisplay(data[item].date)
                result.push(temp)
            }
        }
        return result
    }

    const sortedTrend = () => {
        return costTrend?.sort((a, b) => {
            const au = dayjs(a.date).unix()
            const bu = dayjs(b.date).unix()
            return au - bu
        })
    }

    const renderChart = (type: string) => {
        if (type === 'spend') {
            return costTrendLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    labels={costTrendChart().label}
                    chartData={costTrendChart().data}
                    chartType="line"
                    isCost
                />
            )
        }
        return resourceTrendLoading ? (
            <Spinner className="h-80" />
        ) : (
            <Chart
                labels={resourceTrendChart().label}
                chartData={resourceTrendChart().data}
                chartType="line"
            />
        )
    }

    return (
        <Menu currentPage="home">
            <Metric>Home</Metric>
            <Grid
                numItems={1}
                numItemsMd={3}
                className="gap-4 w-full mt-6 mb-4"
            >
                <SummaryCard
                    title="Cloud Accounts"
                    metric={numberDisplay(summary?.connectionCount, 0)}
                    loading={limitsLoading}
                />
                <SummaryCard
                    title="Services"
                    metric={numberDisplay(services?.total_metrics, 0)}
                    loading={servicesIsLoading}
                />
                <SummaryCard
                    title="Resource Count"
                    metric={numberDisplay(summary?.totalResourceCount, 0)}
                    loading={limitsLoading}
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
