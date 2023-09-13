import { Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'
import {
    Card,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
} from '@tremor/react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsMetricsDetail,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../../api/inventory.gen'
import { filterAtom } from '../../../../store'
import Header from '../../../../components/Header'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import { resourceTrendChart } from '../../index'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Table from '../../../../components/Table'
import { getTable } from '../../../Finder'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    metricId: string | undefined
}

export default function SingleMetric({ activeTimeRange, metricId }: ISingle) {
    const selectedConnections = useAtomValue(filterAtom)
    const { id, metric } = useParams()

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        connectionId: metric ? [String(id)] : selectedConnections.connections,
        ...(metricId && { ids: [metricId] }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
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
        useInventoryApiV2AnalyticsMetricsDetail(metricId || '')

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
            <Header
                breadCrumb={[
                    metricDetail
                        ? metricDetail?.name
                        : 'Single resource detail',
                ]}
                datePicker
                filter
            />
            <Card className="mb-4">
                <Grid numItems={6} className="gap-4">
                    <Col numColSpan={2}>
                        <SummaryCard
                            title="Resource count"
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
            <Card>
                <Table
                    title="Accounts"
                    id="metric_table"
                    onGridReady={(params) => {
                        if (isLoading) {
                            params.api.showLoadingOverlay()
                        }
                    }}
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
            </Card>
        </>
    )
}
