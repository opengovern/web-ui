import { Dayjs } from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import {
    Button,
    Callout,
    Card,
    Col,
    Flex,
    Grid,
    Icon,
    Select,
    SelectItem,
    Tab,
    TabGroup,
    TabList,
    Text,
    Title,
} from '@tremor/react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import clipboardCopy from 'clipboard-copy'
import { highlight, languages } from 'prismjs'
import Editor from 'react-simple-code-editor'
import { RowClickedEvent } from 'ag-grid-community'
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/solid'
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
import { resourceTrendChart } from '../../index'
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
import { RenderObject } from '../../../../components/RenderObject'
import DrawerPanel from '../../../../components/DrawerPanel'
import { getErrorMessage } from '../../../../types/apierror'

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

    const [openDrawer, setOpenDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState(null)
    const [selectedChart, setSelectedChart] = useState<'line' | 'bar' | 'area'>(
        'line'
    )
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [pageSize, setPageSize] = useState(1000)

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
    const { response: metricDetail } = useInventoryApiV2AnalyticsMetricsDetail(
        metricId || ''
    )

    const {
        response: queryResponse,
        isLoading,
        isExecuted,
        error,
        sendNow,
    } = useInventoryApiV1QueryRunCreate(
        {
            page: { no: 1, size: pageSize },
            query: metricDetail?.finderQuery,
        },
        {},
        false
    )

    useEffect(() => {
        if (metricDetail && metricDetail.finderQuery) {
            sendNow()
        }
    }, [metricDetail, pageSize])

    const memoRows = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .rows,
        [queryResponse, isDemo]
    )
    const memoColumns = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .columns,
        [queryResponse, isDemo]
    )
    const memoCount = useMemo(
        () =>
            getTable(queryResponse?.headers, queryResponse?.result, isDemo)
                .count,
        [queryResponse, isDemo]
    )

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
                        metricPrev={numericDisplay(
                            resourceTrend ? resourceTrend[0]?.count : 0
                        )}
                        loading={resourceTrendLoading}
                        border={false}
                    />
                    <div className="pl-3 border-l border-l-gray-200">
                        <SummaryCard
                            border={false}
                            title="Evaluated"
                            loading={resourceTrendLoading}
                            metric={numericDisplay(
                                resourceTrend
                                    ? resourceTrend[resourceTrend.length - 1]
                                          ?.totalConnectionCount
                                    : 0
                            )}
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
                    labels={resourceTrendChart(resourceTrend, 'daily').label}
                    chartData={resourceTrendChart(resourceTrend, 'daily').data}
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
                title="Resource list"
                id="metric_table"
                loading={isLoading}
                onGridReady={(e) => {
                    if (isLoading) {
                        e.api.showLoadingOverlay()
                    }
                }}
                columns={memoColumns}
                rowData={memoRows}
                downloadable
                onRowClicked={(event: RowClickedEvent) => {
                    setSelectedRow(event.data)
                    setOpenDrawer(true)
                }}
                fullWidth
            >
                <Flex flexDirection="row-reverse" className="pl-3">
                    <Select
                        className="w-56"
                        placeholder={`Result count: ${numberDisplay(
                            pageSize,
                            0
                        )}`}
                    >
                        <SelectItem
                            value="1000"
                            onClick={() => setPageSize(1000)}
                        >
                            1,000
                        </SelectItem>
                        <SelectItem
                            value="3000"
                            onClick={() => setPageSize(3000)}
                        >
                            3,000
                        </SelectItem>
                        <SelectItem
                            value="5000"
                            onClick={() => setPageSize(5000)}
                        >
                            5,000
                        </SelectItem>
                        <SelectItem
                            value="10000"
                            onClick={() => setPageSize(10000)}
                        >
                            10,000
                        </SelectItem>
                    </Select>
                    {!isLoading && isExecuted && error && (
                        <Flex justifyContent="start" className="w-fit">
                            <Icon icon={ExclamationCircleIcon} color="rose" />
                            <Text color="rose">{getErrorMessage(error)}</Text>
                        </Flex>
                    )}
                    {!isLoading && isExecuted && queryResponse && (
                        <Flex justifyContent="start" className="w-fit">
                            {memoCount === pageSize ? (
                                <>
                                    <Icon
                                        icon={ExclamationCircleIcon}
                                        color="amber"
                                    />
                                    <Text color="amber">
                                        {`Results are truncated for ${numberDisplay(
                                            pageSize,
                                            0
                                        )} rows`}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Icon
                                        icon={CheckCircleIcon}
                                        color="emerald"
                                    />
                                    <Text color="emerald">Success</Text>
                                </>
                            )}
                        </Flex>
                    )}
                </Flex>
            </Table>
            <DrawerPanel
                title="Resource detail"
                open={openDrawer}
                onClose={() => {
                    setOpenDrawer(false)
                    // setSelectedRow(null)
                }}
            >
                <RenderObject obj={selectedRow} />
            </DrawerPanel>
        </>
    )
}
