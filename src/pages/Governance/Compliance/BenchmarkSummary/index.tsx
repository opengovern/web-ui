import { useParams } from 'react-router-dom'
import { Button, Card, Flex, Grid, Text, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingEventsCountList,
} from '../../../../api/compliance.gen'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint,
    GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse,
} from '../../../../api/api'
import Spinner from '../../../../components/Spinner'
import Controls from '../../Controls'
import Settings from './Settings'
import Modal from '../../../../components/Modal'
import TopHeader from '../../../../components/Layout/Header'
import {
    defaultTime,
    useFilterState,
    useUrlDateRangeState,
    useURLParam,
} from '../../../../utilities/urlstate'
import { camelCaseToLabel } from '../../../../utilities/labelMaker'
import BenchmarkChart from '../../../../components/Benchmark/Chart'
import { toErrorMessage } from '../../../../types/apierror'
import { ChartType } from '../../../../components/Asset/Chart/Selectors'
import SummaryCard from '../../../../components/Cards/SummaryCard'
import Evaluate from './Evaluate'

const topResources = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined
) => {
    const data = []
    if (input && input.records) {
        for (let i = 0; i < (input.records?.length || 0); i += 1) {
            data.push({
                name:
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    input.records[i].ResourceType.resource_name.length
                        ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          input.records[i].ResourceType.resource_name
                        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          input.records[i].ResourceType.resource_type,
                value: input.records[i].count || 0,
            })
        }
    }
    return data
}

const topConnections = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined,
    id: string | undefined
) => {
    const top = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Connection?.providerConnectionName,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                href: `${id}/account_${input.records[i].Connection?.id}`,
                value: input.records[i].count || 0,
            })
        }
    }
    return top
}

const topControls = (
    input:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiGetTopFieldResponse
        | undefined,
    id: string | undefined
) => {
    const top = []
    if (input && input.records) {
        for (let i = 0; i < input.records.length; i += 1) {
            top.push({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                name: input.records[i].Control?.title,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                href: `${id}/${input.records[i].Control?.id}`,
                value: input.records[i].count || 0,
            })
        }
    }
    return top
}

export interface ITrendItem {
    stack: IStackItem[]
    timestamp: string | undefined
}

export interface IStackItem {
    name: string
    count: number
}

const failed = (
    v:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult
        | undefined
) => {
    return (v?.total || 0) - (v?.passed || 0)
}

const benchmarkTrend = (
    response:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
        | undefined,
    includePassed: 'True' | 'False',
    show: 'Conformance Status' | 'Severity' | 'Security Score',
    view: 'Findings' | 'Controls'
): ITrendItem[] => {
    return (
        response?.map((item) => {
            if (view === 'Findings') {
                const data = {
                    critical: item.checks?.criticalCount,
                    high: item.checks?.highCount,
                    medium: item.checks?.mediumCount,
                    low: item.checks?.lowCount,
                    none: item.checks?.noneCount,
                }

                const stack: IStackItem[] = Object.entries(data).map(
                    ([key, value]) => {
                        return {
                            name: camelCaseToLabel(key),
                            count: value || 0,
                        }
                    }
                )

                if (includePassed === 'True') {
                    stack.push({
                        name: 'Passed',
                        count: item.conformanceStatusSummary?.passed || 0,
                    })
                }
                return {
                    timestamp: item.timestamp,
                    stack,
                }
            }

            if (view === 'Controls') {
                const data = {
                    critical: failed(item.controlsSeverityStatus?.critical),
                    high: failed(item.controlsSeverityStatus?.high),
                    medium: failed(item.controlsSeverityStatus?.medium),
                    low: failed(item.controlsSeverityStatus?.low),
                    none: failed(item.controlsSeverityStatus?.none),
                }

                const stack: IStackItem[] = Object.entries(data).map(
                    ([key, value]) => {
                        return {
                            name: camelCaseToLabel(key),
                            count: value || 0,
                        }
                    }
                )

                if (includePassed === 'True') {
                    stack.push({
                        name: 'Passed',
                        count: item.controlsSeverityStatus?.total?.passed || 0,
                    })
                }
                return {
                    timestamp: item.timestamp,
                    stack,
                }
            }

            return {
                timestamp: item.timestamp,
                stack: [],
            }
        }) || []
    )
}

export default function BenchmarkSummary() {
    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { benchmarkId, resourceId } = useParams()
    const { value: selectedConnections } = useFilterState()
    const [assignments, setAssignments] = useState(0)
    const [recall, setRecall] = useState(false)
    const [includePassed, setIncludePassed] = useURLParam<'True' | 'False'>(
        'includePassed',
        'False'
    )
    const [show, setShow] = useURLParam<
        'Conformance Status' | 'Severity' | 'Security Score'
    >('show', 'Severity')
    const [view, setView] = useURLParam<'Findings' | 'Controls'>(
        'view',
        'Controls'
    )

    const [chartType, setChartType] = useURLParam<ChartType>('chartType', 'bar')

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
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
    const { sendNowWithParams: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(
            String(benchmarkId),
            { connection_id: selectedAccounts },
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
    const {
        response: events,
        isLoading: eventsLoading,
        sendNow: eventsSend,
    } = useComplianceApiV1FindingEventsCountList({
        benchmarkID: benchmarkId ? [benchmarkId] : undefined,
        startTime: activeTimeRange.start.unix(),
        endTime: activeTimeRange.end.unix(),
    })
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

    useEffect(() => {
        if (isExecuted || recall) {
            updateDetail()
        }
    }, [isExecuted, recall])

    useEffect(() => {
        benchmarkKPIStartSend()
        benchmarkKPIEndSend()
        eventsSend()
        sendTrend()
    }, [activeTimeRange])

    return (
        <>
            <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                filter
                datePicker
            />
            {isLoading ? (
                <Spinner className="mt-56" />
            ) : (
                <>
                    <Flex alignItems="start" className="mb-6">
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            justifyContent="start"
                            className="gap-2 w-3/4"
                        >
                            <Title className="font-semibold">
                                {benchmarkDetail?.title}
                            </Title>
                            <div className="group w-full relative flex justify-center">
                                <Text className="truncate">
                                    {benchmarkDetail?.description}
                                </Text>
                                <Card className="absolute w-full z-40 top-0 scale-0 transition-all p-2 group-hover:scale-100">
                                    <Text>{benchmarkDetail?.description}</Text>
                                </Card>
                            </div>
                        </Flex>
                        <Flex className="w-fit gap-4">
                            <Settings
                                id={benchmarkDetail?.id}
                                response={(e) => setAssignments(e)}
                                autoAssign={benchmarkDetail?.autoAssign}
                                isAutoResponse={(x) => setRecall(true)}
                            />
                            {assignments > 0 && (
                                <Evaluate
                                    id={benchmarkDetail?.id}
                                    benchmarkDetail={benchmarkDetail}
                                    onEvaluate={(c) => {
                                        setSelectedAccounts(() => c)
                                        triggerEvaluate(
                                            String(benchmarkId),
                                            {
                                                connection_id: c,
                                            },
                                            {}
                                        )
                                    }}
                                />
                            )}
                        </Flex>
                    </Flex>
                    <Grid numItems={4} className="w-full gap-4 mb-4">
                        <SummaryCard
                            title="Issues"
                            metric={
                                benchmarkKPIEnd?.conformanceStatusSummary?.total
                            }
                            metricPrev={
                                benchmarkKPIStart?.conformanceStatusSummary
                                    ?.total
                            }
                            loading={
                                benchmarkKPIEndLoading ||
                                benchmarkKPIStartLoading
                            }
                        />
                        <SummaryCard
                            title="Passed"
                            metric={
                                benchmarkKPIEnd?.conformanceStatusSummary
                                    ?.passed
                            }
                            metricPrev={
                                benchmarkKPIStart?.conformanceStatusSummary
                                    ?.passed
                            }
                            loading={
                                benchmarkKPIEndLoading ||
                                benchmarkKPIStartLoading
                            }
                        />
                        <SummaryCard
                            title="Accounts"
                            metric={benchmarkKPIEnd?.connectionsStatus?.total}
                            metricPrev={
                                benchmarkKPIStart?.connectionsStatus?.total
                            }
                            loading={
                                benchmarkKPIEndLoading ||
                                benchmarkKPIStartLoading
                            }
                        />
                        <SummaryCard
                            title="Events"
                            metric={events?.count}
                            loading={eventsLoading}
                        />
                    </Grid>
                    <BenchmarkChart
                        title="Security Score"
                        isLoading={trendLoading}
                        trend={benchmarkTrend(trend, includePassed, show, view)}
                        error={toErrorMessage(trendError)}
                        onRefresh={() => sendTrend()}
                        includePassed={includePassed}
                        setIncludePassed={setIncludePassed}
                        view={view}
                        setView={setView}
                        show={show}
                        setShow={setShow}
                        chartType={chartType as ChartType}
                        setChartType={setChartType}
                    />
                    <Controls
                        id={String(benchmarkId)}
                        assignments={assignments}
                    />
                </>
            )}
        </>
    )
}
