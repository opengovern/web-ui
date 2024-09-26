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
import Findings from './Findings'
import axios from 'axios'
import { get } from 'http'
import EvaluateTable from './EvaluateTable'
import { notificationAtom } from '../../../../store'
import { useSetAtom } from 'jotai'
export default function NewBenchmarkSummary() {
    const { ws } = useParams()
    const { value: activeTimeRange } = useUrlDateRangeState(
        defaultTime(ws || '')
    )
    const [tab, setTab] = useState<number>(0)
    const [enable, setEnable] = useState<boolean>(false)
    const setNotification = useSetAtom(notificationAtom)

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
                benchmark_id: [benchmarkId ? benchmarkId : ''],
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
    const GetEnabled = () => {
        // /compliance/api/v3/benchmark/{benchmark-id}/assignments
        let url = ''
        if (window.location.origin === 'http://localhost:3000') {
            url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
        } else {
            url = window.location.origin
        }
        // @ts-ignore
        const token = JSON.parse(localStorage.getItem('kaytu_auth')).token

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
        console.log(config)
        axios
            .get(
                `${url}/main/compliance/api/v3/benchmark/${benchmarkId}/assignments`,
                config
            )
            .then((res) => {
                if (res.data) {
                   if (res.data.length > 0) {
                       setEnable(true)
                       setTab(0)
                   } else {
                       setEnable(false)
                       setTab(1)
                   }
                } else {
                    setEnable(false)
                    setTab(1)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
   const RunBenchmark = (c: any[]) => {
       // /compliance/api/v3/benchmark/{benchmark-id}/assignments
       let url = ''
       if (window.location.origin === 'http://localhost:3000') {
           url = window.__RUNTIME_CONFIG__.REACT_APP_BASE_URL
       } else {
           url = window.location.origin
       }
       const body = {
           integration_info:
                c.map((c)=>{
                    return {
                        integration_tracker: c.value
                    }
                })
           ,
       }
       // @ts-ignore
       const token = JSON.parse(localStorage.getItem('kaytu_auth')).token

       const config = {
           headers: {
               Authorization: `Bearer ${token}`,
           },
       }
    //    console.log(config)
       axios
           .post(
               `${url}/main/schedule/api/v3/compliance/benchmark/${benchmarkId}/run`,
               body,config
           )
           .then((res) => {
                setNotification({
                    text: `Run is Done You Job id is ${res.data.job_id}`,
                    type: 'success',
                })
           })
           .catch((err) => {
               console.log(err)
           })
   }
   const truncate =(text: string) => {
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
   }
  
    // @ts-ignore

    useEffect(() => {
        if (isExecuted || recall) {
            updateDetail()
        }
    }, [isExecuted, recall])
    useEffect(() => {
        GetEnabled()
    }, [])

    return (
        <>
            <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                supportedFilters={enable ? ['Date', 'Cloud Account', 'Connector'] : []}
                initialFilters={enable ? ['Date'] : []}
            />
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex alignItems="start" className="mb-3 w-11/12">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-full"
                        >
                            <Title className="font-semibold">
                                {benchmarkDetail?.title}
                            </Title>
                            <div className="group  relative flex text-wrap justify-start">
                                <Text className="test-start w-full ">
                                    {/* @ts-ignore */}
                                    {truncate(benchmarkDetail?.description)}
                                </Text>
                                <Card className="absolute w-full text-wrap z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </Card>
                            </div>
                        </Flex>
                        <Flex className="w-fit gap-4">
                            {/* <Settings
                                id={benchmarkDetail?.id}
                                response={(e) => setAssignments(e)}
                                autoAssign={benchmarkDetail?.autoAssign}
                                tracksDriftEvents={
                                    benchmarkDetail?.tracksDriftEvents
                                }
                                isAutoResponse={(x) => setRecall(true)}
                                reload={() => updateDetail()}
                            /> */}
                            <Evaluate
                                id={benchmarkDetail?.id}
                                benchmarkDetail={benchmarkDetail}
                                assignmentsCount={assignments}
                                onEvaluate={(c) => {
                                    RunBenchmark(c)
                                }}
                            />
                        </Flex>
                    </Flex>
                    <TabGroup
                        className=" "
                        // tabIndex={enable ? tab : findTab(tab)}
                        // onIndexChange={(index) => {
                        //     console.log("its index")
                        //     if(enable){
                        //         setTab(index)

                        //     }
                        //     else{
                        //         // @ts-ignore
                        //         setTab(findTab(index))
                        //     }
                        // }}
                    >
                        <TabList className="mb-4">
                            <>
                                {enable && (
                                    <>
                                        <Tab
                                            onClick={() => {
                                                setTab(0)
                                            }}
                                        >
                                            Summary
                                        </Tab>
                                    </>
                                )}

                                <Tab
                                    onClick={() => {
                                        setTab(1)
                                    }}
                                >
                                    Controls
                                </Tab>
                                {enable && (
                                    <>
                                        <Tab
                                            onClick={() => {
                                                setTab(2)
                                            }}
                                        >
                                            Incidents
                                        </Tab>
                                    </>
                                )}

                                <Tab
                                    onClick={() => {
                                        setTab(3)
                                    }}
                                >
                                    Scope Assignments
                                </Tab>
                                <Tab
                                    onClick={() => {
                                        setTab(4)
                                    }}
                                >
                                    Run History
                                </Tab>
                            </>
                        </TabList>
                        <TabPanels>
                            {enable && (
                                <>
                                    {tab == 0 && (
                                        <>
                                            <Flex
                                                className="w-full flex-wrap"
                                                flexDirection="col"
                                            >
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
                                                                    ?.total
                                                                    ?.passed ||
                                                                    0) /
                                                                    (benchmarkKPIEnd
                                                                        ?.controlsSeverityStatus
                                                                        ?.total
                                                                        ?.total ||
                                                                        1)) *
                                                                    100 || 0
                                                            }
                                                            metricPrev={
                                                                ((benchmarkKPIStart
                                                                    ?.controlsSeverityStatus
                                                                    ?.total
                                                                    ?.passed ||
                                                                    0) /
                                                                    (benchmarkKPIStart
                                                                        ?.controlsSeverityStatus
                                                                        ?.total
                                                                        ?.total ||
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
                                                        error={toErrorMessage(
                                                            trendError
                                                        )}
                                                        onRefresh={() =>
                                                            sendTrend()
                                                        }
                                                    />
                                                )}
                                            </Flex>
                                        </>
                                    )}{' '}
                                </>
                            )}
                            {tab == 1 && (
                                <div className="w-full flex flex-row justify-start items-start ">
                                    <div className="w-11/12">
                                        <Controls
                                            id={String(benchmarkId)}
                                            assignments={trend === null ? 0 : 1}
                                            enable={enable}
                                        />
                                    </div>
                                </div>
                            )}{' '}
                            {enable && (
                                <>
                                    {' '}
                                    {tab == 2 && (
                                        <>
                                            <Findings
                                                id={
                                                    benchmarkId
                                                        ? benchmarkId
                                                        : ''
                                                }
                                            />
                                        </>
                                    )}
                                </>
                            )}
                            {tab == 3 && (
                                <>
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
                                </>
                            )}
                            {tab == 4 && (
                                <>
                                    <EvaluateTable
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
                                </>
                            )}
                        </TabPanels>
                    </TabGroup>
                </>
            )}
        </>
    )
}
