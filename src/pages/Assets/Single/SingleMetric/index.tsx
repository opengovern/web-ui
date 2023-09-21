import { Dayjs } from 'dayjs'
import { useAtomValue } from 'jotai'
import {
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
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
import { generateVisualMap, resourceTrendChart } from '../../index'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import { numericDisplay } from '../../../../utilities/numericDisplay'
import Table from '../../../../components/Table'
import { getTable } from '../../../Finder'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'

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
        connectionId: metric
            ? [String(id).replace('account_', '')]
            : selectedConnections.connections,
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
            <Flex className="mb-6">
                <Flex alignItems="start" className="gap-2">
                    {getConnectorIcon(
                        metricDetail?.connectors
                            ? metricDetail?.connectors[0]
                            : undefined
                    )}
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        justifyContent="start"
                    >
                        <Title className="font-semibold whitespace-nowrap">
                            {metricDetail?.name}
                        </Title>
                        <Text>{metricDetail?.id}</Text>
                    </Flex>
                </Flex>
            </Flex>
            <Card className="mb-4">
                <Grid numItems={4} className="gap-4 mb-4">
                    <SummaryCard
                        title="Resource count"
                        metric={numericDisplay(
                            resourceTrend
                                ? resourceTrend[resourceTrend.length - 1]?.count
                                : 0
                        )}
                        loading={resourceTrendLoading || metricDetailLoading}
                        border={false}
                    />
                    <div className="pl-4 border-l border-l-gray-200">
                        <SummaryCard
                            border={false}
                            title="Evaluated"
                            // loading={detailLoading}
                            metric={10}
                        />
                    </div>
                    <Col />
                    <Col>
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
                    </Col>
                </Grid>
                {!!generateVisualMap(
                    resourceTrendChart(resourceTrend).flag,
                    resourceTrendChart(resourceTrend).label
                ).visualMap && (
                    <Callout
                        color="rose"
                        title="Data for red spots is incomplete or missing"
                        className="w-fit mt-4"
                    />
                )}
                <Flex justifyContent="end" className="mt-2 gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-kaytu-800" />
                    <Text>Resources</Text>
                </Flex>
                <Chart
                    labels={resourceTrendChart(resourceTrend).label}
                    chartData={resourceTrendChart(resourceTrend).data}
                    visualMap={
                        generateVisualMap(
                            resourceTrendChart(resourceTrend).flag,
                            resourceTrendChart(resourceTrend).label
                        ).visualMap
                    }
                    markArea={
                        generateVisualMap(
                            resourceTrendChart(resourceTrend).flag,
                            resourceTrendChart(resourceTrend).label
                        ).markArea
                    }
                    chartType={selectedChart}
                    loading={resourceTrendLoading}
                />
            </Card>
            <Card>
                <Table
                    title="Results"
                    id="metric_table"
                    onGridReady={(params) => {
                        if (metricDetailLoading || isLoading) {
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