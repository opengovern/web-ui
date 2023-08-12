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
    useInventoryApiV2AnalyticsSpendMetricList,
    useInventoryApiV2AnalyticsSpendTrendList,
} from '../../api/inventory.gen'
import ConnectionList from '../../components/ConnectionList'
import { filterAtom, spendTimeAtom } from '../../store'
import SummaryMetrics from './SummaryMetrics'
import { useOnboardApiV1ConnectionsSummaryList } from '../../api/onboard.gen'
import Chart from '../../components/Chart'
import { dateDisplay } from '../../utilities/dateDisplay'
import CardWithList from '../../components/Cards/CardWithList'

export default function Spend() {
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const activeTimeRange = useAtomValue(spendTimeAtom)
    const selectedConnections = useAtomValue(filterAtom)

    const MockData = {
        growthData: {
            accounts: [
                {
                    name: 'PODZ',
                    value: '97.9 %',
                },
                {
                    name: 'TARK-BALK',
                    value: '75.6 %',
                },
                {
                    name: 'KOZET',
                    value: '50.8 %',
                },
                {
                    name: 'Central Management',
                    value: '49.0 %',
                },
                {
                    name: 'MAGNUM',
                    value: '10 %',
                },
            ],
            services: [
                {
                    name: 'M-Verst',
                    value: '100 %',
                },
                {
                    name: 'DDEVOPS',
                    value: '80 %',
                },
                {
                    name: 'D-Search',
                    value: '69.69 %',
                },
                {
                    name: 'Chico',
                    value: '51.2 %',
                },
                {
                    name: 'Mango',
                    value: '36.0 %',
                },
            ],
        },
        consumptionData: {
            accounts: [
                {
                    name: 'Central Management',
                    value: '1304549',
                },
                {
                    name: 'PODZ',
                    value: '504549',
                },
                {
                    name: 'KOZET',
                    value: '304549',
                },
                {
                    name: 'MAGNUM',
                    value: '104549',
                },
                {
                    name: 'TARK-BALK',
                    value: '4549',
                },
            ],
            services: [
                {
                    name: 'DDEVOPS',
                    value: '1,204,549',
                },
                {
                    name: 'D-Search',
                    value: '549,549',
                },
                {
                    name: 'Mango',
                    value: '314,420',
                },
                {
                    name: 'Chico',
                    value: '104,110',
                },
                {
                    name: 'M-Verst',
                    value: '4,420',
                },
            ],
        },
    }

    const growthData = () => {
        const AccountData = MockData.growthData.accounts
        const ServiceData = MockData.growthData.services

        return {
            Accounts: AccountData,
            Services: ServiceData,
        }
    }

    const consumptionData = () => {
        const AccountData = MockData.consumptionData.accounts
        const ServiceData = MockData.consumptionData.services

        return {
            Accounts: AccountData,
            Services: ServiceData,
        }
    }

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
    }

    const { response: costTrend, isLoading } =
        useInventoryApiV2AnalyticsSpendTrendList(query)

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
    } = useOnboardApiV1ConnectionsSummaryList({
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        connectionId: selectedConnections.connections,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
        pageSize: 5000,
        pageNumber: 1,
        sortBy: 'cost',
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
            <SummaryMetrics
                accountCostResponse={accountCostResponse}
                accountCostLoading={accountCostLoading}
                serviceCostResponse={serviceCostResponse}
                serviceCostLoading={serviceCostLoading}
            />
            <Card className="mb-4">
                <Grid numItems={1} numItemsMd={3}>
                    <Col numColSpan={2}>
                        <Title className="font-semibold">Spend Trend</Title>
                    </Col>
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
                    <Chart labels={[]} chartData={[]} chartType="doughnut" />
                </Card>
                <CardWithList
                    title="Top by Consumption"
                    tabs={['Accounts', 'Services']}
                    data={consumptionData()}
                    valueIsPrice
                />
                <CardWithList
                    title="Top by Growth"
                    tabs={['Accounts', 'Services']}
                    data={growthData()}
                    isPercentage
                />
            </Grid>
        </Menu>
    )
}
