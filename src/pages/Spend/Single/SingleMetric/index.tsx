import { Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'
import {
    Card,
    Col,
    Flex,
    Grid,
    Select,
    Tab,
    TabGroup,
    TabList,
    Text,
} from '@tremor/react'
import { filterAtom } from '../../../../store'
import { useInventoryApiV2AnalyticsSpendTrendList } from '../../../../api/inventory.gen'
import {
    checkGranularity,
    generateItems,
} from '../../../../utilities/dateComparator'
import Header from '../../../../components/Header'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { exactPriceDisplay } from '../../../../utilities/numericDisplay'
import { capitalizeFirstLetter } from '../../../../utilities/labelMaker'
import {
    AreaChartIcon,
    BarChartIcon,
    LineChartIcon,
} from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import { costTrendChart, getConnections } from '../../index'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    id: string | undefined
}

export default function SingleSpendMetric({ activeTimeRange, id }: ISingle) {
    const selectedConnections = useAtomValue(filterAtom)
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'area'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [selectedGranularity, setSelectedGranularity] = useState<
        'monthly' | 'daily' | 'yearly'
    >(
        checkGranularity(activeTimeRange.start, activeTimeRange.end).daily
            ? 'daily'
            : 'monthly'
    )

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('area')
        if (selectedIndex === 1) setSelectedChart('line')
        if (selectedIndex === 2) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider !== '' && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
        ...(id && { metricIds: [id] }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
        pageSize: 5,
        pageNumber: 1,
        sortBy: 'cost',
    }

    const { response: costTrend, isLoading: costTrendLoading } =
        useInventoryApiV2AnalyticsSpendTrendList({
            ...query,
            granularity: selectedGranularity,
        })

    return (
        <>
            <Header datePicker filter />
            <Card className="mb-4">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={1}>
                        <SummaryCard
                            title={getConnections(selectedConnections)}
                            metric={exactPriceDisplay(100)}
                            // loading={accountCostLoading}
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
                                    placeholder={capitalizeFirstLetter(
                                        selectedGranularity
                                    )}
                                    onValueChange={(v) => {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        setSelectedGranularity(v)
                                    }}
                                    className="w-10"
                                >
                                    {generateItems(
                                        activeTimeRange.start,
                                        activeTimeRange.end
                                    )}
                                </Select>
                                <TabGroup
                                    index={selectedIndex}
                                    onIndexChange={setSelectedIndex}
                                    className="w-fit rounded-lg"
                                >
                                    <TabList variant="solid">
                                        <Tab value="area">
                                            <AreaChartIcon className="h-5" />
                                        </Tab>
                                        <Tab value="line">
                                            <LineChartIcon className="h-5" />
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
                                    <Text>Accumulated cost</Text>
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
        </>
    )
}
