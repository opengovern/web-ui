import { useParams } from 'react-router-dom'
import {
    Card,
    Flex,
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
import Tabs from '@cloudscape-design/components/tabs'
import LineChart from '@cloudscape-design/components/line-chart'
import Box from '@cloudscape-design/components/box'
// import Button from '@cloudscape-design/components/button'
import Grid from '@cloudscape-design/components/grid'
import { useEffect, useState } from 'react'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingEventsCountList,
} from '../../../../api/compliance.gen'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import Spinner from '../../../../components/Spinner'
import Controls from './Controls'
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
import ContentLayout from '@cloudscape-design/components/content-layout'
import Container from '@cloudscape-design/components/container'
import Header from '@cloudscape-design/components/header'
import Link from '@cloudscape-design/components/link'
import Button from '@cloudscape-design/components/button'
import { SpaceBetween } from '@cloudscape-design/components'
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
            integration_info: c.map((c) => {
                return {
                    integration_tracker: c.value,
                }
            }),
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
                body,
                config
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
    const truncate = (text: string | undefined) => {
        if (text) {
            return text.length > 600 ? text.substring(0, 600) + '...' : text
        }
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
            {/* <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                supportedFilters={
                    enable ? ['Date', 'Cloud Account', 'Connector'] : []
                }
                initialFilters={enable ? ['Date'] : []}
            /> */}
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <ContentLayout
                        defaultPadding
                        className="rounded-xl"
                        disableOverlap
                        headerVariant="high-contrast"
                        headerBackgroundStyle={'#0F2940'}
                        maxContentWidth={1200}
                        header={
                            <Box
                                className="rounded-xl same"
                                padding={{ vertical: 'l' }}
                            >
                                <Grid
                                    gridDefinition={[
                                        {
                                            colspan: {
                                                default: 12,
                                                xs: 8,
                                                s: 9,
                                            },
                                        },
                                        {
                                            colspan: {
                                                default: 12,
                                                xs: 4,
                                                s: 3,
                                            },
                                        },
                                    ]}
                                >
                                    <div>
                                        <Box variant="h1">
                                            {benchmarkDetail?.title}
                                        </Box>
                                        <Box
                                            variant="p"
                                            color="text-body-secondary"
                                            margin={{ top: 'xxs', bottom: 's' }}
                                        >
                                            <div className="group  relative flex text-wrap justify-start">
                                                <Text className="test-start w-full ">
                                                    {/* @ts-ignore */}
                                                    {truncate(
                                                        benchmarkDetail?.description
                                                    )}
                                                </Text>
                                                <Card className="absolute w-full text-wrap z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                                    <Text>
                                                        {
                                                            benchmarkDetail?.description
                                                        }
                                                    </Text>
                                                </Card>
                                            </div>
                                        </Box>
                                        <SpaceBetween size="xs">
                                            <div>
                                                Sold by:{' '}
                                                <Link
                                                    variant="primary"
                                                    href="#"
                                                >
                                                    Elastic
                                                </Link>
                                            </div>
                                            <div>
                                                Tags:{' '}
                                                <Link
                                                    variant="primary"
                                                    href="#"
                                                >
                                                    Free trial
                                                </Link>
                                                {' | '}
                                                <Link
                                                    variant="primary"
                                                    href="#"
                                                >
                                                    Vendor insights
                                                </Link>
                                            </div>
                                        </SpaceBetween>
                                    </div>

                                    <Box margin={{ top: 'l' }}>
                                        <SpaceBetween size="s">
                                            <Evaluate
                                                id={benchmarkDetail?.id}
                                                benchmarkDetail={
                                                    benchmarkDetail
                                                }
                                                assignmentsCount={assignments}
                                                onEvaluate={(c) => {
                                                    RunBenchmark(c)
                                                }}
                                            />
                                        </SpaceBetween>
                                    </Box>
                                </Grid>
                            </Box>
                        }
                    >
                        {' '}
                    </ContentLayout>
                    {/* <Flex alignItems="start" className="mb-3 w-11/12">
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
                                    {/* @ts-ignore 
                                    {truncate(benchmarkDetail?.description)}
                                </Text>
                                <Card className="absolute w-full text-wrap z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </Card>
                            </div>
                        </Flex>
                        <Flex className="w-fit gap-4">
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
                                    RunBenchmark(c)
                                }}
                            />
                        </Flex>
                    </Flex> */}
                    <Flex flexDirection="col" className="w-full mt-4">
                        <Flex className="bg-white  w-full border-solid border-2    rounded-xl p-4">
                            <LineChart
                                className="w-full"
                                series={[
                                    {
                                        title: 'Site 1',
                                        type: 'line',
                                        data: [
                                            {
                                                x: new Date(1600979400000),
                                                y: 58020,
                                            },
                                            {
                                                x: new Date(1600980300000),
                                                y: 102402,
                                            },
                                            {
                                                x: new Date(1600981200000),
                                                y: 104920,
                                            },
                                            {
                                                x: new Date(1600982100000),
                                                y: 94031,
                                            },
                                            {
                                                x: new Date(1600983000000),
                                                y: 125021,
                                            },
                                            {
                                                x: new Date(1600983900000),
                                                y: 159219,
                                            },
                                            {
                                                x: new Date(1600984800000),
                                                y: 193082,
                                            },
                                            {
                                                x: new Date(1600985700000),
                                                y: 162592,
                                            },
                                            {
                                                x: new Date(1600986600000),
                                                y: 274021,
                                            },
                                            {
                                                x: new Date(1600987500000),
                                                y: 264286,
                                            },
                                            {
                                                x: new Date(1600988400000),
                                                y: 289210,
                                            },
                                            {
                                                x: new Date(1600989300000),
                                                y: 256362,
                                            },
                                            {
                                                x: new Date(1600990200000),
                                                y: 257306,
                                            },
                                            {
                                                x: new Date(1600991100000),
                                                y: 186776,
                                            },
                                            {
                                                x: new Date(1600992000000),
                                                y: 294020,
                                            },
                                            {
                                                x: new Date(1600992900000),
                                                y: 385975,
                                            },
                                            {
                                                x: new Date(1600993800000),
                                                y: 486039,
                                            },
                                            {
                                                x: new Date(1600994700000),
                                                y: 490447,
                                            },
                                            {
                                                x: new Date(1600995600000),
                                                y: 361845,
                                            },
                                            {
                                                x: new Date(1600996500000),
                                                y: 339058,
                                            },
                                            {
                                                x: new Date(1600997400000),
                                                y: 298028,
                                            },
                                            {
                                                x: new Date(1600998300000),
                                                y: 231902,
                                            },
                                            {
                                                x: new Date(1600999200000),
                                                y: 224558,
                                            },
                                            {
                                                x: new Date(1601000100000),
                                                y: 253901,
                                            },
                                            {
                                                x: new Date(1601001000000),
                                                y: 102839,
                                            },
                                            {
                                                x: new Date(1601001900000),
                                                y: 234943,
                                            },
                                            {
                                                x: new Date(1601002800000),
                                                y: 204405,
                                            },
                                            {
                                                x: new Date(1601003700000),
                                                y: 190391,
                                            },
                                            {
                                                x: new Date(1601004600000),
                                                y: 183570,
                                            },
                                            {
                                                x: new Date(1601005500000),
                                                y: 162592,
                                            },
                                            {
                                                x: new Date(1601006400000),
                                                y: 148910,
                                            },
                                            {
                                                x: new Date(1601007300000),
                                                y: 229492,
                                            },
                                            {
                                                x: new Date(1601008200000),
                                                y: 293910,
                                            },
                                        ],
                                        valueFormatter: function s(e) {
                                            return Math.abs(e) >= 1e9
                                                ? (e / 1e9)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'G'
                                                : Math.abs(e) >= 1e6
                                                ? (e / 1e6)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'M'
                                                : Math.abs(e) >= 1e3
                                                ? (e / 1e3)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'K'
                                                : e.toFixed(2)
                                        },
                                    },
                                    {
                                        title: 'Site 2',
                                        type: 'line',
                                        data: [
                                            {
                                                x: new Date(1600979400000),
                                                y: 151023,
                                            },
                                            {
                                                x: new Date(1600980300000),
                                                y: 169975,
                                            },
                                            {
                                                x: new Date(1600981200000),
                                                y: 176980,
                                            },
                                            {
                                                x: new Date(1600982100000),
                                                y: 168852,
                                            },
                                            {
                                                x: new Date(1600983000000),
                                                y: 149130,
                                            },
                                            {
                                                x: new Date(1600983900000),
                                                y: 147299,
                                            },
                                            {
                                                x: new Date(1600984800000),
                                                y: 169552,
                                            },
                                            {
                                                x: new Date(1600985700000),
                                                y: 163401,
                                            },
                                            {
                                                x: new Date(1600986600000),
                                                y: 154091,
                                            },
                                            {
                                                x: new Date(1600987500000),
                                                y: 199516,
                                            },
                                            {
                                                x: new Date(1600988400000),
                                                y: 195503,
                                            },
                                            {
                                                x: new Date(1600989300000),
                                                y: 189953,
                                            },
                                            {
                                                x: new Date(1600990200000),
                                                y: 181635,
                                            },
                                            {
                                                x: new Date(1600991100000),
                                                y: 192975,
                                            },
                                            {
                                                x: new Date(1600992000000),
                                                y: 205951,
                                            },
                                            {
                                                x: new Date(1600992900000),
                                                y: 218958,
                                            },
                                            {
                                                x: new Date(1600993800000),
                                                y: 220516,
                                            },
                                            {
                                                x: new Date(1600994700000),
                                                y: 213557,
                                            },
                                            {
                                                x: new Date(1600995600000),
                                                y: 165899,
                                            },
                                            {
                                                x: new Date(1600996500000),
                                                y: 173557,
                                            },
                                            {
                                                x: new Date(1600997400000),
                                                y: 172331,
                                            },
                                            {
                                                x: new Date(1600998300000),
                                                y: 186492,
                                            },
                                            {
                                                x: new Date(1600999200000),
                                                y: 131541,
                                            },
                                            {
                                                x: new Date(1601000100000),
                                                y: 142262,
                                            },
                                            {
                                                x: new Date(1601001000000),
                                                y: 194091,
                                            },
                                            {
                                                x: new Date(1601001900000),
                                                y: 185899,
                                            },
                                            {
                                                x: new Date(1601002800000),
                                                y: 173401,
                                            },
                                            {
                                                x: new Date(1601003700000),
                                                y: 171635,
                                            },
                                            {
                                                x: new Date(1601004600000),
                                                y: 179130,
                                            },
                                            {
                                                x: new Date(1601005500000),
                                                y: 185951,
                                            },
                                            {
                                                x: new Date(1601006400000),
                                                y: 144091,
                                            },
                                            {
                                                x: new Date(1601007300000),
                                                y: 152975,
                                            },
                                            {
                                                x: new Date(1601008200000),
                                                y: 157299,
                                            },
                                        ],
                                        valueFormatter: function s(e) {
                                            return Math.abs(e) >= 1e9
                                                ? (e / 1e9)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'G'
                                                : Math.abs(e) >= 1e6
                                                ? (e / 1e6)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'M'
                                                : Math.abs(e) >= 1e3
                                                ? (e / 1e3)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'K'
                                                : e.toFixed(2)
                                        },
                                    },
                                    {
                                        title: 'Performance goal',
                                        type: 'threshold',
                                        y: 250000,
                                        valueFormatter: function s(e) {
                                            return Math.abs(e) >= 1e9
                                                ? (e / 1e9)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'G'
                                                : Math.abs(e) >= 1e6
                                                ? (e / 1e6)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'M'
                                                : Math.abs(e) >= 1e3
                                                ? (e / 1e3)
                                                      .toFixed(1)
                                                      .replace(/\.0$/, '') + 'K'
                                                : e.toFixed(2)
                                        },
                                    },
                                ]}
                                xDomain={[
                                    new Date(1600979400000),
                                    new Date(1601008200000),
                                ]}
                                yDomain={[0, 500000]}
                                i18nStrings={{
                                    xTickFormatter: (e) =>
                                        e
                                            .toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: !1,
                                            })
                                            .split(',')
                                            .join('\n'),
                                    yTickFormatter: function s(e) {
                                        return Math.abs(e) >= 1e9
                                            ? (e / 1e9)
                                                  .toFixed(1)
                                                  .replace(/\.0$/, '') + 'G'
                                            : Math.abs(e) >= 1e6
                                            ? (e / 1e6)
                                                  .toFixed(1)
                                                  .replace(/\.0$/, '') + 'M'
                                            : Math.abs(e) >= 1e3
                                            ? (e / 1e3)
                                                  .toFixed(1)
                                                  .replace(/\.0$/, '') + 'K'
                                            : e.toFixed(2)
                                    },
                                }}
                                ariaLabel="Multiple data series line chart"
                                fitHeight
                                height={300}
                                hideFilter
                                xScaleType="time"
                                xTitle="Time (UTC)"
                                yTitle="Bytes transferred"
                                empty={
                                    <Box textAlign="center" color="inherit">
                                        <b>No data available</b>
                                        <Box variant="p" color="inherit">
                                            There is no data available
                                        </Box>
                                    </Box>
                                }
                                noMatch={
                                    <Box textAlign="center" color="inherit">
                                        <b>No matching data</b>
                                        <Box variant="p" color="inherit">
                                            There is no matching data to display
                                        </Box>
                                        <Button>Clear filter</Button>
                                    </Box>
                                }
                            />
                        </Flex>
                        <Flex className="mt-2">
                            <Tabs
                                className="mt-6 rounded-[1px] rounded-s-none rounded-e-none"
                                // variant="container"
                                tabs={[
                                    {
                                        label: 'Controls',
                                        id: 'second',
                                        content: (
                                            <div className="w-full flex flex-row justify-start items-start ">
                                                <div className="w-11/12">
                                                    <Controls
                                                        id={String(benchmarkId)}
                                                        assignments={
                                                            trend === null
                                                                ? 0
                                                                : 1
                                                        }
                                                        enable={enable}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    },
                                    // {
                                    //     label: 'Summary',
                                    //     id: 'first',
                                    //     content: (
                                    //         <Flex
                                    //             className="w-full flex-wrap"
                                    //             flexDirection="col"
                                    //         >
                                    //             {/* {hideKPIs ? (
                                    //                 ''
                                    //             ) : (
                                    //                 <Grid
                                    //                     numItems={4}
                                    //                     className="w-full gap-4 mb-4"
                                    //                 >
                                    //                     <SummaryCard
                                    //                         title="Security Score"
                                    //                         metric={
                                    //                             ((benchmarkKPIEnd
                                    //                                 ?.controlsSeverityStatus
                                    //                                 ?.total?.passed ||
                                    //                                 0) /
                                    //                                 (benchmarkKPIEnd
                                    //                                     ?.controlsSeverityStatus
                                    //                                     ?.total
                                    //                                     ?.total || 1)) *
                                    //                                 100 || 0
                                    //                         }
                                    //                         metricPrev={
                                    //                             ((benchmarkKPIStart
                                    //                                 ?.controlsSeverityStatus
                                    //                                 ?.total?.passed ||
                                    //                                 0) /
                                    //                                 (benchmarkKPIStart
                                    //                                     ?.controlsSeverityStatus
                                    //                                     ?.total
                                    //                                     ?.total || 1)) *
                                    //                                 100 || 0
                                    //                         }
                                    //                         isPercent
                                    //                         loading={
                                    //                             benchmarkKPIEndLoading ||
                                    //                             benchmarkKPIStartLoading
                                    //                         }
                                    //                     />
                                    //                     <SummaryCard
                                    //                         title="Issues"
                                    //                         metric={
                                    //                             benchmarkKPIEnd
                                    //                                 ?.conformanceStatusSummary
                                    //                                 ?.failed
                                    //                         }
                                    //                         metricPrev={
                                    //                             benchmarkKPIStart
                                    //                                 ?.conformanceStatusSummary
                                    //                                 ?.failed
                                    //                         }
                                    //                         loading={
                                    //                             benchmarkKPIEndLoading ||
                                    //                             benchmarkKPIStartLoading
                                    //                         }
                                    //                     />

                                    //                     <SummaryCard
                                    //                         title="Passed"
                                    //                         metric={
                                    //                             benchmarkKPIEnd
                                    //                                 ?.conformanceStatusSummary
                                    //                                 ?.passed
                                    //                         }
                                    //                         metricPrev={
                                    //                             benchmarkKPIStart
                                    //                                 ?.conformanceStatusSummary
                                    //                                 ?.passed
                                    //                         }
                                    //                         loading={
                                    //                             benchmarkKPIEndLoading ||
                                    //                             benchmarkKPIStartLoading
                                    //                         }
                                    //                     />

                                    //                     <SummaryCard
                                    //                         title="Accounts"
                                    //                         metric={
                                    //                             benchmarkKPIEnd
                                    //                                 ?.connectionsStatus
                                    //                                 ?.total
                                    //                         }
                                    //                         metricPrev={
                                    //                             benchmarkKPIStart
                                    //                                 ?.connectionsStatus
                                    //                                 ?.total
                                    //                         }
                                    //                         loading={
                                    //                             benchmarkKPIEndLoading ||
                                    //                             benchmarkKPIStartLoading
                                    //                         }
                                    //                     />
                                    //                 </Grid>
                                    //             )} */}
                                    //             {trend === null ? (
                                    //                 ''
                                    //             ) : (
                                    //                 // <BenchmarkChart
                                    //                 //     title="Security Score"
                                    //                 //     isLoading={trendLoading}
                                    //                 //     trend={trend}
                                    //                 //     error={toErrorMessage(
                                    //                 //         trendError
                                    //                 //     )}
                                    //                 //     onRefresh={() => sendTrend()}
                                    //                 // />
                                    //                 <>
                                    //                     <LineChart
                                    //                         className="w-full"
                                    //                         series={[
                                    //                             {
                                    //                                 title: 'Site 1',
                                    //                                 type: 'line',
                                    //                                 data: [
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600979400000
                                    //                                         ),
                                    //                                         y: 58020,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600980300000
                                    //                                         ),
                                    //                                         y: 102402,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600981200000
                                    //                                         ),
                                    //                                         y: 104920,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600982100000
                                    //                                         ),
                                    //                                         y: 94031,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600983000000
                                    //                                         ),
                                    //                                         y: 125021,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600983900000
                                    //                                         ),
                                    //                                         y: 159219,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600984800000
                                    //                                         ),
                                    //                                         y: 193082,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600985700000
                                    //                                         ),
                                    //                                         y: 162592,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600986600000
                                    //                                         ),
                                    //                                         y: 274021,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600987500000
                                    //                                         ),
                                    //                                         y: 264286,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600988400000
                                    //                                         ),
                                    //                                         y: 289210,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600989300000
                                    //                                         ),
                                    //                                         y: 256362,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600990200000
                                    //                                         ),
                                    //                                         y: 257306,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600991100000
                                    //                                         ),
                                    //                                         y: 186776,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600992000000
                                    //                                         ),
                                    //                                         y: 294020,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600992900000
                                    //                                         ),
                                    //                                         y: 385975,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600993800000
                                    //                                         ),
                                    //                                         y: 486039,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600994700000
                                    //                                         ),
                                    //                                         y: 490447,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600995600000
                                    //                                         ),
                                    //                                         y: 361845,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600996500000
                                    //                                         ),
                                    //                                         y: 339058,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600997400000
                                    //                                         ),
                                    //                                         y: 298028,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600998300000
                                    //                                         ),
                                    //                                         y: 231902,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600999200000
                                    //                                         ),
                                    //                                         y: 224558,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601000100000
                                    //                                         ),
                                    //                                         y: 253901,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601001000000
                                    //                                         ),
                                    //                                         y: 102839,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601001900000
                                    //                                         ),
                                    //                                         y: 234943,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601002800000
                                    //                                         ),
                                    //                                         y: 204405,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601003700000
                                    //                                         ),
                                    //                                         y: 190391,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601004600000
                                    //                                         ),
                                    //                                         y: 183570,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601005500000
                                    //                                         ),
                                    //                                         y: 162592,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601006400000
                                    //                                         ),
                                    //                                         y: 148910,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601007300000
                                    //                                         ),
                                    //                                         y: 229492,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601008200000
                                    //                                         ),
                                    //                                         y: 293910,
                                    //                                     },
                                    //                                 ],
                                    //                                 valueFormatter:
                                    //                                     function s(e) {
                                    //                                         return Math.abs(
                                    //                                             e
                                    //                                         ) >= 1e9
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e9
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                                   'G'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e6
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e6
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'M'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e3
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e3
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'K'
                                    //                                             : e.toFixed(
                                    //                                                   2
                                    //                                               )
                                    //                                     },
                                    //                             },
                                    //                             {
                                    //                                 title: 'Site 2',
                                    //                                 type: 'line',
                                    //                                 data: [
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600979400000
                                    //                                         ),
                                    //                                         y: 151023,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600980300000
                                    //                                         ),
                                    //                                         y: 169975,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600981200000
                                    //                                         ),
                                    //                                         y: 176980,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600982100000
                                    //                                         ),
                                    //                                         y: 168852,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600983000000
                                    //                                         ),
                                    //                                         y: 149130,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600983900000
                                    //                                         ),
                                    //                                         y: 147299,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600984800000
                                    //                                         ),
                                    //                                         y: 169552,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600985700000
                                    //                                         ),
                                    //                                         y: 163401,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600986600000
                                    //                                         ),
                                    //                                         y: 154091,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600987500000
                                    //                                         ),
                                    //                                         y: 199516,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600988400000
                                    //                                         ),
                                    //                                         y: 195503,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600989300000
                                    //                                         ),
                                    //                                         y: 189953,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600990200000
                                    //                                         ),
                                    //                                         y: 181635,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600991100000
                                    //                                         ),
                                    //                                         y: 192975,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600992000000
                                    //                                         ),
                                    //                                         y: 205951,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600992900000
                                    //                                         ),
                                    //                                         y: 218958,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600993800000
                                    //                                         ),
                                    //                                         y: 220516,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600994700000
                                    //                                         ),
                                    //                                         y: 213557,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600995600000
                                    //                                         ),
                                    //                                         y: 165899,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600996500000
                                    //                                         ),
                                    //                                         y: 173557,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600997400000
                                    //                                         ),
                                    //                                         y: 172331,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600998300000
                                    //                                         ),
                                    //                                         y: 186492,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1600999200000
                                    //                                         ),
                                    //                                         y: 131541,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601000100000
                                    //                                         ),
                                    //                                         y: 142262,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601001000000
                                    //                                         ),
                                    //                                         y: 194091,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601001900000
                                    //                                         ),
                                    //                                         y: 185899,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601002800000
                                    //                                         ),
                                    //                                         y: 173401,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601003700000
                                    //                                         ),
                                    //                                         y: 171635,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601004600000
                                    //                                         ),
                                    //                                         y: 179130,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601005500000
                                    //                                         ),
                                    //                                         y: 185951,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601006400000
                                    //                                         ),
                                    //                                         y: 144091,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601007300000
                                    //                                         ),
                                    //                                         y: 152975,
                                    //                                     },
                                    //                                     {
                                    //                                         x: new Date(
                                    //                                             1601008200000
                                    //                                         ),
                                    //                                         y: 157299,
                                    //                                     },
                                    //                                 ],
                                    //                                 valueFormatter:
                                    //                                     function s(e) {
                                    //                                         return Math.abs(
                                    //                                             e
                                    //                                         ) >= 1e9
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e9
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                                   'G'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e6
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e6
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'M'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e3
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e3
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'K'
                                    //                                             : e.toFixed(
                                    //                                                   2
                                    //                                               )
                                    //                                     },
                                    //                             },
                                    //                             {
                                    //                                 title: 'Performance goal',
                                    //                                 type: 'threshold',
                                    //                                 y: 250000,
                                    //                                 valueFormatter:
                                    //                                     function s(e) {
                                    //                                         return Math.abs(
                                    //                                             e
                                    //                                         ) >= 1e9
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e9
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                                   'G'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e6
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e6
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'M'
                                    //                                             : Math.abs(
                                    //                                                   e
                                    //                                               ) >=
                                    //                                               1e3
                                    //                                             ? (
                                    //                                                   e /
                                    //                                                   1e3
                                    //                                               )
                                    //                                                   .toFixed(
                                    //                                                       1
                                    //                                                   )
                                    //                                                   .replace(
                                    //                                                       /\.0$/,
                                    //                                                       ''
                                    //                                                   ) +
                                    //                                               'K'
                                    //                                             : e.toFixed(
                                    //                                                   2
                                    //                                               )
                                    //                                     },
                                    //                             },
                                    //                         ]}
                                    //                         xDomain={[
                                    //                             new Date(1600979400000),
                                    //                             new Date(1601008200000),
                                    //                         ]}
                                    //                         yDomain={[0, 500000]}
                                    //                         i18nStrings={{
                                    //                             xTickFormatter: (e) =>
                                    //                                 e
                                    //                                     .toLocaleDateString(
                                    //                                         'en-US',
                                    //                                         {
                                    //                                             month: 'short',
                                    //                                             day: 'numeric',
                                    //                                             hour: 'numeric',
                                    //                                             minute: 'numeric',
                                    //                                             hour12: !1,
                                    //                                         }
                                    //                                     )
                                    //                                     .split(',')
                                    //                                     .join('\n'),
                                    //                             yTickFormatter:
                                    //                                 function s(e) {
                                    //                                     return Math.abs(
                                    //                                         e
                                    //                                     ) >= 1e9
                                    //                                         ? (e / 1e9)
                                    //                                               .toFixed(
                                    //                                                   1
                                    //                                               )
                                    //                                               .replace(
                                    //                                                   /\.0$/,
                                    //                                                   ''
                                    //                                               ) +
                                    //                                               'G'
                                    //                                         : Math.abs(
                                    //                                               e
                                    //                                           ) >= 1e6
                                    //                                         ? (e / 1e6)
                                    //                                               .toFixed(
                                    //                                                   1
                                    //                                               )
                                    //                                               .replace(
                                    //                                                   /\.0$/,
                                    //                                                   ''
                                    //                                               ) +
                                    //                                           'M'
                                    //                                         : Math.abs(
                                    //                                               e
                                    //                                           ) >= 1e3
                                    //                                         ? (e / 1e3)
                                    //                                               .toFixed(
                                    //                                                   1
                                    //                                               )
                                    //                                               .replace(
                                    //                                                   /\.0$/,
                                    //                                                   ''
                                    //                                               ) +
                                    //                                           'K'
                                    //                                         : e.toFixed(
                                    //                                               2
                                    //                                           )
                                    //                                 },
                                    //                         }}
                                    //                         ariaLabel="Multiple data series line chart"
                                    //                         fitHeight
                                    //                         height={300}
                                    //                         hideFilter
                                    //                         xScaleType="time"
                                    //                         xTitle="Time (UTC)"
                                    //                         yTitle="Bytes transferred"
                                    //                         empty={
                                    //                             <Box
                                    //                                 textAlign="center"
                                    //                                 color="inherit"
                                    //                             >
                                    //                                 <b>
                                    //                                     No data
                                    //                                     available
                                    //                                 </b>
                                    //                                 <Box
                                    //                                     variant="p"
                                    //                                     color="inherit"
                                    //                                 >
                                    //                                     There is no data
                                    //                                     available
                                    //                                 </Box>
                                    //                             </Box>
                                    //                         }
                                    //                         noMatch={
                                    //                             <Box
                                    //                                 textAlign="center"
                                    //                                 color="inherit"
                                    //                             >
                                    //                                 <b>
                                    //                                     No matching data
                                    //                                 </b>
                                    //                                 <Box
                                    //                                     variant="p"
                                    //                                     color="inherit"
                                    //                                 >
                                    //                                     There is no
                                    //                                     matching data to
                                    //                                     display
                                    //                                 </Box>
                                    //                                 <Button>
                                    //                                     Clear filter
                                    //                                 </Button>
                                    //                             </Box>
                                    //                         }
                                    //                     />
                                    //                 </>
                                    //             )}
                                    //         </Flex>
                                    //     ),
                                    //     disabled: true,
                                    //     disabledReason: 'COMING SOON',
                                    // },

                                    {
                                        label: 'Incidents',
                                        id: 'third',
                                        content: (
                                            <Findings
                                                id={
                                                    benchmarkId
                                                        ? benchmarkId
                                                        : ''
                                                }
                                            />
                                        ),
                                        disabled: enable ? false : true,
                                        disabledReason:
                                            'This is available when the Framework has at least one assignments.',
                                    },
                                    {
                                        label: 'Scope Assignments',
                                        id: 'fourth',
                                        content: (
                                            <Settings
                                                id={benchmarkDetail?.id}
                                                response={(e) =>
                                                    setAssignments(e)
                                                }
                                                autoAssign={
                                                    benchmarkDetail?.autoAssign
                                                }
                                                tracksDriftEvents={
                                                    benchmarkDetail?.tracksDriftEvents
                                                }
                                                isAutoResponse={(x) =>
                                                    setRecall(true)
                                                }
                                                reload={() => updateDetail()}
                                            />
                                        ),
                                        disabled: false,
                                    },
                                    // {
                                    //     label: 'Run History',
                                    //     id: 'fifth',
                                    //     content: (
                                    //         <EvaluateTable
                                    //             id={benchmarkDetail?.id}
                                    //             benchmarkDetail={benchmarkDetail}
                                    //             assignmentsCount={assignments}
                                    //             onEvaluate={(c) => {
                                    //                 triggerEvaluate(
                                    //                     {
                                    //                         benchmark_id: [
                                    //                             benchmarkId || '',
                                    //                         ],
                                    //                         connection_id: c,
                                    //                     },
                                    //                     {}
                                    //                 )
                                    //             }}
                                    //         />
                                    //     ),
                                    //     disabled: true,
                                    //     disabledReason: 'COMING SOON',
                                    // },
                                ]}
                            />
                        </Flex>
                    </Flex>

                    {/* <TabGroup
                        className="mt-2"
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
                            /> 
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
                    </TabGroup> */}
                </>
            )}
        </>
    )
}
