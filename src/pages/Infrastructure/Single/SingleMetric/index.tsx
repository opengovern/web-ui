import { Dayjs } from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    Button,
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
import { Link, useParams } from 'react-router-dom'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import clipboardCopy from 'clipboard-copy'
import { highlight, languages } from 'prismjs'
import Editor from 'react-simple-code-editor'
import {
    useInventoryApiV1QueryRunCreate,
    useInventoryApiV2AnalyticsMetricsDetail,
    useInventoryApiV2AnalyticsTrendList,
} from '../../../../api/inventory.gen'
import {
    filterAtom,
    isDemoAtom,
    notificationAtom,
    queryAtom,
} from '../../../../store'
import Header from '../../../../components/Header'
import { BarChartIcon, LineChartIcon } from '../../../../icons/icons'
import Chart from '../../../../components/Chart'
import { generateVisualMap, resourceTrendChart } from '../../index'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import {
    numberDisplay,
    numericDisplay,
} from '../../../../utilities/numericDisplay'
import Table from '../../../../components/Table'
import { getTable } from '../../../Finder'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import { dateDisplay } from '../../../../utilities/dateDisplay'
import Modal from '../../../../components/Modal'

interface ISingle {
    activeTimeRange: { start: Dayjs; end: Dayjs }
    metricId: string | undefined
    resourceId: string | undefined
}

export default function SingleMetric({
    activeTimeRange,
    metricId,
    resourceId,
}: ISingle) {
    const selectedConnections = useAtomValue(filterAtom)
    const { ws, id, metric } = useParams()
    const isDemo = useAtomValue(isDemoAtom)
    const [modalData, setModalData] = useState('')
    const setNotification = useSetAtom(notificationAtom)
    const setQuery = useSetAtom(queryAtom)

    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (selectedIndex === 0) setSelectedChart('line')
        if (selectedIndex === 1) setSelectedChart('bar')
    }, [selectedIndex])

    const [selectedDatapoint, setSelectedDatapoint] = useState<any>(undefined)

    const query = {
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        connectionId: metric
            ? [String(id).replace('account_', '')]
            : selectedConnections.connections,
        ...(metricId && { ids: [metricId] }),
        ...(resourceId && { resourceCollection: [resourceId] }),
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
                <Button
                    variant="secondary"
                    onClick={() =>
                        setModalData(
                            metricDetail?.query?.replace(
                                '$IS_ALL_CONNECTIONS_QUERY',
                                'true'
                            ) || ''
                        )
                    }
                >
                    See query
                </Button>
            </Flex>
            <Modal open={!!modalData.length} onClose={() => setModalData('')}>
                <Title className="font-semibold">Metric query</Title>
                <Card className="my-4">
                    <Editor
                        onValueChange={() => console.log('')}
                        highlight={(text) =>
                            highlight(text, languages.sql, 'sql')
                        }
                        value={modalData}
                        className="w-full bg-white dark:bg-gray-900 dark:text-gray-50 font-mono text-sm"
                        style={{
                            minHeight: '200px',
                        }}
                        placeholder="-- write your SQL query here"
                    />
                </Card>
                <Flex>
                    <Button
                        variant="light"
                        icon={DocumentDuplicateIcon}
                        iconPosition="left"
                        onClick={() =>
                            clipboardCopy(modalData).then(() =>
                                setNotification({
                                    text: 'Query copied to clipboard',
                                    type: 'info',
                                })
                            )
                        }
                    >
                        Copy
                    </Button>
                    <Flex className="w-fit gap-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setQuery(modalData)
                            }}
                        >
                            <Link to={`/${ws}/finder`}>Open in finder</Link>
                        </Button>
                        <Button onClick={() => setModalData('')}>Close</Button>
                    </Flex>
                </Flex>
            </Modal>
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
                    {/* <div className="pl-4 border-l border-l-gray-200">
                        <SummaryCard
                            border={false}
                            title="Evaluated"
                            // loading={detailLoading}
                            metric={10}
                        />
                    </div> */}
                    <Col numColSpan={2} />
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
                {resourceTrend
                    ?.filter(
                        (t) =>
                            selectedDatapoint?.color === '#E01D48' &&
                            dateDisplay(t.date) === selectedDatapoint?.name
                    )
                    .map((t) => (
                        <Callout
                            color="rose"
                            title="Incomplete data"
                            className="w-fit mt-4"
                        >
                            Checked{' '}
                            {numberDisplay(
                                t.totalSuccessfulDescribedConnectionCount,
                                0
                            )}{' '}
                            accounts out of{' '}
                            {numberDisplay(t.totalConnectionCount, 0)} on{' '}
                            {dateDisplay(t.date)}
                        </Callout>
                    ))}
                <Flex justifyContent="end" className="mt-2 gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-kaytu-800" />
                    <Text>Resources</Text>
                </Flex>
                <Chart
                    labels={resourceTrendChart(resourceTrend).label}
                    chartData={resourceTrendChart(resourceTrend).data}
                    // visualMap={
                    //     generateVisualMap(
                    //         resourceTrendChart(resourceTrend).flag,
                    //         resourceTrendChart(resourceTrend).label
                    //     ).visualMap
                    // }
                    // markArea={
                    //     generateVisualMap(
                    //         resourceTrendChart(resourceTrend).flag,
                    //         resourceTrendChart(resourceTrend).label
                    //     ).markArea
                    // }
                    chartType={selectedChart}
                    loading={resourceTrendLoading}
                    onClick={(p) => setSelectedDatapoint(p)}
                />
            </Card>
            <Table
                title="Results"
                id="metric_table"
                loading={metricDetailLoading || isLoading}
                columns={
                    getTable(
                        queryResponse?.headers,
                        queryResponse?.result,
                        isDemo
                    ).columns
                }
                rowData={
                    getTable(
                        queryResponse?.headers,
                        queryResponse?.result,
                        isDemo
                    ).rows
                }
                downloadable
            />
        </>
    )
}
