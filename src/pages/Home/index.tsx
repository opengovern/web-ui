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
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useState } from 'react'
import LoggedInLayout from '../../components/LoggedInLayout'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay, priceDisplay } from '../../utilities/numericDisplay'
import {
    useInventoryApiV2CostTrendList,
    useInventoryApiV2ResourcesTrendList,
    useInventoryApiV2ServicesSummaryList,
} from '../../api/inventory.gen'
import { useWorkspaceApiV1WorkspacesLimitsDetail } from '../../api/workspace.gen'
import Spinner from '../../components/Spinner'
import Chart from '../../components/Charts'
import { dateDisplay } from '../../utilities/dateDisplay'

export default function Home() {
    const workspace = useParams<{ ws: string }>().ws
    const [selectedType, setSelectedType] = useState('resource')

    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2ServicesSummaryList({})
    const { response: limits, isLoading: limitsLoading } =
        useWorkspaceApiV1WorkspacesLimitsDetail(workspace || '')
    const { response: resourcesTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2ResourcesTrendList()
    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2CostTrendList()

    const resourceTrendData = () => {
        return (
            resourcesTrend?.map((item) => {
                return {
                    'Resource count': item.count,
                    date: dayjs(item.date).format('MMM DD, YYYY'),
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
                    valueFormatter={priceDisplay}
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
        <LoggedInLayout currentPage="home">
            <Metric>Home</Metric>
            <Grid
                numItems={1}
                numItemsMd={3}
                className="gap-4 w-full mt-6 mb-4"
            >
                <SummaryCard
                    title="Cloud Accounts"
                    metric={numberDisplay(limits?.currentConnections, 0)}
                    loading={limitsLoading}
                />
                <SummaryCard
                    title="Services"
                    metric={numberDisplay(services?.totalCount, 0)}
                    loading={servicesIsLoading}
                />
                <SummaryCard
                    title="Resource Count"
                    metric={numberDisplay(limits?.currentResources, 0)}
                    loading={limitsLoading}
                />
            </Grid>
            <Card>
                <Flex>
                    <Title>Growth Trend</Title>
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
        </LoggedInLayout>
    )
}
