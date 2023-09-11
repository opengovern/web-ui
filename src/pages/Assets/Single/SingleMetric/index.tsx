import { Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'
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
import { useEffect, useState } from 'react'
import {
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsMetricsDetail,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../../api/inventory.gen'
import { filterAtom } from '../../../../store'
import Header from '../../../../components/Header'
import {
    checkGranularity,
    generateItems,
} from '../../../../utilities/dateComparator'
import { capitalizeFirstLetter } from '../../../../utilities/labelMaker'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import { resourceTrendChart } from '../../index'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Spinner from '../../../../components/Spinner'
import Table from '../../../../components/Table'
import { getTable } from '../../../Finder'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    id: string | undefined
}

export default function SingleMetric({ activeTimeRange, id }: ISingle) {
    const selectedConnections = useAtomValue(filterAtom)

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
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
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(id && { ids: [id] }),
        // ...(selectedConnections.connectionGroup && {
        //     connectionGroup: selectedConnections.connectionGroup,
        // }),
        ...(activeTimeRange.start && {
            startTime: activeTimeRange.start.unix(),
        }),
        ...(activeTimeRange.end && {
            endTime: activeTimeRange.end.unix(),
        }),
    }
    const { response: resourceTrend, isLoading: resourceTrendLoading } =
        useInventoryApiV2AnalyticsTrendList(query)
    const { response: metricDetail, isLoading: metricDetailLoading } =
        useInventoryApiV2AnalyticsMetricsDetail(id || '')

    const {
        response: queryResponse,
        isLoading,
        sendNow,
    } = useInventoryApiV1QueryRunCreate(
        {
            page: { no: 1, size: 1000 },
            query: metricDetail?.finderQuery,
        },
        {},
        false
    )

    useEffect(() => {
        if (metricDetail && metricDetail.finderQuery) {
            sendNow()
        }
    }, [metricDetail])

    return (
        <>
            <Header breadCrumb={['Single resource detail']} datePicker filter />
            <Card className="mb-4">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={2}>
                        <SummaryCard
                            title={`${metricDetail?.name} resource count`}
                            metric={numericDisplay(
                                resourceTrend
                                    ? resourceTrend[resourceTrend.length - 1]
                                          ?.count
                                    : 0
                            )}
                            loading={
                                resourceTrendLoading || metricDetailLoading
                            }
                            border={false}
                        />
                    </Col>
                    <Col numColSpan={2} />
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
                                <Text>Resources</Text>
                            </Flex>
                        </Flex>
                    </Col>
                </Grid>
                <Chart
                    labels={resourceTrendChart(resourceTrend).label}
                    chartData={resourceTrendChart(resourceTrend).data}
                    chartType={selectedChart}
                    loading={resourceTrendLoading}
                />
            </Card>
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <Table
                    title="Metrics"
                    id="metric_table"
                    columns={
                        getTable(queryResponse?.headers, queryResponse?.result)
                            .columns
                    }
                    rowData={
                        getTable(queryResponse?.headers, queryResponse?.result)
                            .rows
                    }
                    downloadable
                />
            )}
        </>
    )
}
