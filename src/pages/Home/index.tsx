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
import Spinner from '../../components/Spinner'
import Chart from '../../components/Charts'
import { dateDisplay } from '../../utilities/dateDisplay'
import { isDemo } from '../../utilities/demo'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'

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

    const resourceTrendData = () => {
        return (
            resourcesTrend?.map((item) => {
                return {
                    'Resource count': item.count,
                    date: dateDisplay(item.date),
                }
            }) || []
        )
    }

    const fixTime = (data: any) => {
        const result: any = []
        if (data === undefined) {
            return result
        }
        const keys = Object.keys(data)
        for (let j = 1; j < keys.length; j += 1) {
            const item = keys[j]
            const temp: any = {}
            const title = 'Spent on all accounts'
            temp[title] = data[item].count
            temp.date = dateDisplay(data[item].date)
            result.push(temp)
        }
        return result
    }

    const sortedTrend = () => {
        return costTrend?.sort((a, b) => {
            const au = dayjs(a.date).unix()
            const bu = dayjs(b.date).unix()
            if (au === bu) {
                return 0
            }
            return au > bu ? 1 : -1
        })
    }

    const renderChart = (type: string) => {
        if (type === 'spend') {
            return costTrendLoading ? (
                <Spinner className="h-80" />
            ) : (
                <Chart
                    className="mt-4"
                    index="date"
                    type="line"
                    yAxisWidth={120}
                    categories={['Spent on all accounts']}
                    showLegend={false}
                    data={fixTime(sortedTrend())}
                    showAnimation
                    valueFormatter={exactPriceDisplay}
                />
            )
        }
        return resourceTrendLoading ? (
            <Spinner className="h-80" />
        ) : (
            <Chart
                className="mt-4"
                index="date"
                type="line"
                yAxisWidth={120}
                categories={['Resource count']}
                showLegend={false}
                showAnimation
                data={resourceTrendData()}
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
