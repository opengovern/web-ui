import { useParams } from 'react-router-dom'
import {
    Card,
    Flex,
    Grid,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
    Text,
    Title,
    Switch,
} from '@tremor/react'

import {
    UncontrolledTreeEnvironment,
    Tree,
    StaticTreeDataProvider,
    ControlledTreeEnvironment,
} from 'react-complex-tree'

import { useEffect, useState } from 'react'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingEventsCountList,
} from '../../../../api/compliance.gen'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import Spinner from '../../../../components/Spinner'
import Controls from '../../Controls'
import Settings from './Settings'
import TopHeader from '../../../../components/Layout/Header'
import {
    defaultTime,
    useFilterState,
    useUrlDateRangeState,
} from '../../../../utilities/urlstate'
import BenchmarkChart from '../../../../components/Benchmark/Chart'
import { toErrorMessage } from '../../../../types/apierror'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import Evaluate from './Evaluate'
import Table, { IColumn } from '../../../../components/Table'
import { ValueFormatterParams } from 'ag-grid-community'

export default function NewBenchmarkSummary() {
    const { ws } = useParams()
    const { value: activeTimeRange } = useUrlDateRangeState(
        defaultTime(ws || '')
    )
    const readTemplate = (template: any, data: any = { items: {} }): any => {
        for (const [key, value] of Object.entries(template)) {
            // eslint-disable-next-line no-param-reassign
            data.items[key] = {
                index: key,
                canMove: true,
                isFolder: value !== null,
                children:
                    value !== null
                        ? Object.keys(value as Record<string, unknown>)
                        : undefined,
                data: key,
                canRename: true,
            }

            if (value !== null) {
                readTemplate(value, data)
            }
        }
        return data
    }
    const shortTreeTemplate = {
        root: {
            container: {
                item0: null,
                item1: null,
                item2: null,
                item3: {
                    inner0: null,
                    inner1: null,
                    inner2: null,
                    inner3: null,
                },
                item4: null,
                item5: null,
            },
        },
    }
    const shortTree = readTemplate(shortTreeTemplate)

    const { benchmarkId } = useParams()
    const { value: selectedConnections } = useFilterState()
    const [assignments, setAssignments] = useState(0)
    const [recall, setRecall] = useState(false)
 const [focusedItem, setFocusedItem] = useState<string>()
 const [expandedItems, setExpandedItems] = useState<string[]>([])
    const topQuery = {
        ...(benchmarkId && { benchmarkId: [benchmarkId] }),
        ...(selectedConnections.provider && {
            connector: [selectedConnections.provider],
        }),
        ...(selectedConnections.connections && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.connectionGroup && {
            connectionGroup: selectedConnections.connectionGroup,
        }),
    }

    const {
        response: benchmarkDetail,
        isLoading,
        sendNow: updateDetail,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId))
    const { sendNowWithParams: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(
            {
                benchmark_id: [],
                connection_id: [],
            },
            {},
            false
        )

    const {
        response: benchmarkKPIStart,
        isLoading: benchmarkKPIStartLoading,
        sendNow: benchmarkKPIStartSend,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
        ...topQuery,
        timeAt: activeTimeRange.start.unix(),
    })
    const {
        response: benchmarkKPIEnd,
        isLoading: benchmarkKPIEndLoading,
        sendNow: benchmarkKPIEndSend,
    } = useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
        ...topQuery,
        timeAt: activeTimeRange.end.unix(),
    })

    const hideKPIs =
        (benchmarkKPIEnd?.conformanceStatusSummary?.failed || 0) +
            (benchmarkKPIEnd?.conformanceStatusSummary?.passed || 0) +
            (benchmarkKPIStart?.conformanceStatusSummary?.failed || 0) +
            (benchmarkKPIStart?.conformanceStatusSummary?.passed || 0) ===
        0

    const {
        response: trend,
        isLoading: trendLoading,
        error: trendError,
        sendNow: sendTrend,
    } = useComplianceApiV1BenchmarksTrendDetail(String(benchmarkId), {
        ...topQuery,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    })
const columns: (isDemo: boolean) => IColumn<any, any>[] = (isDemo) => [
    {
        width: 120,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
        field: 'connector',
    },
    {
        field: 'providerConnectionName',
        headerName: 'Connection Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (param: ValueFormatterParams) => (
            <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        ),
    },
    {
        field: 'providerConnectionID',
        headerName: 'Connection ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellRenderer: (param: ValueFormatterParams) => (
            <span className={isDemo ? 'blur-sm' : ''}>{param.value}</span>
        ),
    },
    {
        headerName: 'Enable',
        sortable: true,
        type: 'string',
        filter: true,
        resizable: true,
        flex: 0.5,
        cellRenderer: (params: any) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="h-full w-full"
                >
                    <Switch checked={params.data?.status} />
                </Flex>
            )
        },
    },

]
// @ts-ignore

    useEffect(() => {
        if (isExecuted || recall) {
            updateDetail()
        }
    }, [isExecuted, recall])

    return (
        <>
            <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                supportedFilters={['Date', 'Cloud Account', 'Connector']}
                initialFilters={['Date']}
            />
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex alignItems="start" className="mb-3">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-3/4"
                        >
                            <Title className="font-semibold">
                                {benchmarkDetail?.title}
                            </Title>
                            <div className="group w-full relative flex justify-start">
                                <Text className="test-start truncate">
                                    {benchmarkDetail?.description}
                                </Text>
                                <Card className="absolute w-full z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </Card>
                            </div>
                        </Flex>
                        {/* <Flex className="w-fit gap-4">
                            <Settings
                                id={benchmarkDetail?.id}
                                response={(e) => setAssignments(e)}
                                autoAssign={benchmarkDetail?.autoAssign}
                                tracksDriftEvents={
                                    benchmarkDetail?.tracksDriftEvents
                                }
                                isAutoResponse={(x) => setRecall(true)}
                                reload={() => updateDetail()}
                            />
                            <Evaluate
                                id={benchmarkDetail?.id}
                                benchmarkDetail={benchmarkDetail}
                                assignmentsCount={assignments}
                                onEvaluate={(c) => {
                                    triggerEvaluate(
                                        {
                                            benchmark_id: [benchmarkId || ''],
                                            connection_id: c,
                                        },
                                        {}
                                    )
                                }}
                            />
                        </Flex> */}
                    </Flex>
                    <TabGroup className=" ">
                        <TabList className="mb-4">
                            <Tab>Posture Summary</Tab>
                            <Tab>Controls</Tab>
                            <Tab>Issues</Tab>
                            <Tab>Settings</Tab>
                            <Tab>Run</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <>
                                    {hideKPIs ? (
                                        ''
                                    ) : (
                                        <Grid
                                            numItems={4}
                                            className="w-full gap-4 mb-4"
                                        >
                                            <SummaryCard
                                                title="Security Score"
                                                metric={
                                                    ((benchmarkKPIEnd
                                                        ?.controlsSeverityStatus
                                                        ?.total?.passed || 0) /
                                                        (benchmarkKPIEnd
                                                            ?.controlsSeverityStatus
                                                            ?.total?.total ||
                                                            1)) *
                                                        100 || 0
                                                }
                                                metricPrev={
                                                    ((benchmarkKPIStart
                                                        ?.controlsSeverityStatus
                                                        ?.total?.passed || 0) /
                                                        (benchmarkKPIStart
                                                            ?.controlsSeverityStatus
                                                            ?.total?.total ||
                                                            1)) *
                                                        100 || 0
                                                }
                                                isPercent
                                                loading={
                                                    benchmarkKPIEndLoading ||
                                                    benchmarkKPIStartLoading
                                                }
                                            />
                                            <SummaryCard
                                                title="Issues"
                                                metric={
                                                    benchmarkKPIEnd
                                                        ?.conformanceStatusSummary
                                                        ?.failed
                                                }
                                                metricPrev={
                                                    benchmarkKPIStart
                                                        ?.conformanceStatusSummary
                                                        ?.failed
                                                }
                                                loading={
                                                    benchmarkKPIEndLoading ||
                                                    benchmarkKPIStartLoading
                                                }
                                            />

                                            <SummaryCard
                                                title="Passed"
                                                metric={
                                                    benchmarkKPIEnd
                                                        ?.conformanceStatusSummary
                                                        ?.passed
                                                }
                                                metricPrev={
                                                    benchmarkKPIStart
                                                        ?.conformanceStatusSummary
                                                        ?.passed
                                                }
                                                loading={
                                                    benchmarkKPIEndLoading ||
                                                    benchmarkKPIStartLoading
                                                }
                                            />

                                            <SummaryCard
                                                title="Accounts"
                                                metric={
                                                    benchmarkKPIEnd
                                                        ?.connectionsStatus
                                                        ?.total
                                                }
                                                metricPrev={
                                                    benchmarkKPIStart
                                                        ?.connectionsStatus
                                                        ?.total
                                                }
                                                loading={
                                                    benchmarkKPIEndLoading ||
                                                    benchmarkKPIStartLoading
                                                }
                                            />

                                            {/* <SummaryCard
                                title="Events"
                                metric={events?.count}
                                loading={eventsLoading}
                            /> */}
                                        </Grid>
                                    )}
                                    {trend === null ? (
                                        ''
                                    ) : (
                                        <BenchmarkChart
                                            title="Security Score"
                                            isLoading={trendLoading}
                                            trend={trend}
                                            error={toErrorMessage(trendError)}
                                            onRefresh={() => sendTrend()}
                                        />
                                    )}
                                </>
                            </TabPanel>
                            <TabPanel>
                                <Flex flexDirection='row' justifyContent='start' alignItems='start' className='gap-4'>
                                    <Flex className=" p-2 w-52 bg-white min-w-52 rounded-md" flexDirection='col' justifyContent='start' alignItems='start'>
                                        <UncontrolledTreeEnvironment<string>
                                            canDragAndDrop
                                            canDropOnFolder
                                            canReorderItems
                                            dataProvider={
                                                new StaticTreeDataProvider(
                                                    shortTree?.items,
                                                    (item, data) => ({
                                                        ...item,
                                                        data,
                                                    })
                                                )
                                            }
                                            getItemTitle={(item) => item.data}
                                            viewState={{
                                                'tree-1': {
                                                    expandedItems: [
                                                        'container',
                                                    ],
                                                },
                                            }}
                                        >
                                            <Tree
                                                treeId="tree-1"
                                                rootItem="root"
                                                treeLabel="Tree Example"
                                            />
                                        </UncontrolledTreeEnvironment>
                                    </Flex>

                                    <Flex>
                                        <Table
                                            id="compliance_assignments"
                                            columns={columns(true)}
                                            onCellClicked={(event) => {}}
                                            loading={isLoading}
                                            rowData={[]}
                                            fullWidth
                                        />
                                    </Flex>
                                </Flex>
                            </TabPanel>
                            <TabPanel>text</TabPanel>
                            <TabPanel>
                                {' '}
                                <Settings
                                    id={benchmarkDetail?.id}
                                    response={(e) => setAssignments(e)}
                                    autoAssign={benchmarkDetail?.autoAssign}
                                    tracksDriftEvents={
                                        benchmarkDetail?.tracksDriftEvents
                                    }
                                    isAutoResponse={(x) => setRecall(true)}
                                    reload={() => updateDetail()}
                                />
                            </TabPanel>
                            <TabPanel>
                                <Evaluate
                                    id={benchmarkDetail?.id}
                                    benchmarkDetail={benchmarkDetail}
                                    assignmentsCount={assignments}
                                    onEvaluate={(c) => {
                                        triggerEvaluate(
                                            {
                                                benchmark_id: [
                                                    benchmarkId || '',
                                                ],
                                                connection_id: c,
                                            },
                                            {}
                                        )
                                    }}
                                />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </>
            )}
        </>
    )
}
