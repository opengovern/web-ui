import {
    AreaChart,
    BadgeDelta,
    Card,
    CategoryBar,
    Col,
    Divider,
    Flex,
    Grid,
    Metric,
    MultiSelect,
    MultiSelectItem,
    Select,
    SelectItem,
    Subtitle,
    Text,
    Title,
} from '@tremor/react'
import { Link, useParams } from 'react-router-dom'
import { ArrowSmallRightIcon } from '@heroicons/react/24/solid'
import LoggedInLayout from '../../components/LoggedInLayout'
import SummaryCard from '../../components/Cards/SummaryCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import { useInventoryApiV2ServicesSummaryList } from '../../api/inventory.gen'
import { useWorkspaceApiV1WorkspacesLimitsDetail } from '../../api/workspace.gen'
import { badgeDelta } from '../../utilities/deltaType'
import Spinner from '../../components/Spinner'
import Chart from '../../components/Charts'

export default function Home() {
    const workspace = useParams<{ ws: string }>().ws
    const { response: services, isLoading: servicesIsLoading } =
        useInventoryApiV2ServicesSummaryList({})
    const { response: limits, isLoading: limitsLoading } =
        useWorkspaceApiV1WorkspacesLimitsDetail(workspace || '')

    const isLoading = false

    const compliances = [
        {
            benchmark: 'CIS v1.3.0',
            severities: [30, 20, 15, 15, 10, 10],
            successfulChecks: 40,
            totalChecks: 100,
            failurePercentage: '29%',
        },
        {
            benchmark: 'CIS v1.3.0',
            severities: [30, 20, 15, 15, 10, 10],
            successfulChecks: 40,
            totalChecks: 100,
            failurePercentage: '29%',
        },
        {
            benchmark: 'CIS v1.3.0',
            severities: [30, 20, 15, 15, 10, 10],
            successfulChecks: 40,
            totalChecks: 100,
            failurePercentage: '29%',
        },
    ]
    return (
        <LoggedInLayout currentPage="home">
            <Metric>Home</Metric>
            <Grid numItems={3} className="gap-x-4 gap-y-8 mt-6">
                <Col numColSpan={2}>
                    <Grid numItems={2} className="gap-4 h-full">
                        <SummaryCard
                            title="Cloud Accounts"
                            metric={numberDisplay(
                                limits?.currentConnections,
                                0
                            )}
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
                        <SummaryCard
                            title="New KPI"
                            metric={numberDisplay(
                                limits?.currentConnections,
                                0
                            )}
                            loading={limitsLoading}
                        />
                    </Grid>
                </Col>
                <Col>
                    <Card key="spend" className="bg-indigo-950 text-white">
                        <Flex alignItems="start">
                            <Text className="text-white">Spend YTD</Text>
                            {badgeDelta(2, 3)}
                        </Flex>
                        <Flex
                            className="space-x-3 truncate"
                            justifyContent="start"
                            alignItems="baseline"
                        >
                            <Metric className="text-white">$ 61,734</Metric>
                        </Flex>
                        <AreaChart
                            className="mt-6 h-28"
                            data={[{ Spend: 1 }, { Spend: 2 }]}
                            index="Month"
                            valueFormatter={(number: number) =>
                                `$ ${Intl.NumberFormat('us')
                                    .format(number)
                                    .toString()}`
                            }
                            categories={['Spend']}
                            colors={['emerald']}
                            showXAxis
                            showGridLines={false}
                            startEndOnly
                            showYAxis={false}
                            showLegend={false}
                        />
                    </Card>
                </Col>
                <Col numColSpan={2}>
                    <Card>
                        <Flex flexDirection="row">
                            <Flex justifyContent="start" className="gap-x-2">
                                <Title>Enterprise Cloud Trend</Title>
                            </Flex>
                            <Select
                                // onValueChange={(e) => {
                                //     setSelectedResourceCategory(e)
                                // }}
                                // value={selectedResourceCategory}
                                placeholder="Source Selection"
                                className="max-w-xs"
                                // disabled={isLoading}
                            >
                                <SelectItem value="infrastructure">
                                    Infrastructure
                                </SelectItem>
                                <SelectItem value="spend">Spend</SelectItem>
                                <SelectItem value="compliance">
                                    Compliance
                                </SelectItem>
                            </Select>
                        </Flex>
                        {isLoading ? (
                            <Spinner className="h-80" />
                        ) : (
                            <Chart
                                className="mt-3"
                                index="date"
                                type="line"
                                categories={['Resource Count']}
                                data={[
                                    { 'Resource Count': 100 },
                                    { 'Resource Count': 200 },
                                ]}
                            />
                        )}
                    </Card>
                </Col>
                <Col>
                    <Card className="h-full">
                        <Flex flexDirection="col" justifyContent="between">
                            <Flex flexDirection="col">
                                <Title className="w-full truncate mb-6">
                                    Compliance
                                </Title>
                                {compliances.map((item) => {
                                    return (
                                        <Flex
                                            flexDirection="col"
                                            justifyContent="start"
                                            alignItems="start"
                                        >
                                            <Subtitle>
                                                {item.benchmark}
                                            </Subtitle>
                                            <CategoryBar
                                                className="w-full mb-2"
                                                values={item.severities}
                                                markerValue={80}
                                                showLabels={false}
                                                colors={[
                                                    'rose',
                                                    'orange',
                                                    'amber',
                                                    'yellow',
                                                    'emerald',
                                                    'slate',
                                                ]}
                                            />
                                            <Flex className="mb-6">
                                                <Text className="text-xs text-gray-400">
                                                    {item.successfulChecks} of{' '}
                                                    {item.totalChecks} checks
                                                    failed
                                                </Text>
                                                <Text className="text-xs  text-gray-400 font-semibold">
                                                    {item.failurePercentage}{' '}
                                                    failed
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    )
                                })}
                            </Flex>
                            <Flex flexDirection="col" alignItems="end">
                                <Divider />
                                <Link to="./../compliance">
                                    <Flex justifyContent="end" alignItems="end">
                                        <Text className="text-blue-600">
                                            See more
                                        </Text>
                                        <ArrowSmallRightIcon className="ml-1 mt-1 text-blue-600 h-5 w-5" />
                                    </Flex>
                                </Link>
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
            </Grid>
        </LoggedInLayout>
    )
}
