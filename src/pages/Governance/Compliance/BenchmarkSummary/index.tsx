import { useParams } from 'react-router-dom'
import { Button, Card, Flex, Grid, Text, Title } from '@tremor/react'
import { useEffect, useState } from 'react'
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'
import {
    useComplianceApiV1BenchmarksSummaryDetail,
    useComplianceApiV1BenchmarksTrendDetail,
    useComplianceApiV1FindingEventsCountList,
    useComplianceApiV1FindingsTopDetail,
} from '../../../../api/compliance.gen'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../../api/schedule.gen'
import {
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

const benchmarkTrend = (
    response:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkTrendDatapoint[]
        | undefined,
    view: 'count' | 'percent'
) => {
    return response?.map((item) => {
        if (view === 'count') {
            const data = {
                ...item,
                stack: Object.entries(item.checks || {}).map(([key, value]) => {
                    return {
                        name: camelCaseToLabel(key).split(' ')[0],
                        count: value,
                    }
                }),
            }
            data.stack.push({
                name: 'Passed',
                count: item.conformanceStatusSummary?.passed,
            })

            return data
        }

        const data = {
            ...item,
            stack: Object.entries(item.checks || {}).map(([key, value]) => {
                return {
                    name: camelCaseToLabel(key).split(' ')[0],
                    count: (
                        ((value || 0) /
                            ((item.conformanceStatusSummary?.total || 0) +
                                (item.conformanceStatusSummary?.passed || 0) ||
                                1)) *
                        100
                    ).toFixed(2),
                }
            }),
        }
        data.stack.push({
            name: 'Passed',
            count: (
                ((item.conformanceStatusSummary?.passed || 0) /
                    ((item.conformanceStatusSummary?.total || 0) +
                        (item.conformanceStatusSummary?.passed || 0) || 1)) *
                100
            ).toFixed(2),
        })

        return data
    })
}

export default function BenchmarkSummary() {
    const { value: activeTimeRange } = useUrlDateRangeState(defaultTime)
    const { benchmarkId, resourceId } = useParams()
    const { value: selectedConnections } = useFilterState()
    const [openTop, setOpenTop] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [assignments, setAssignments] = useState(0)
    const [recall, setRecall] = useState(false)
    const [chartLayout, setChartLayout] = useURLParam<'count' | 'percent'>(
        'show',
        'percent'
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
    const { sendNow: triggerEvaluate, isExecuted } =
        useScheduleApiV1ComplianceTriggerUpdate(String(benchmarkId), {}, false)
    const { response: benchmarkKPIStart, isLoading: benchmarkKPIStartLoading } =
        useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
            ...topQuery,
            timeAt: activeTimeRange.start.unix(),
        })
    const { response: benchmarkKPIEnd, isLoading: benchmarkKPIEndLoading } =
        useComplianceApiV1BenchmarksSummaryDetail(String(benchmarkId), {
            ...topQuery,
            timeAt: activeTimeRange.end.unix(),
        })
    const { response: events, isLoading: eventsLoading } =
        useComplianceApiV1FindingEventsCountList({
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

    return (
        <>
            <TopHeader
                breadCrumb={[
                    benchmarkDetail?.title
                        ? benchmarkDetail?.title
                        : 'Benchmark summary',
                ]}
                filter
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
                                <Button
                                    icon={ArrowPathRoundedSquareIcon}
                                    onClick={() => setOpenConfirm(true)}
                                    loading={
                                        !(
                                            benchmarkDetail?.lastJobStatus ===
                                                'FAILED' ||
                                            benchmarkDetail?.lastJobStatus ===
                                                'SUCCEEDED'
                                        )
                                    }
                                >
                                    {benchmarkDetail?.lastJobStatus ===
                                        'FAILED' ||
                                    benchmarkDetail?.lastJobStatus ===
                                        'SUCCEEDED'
                                        ? 'Evaluate now'
                                        : 'Evaluating'}
                                    {/* <Text className="whitespace-nowrap">{`Last evaluation: ${dateTimeDisplay(
                                    benchmarkDetail?.evaluatedAt
                                )}`}</Text> */}
                                </Button>
                            )}
                        </Flex>
                        <Modal
                            open={openConfirm}
                            onClose={() => setOpenConfirm(false)}
                        >
                            <Title>
                                {`Do you want to run evaluation on ${assignments} accounts?`}
                            </Title>
                            <Flex className="mt-8">
                                <Button
                                    variant="secondary"
                                    onClick={() => setOpenConfirm(false)}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() => {
                                        triggerEvaluate()
                                        setOpenConfirm(false)
                                    }}
                                >
                                    Evaluate
                                </Button>
                            </Flex>
                        </Modal>
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
                        trend={benchmarkTrend(trend, chartLayout)}
                        error={toErrorMessage(trendError)}
                        onRefresh={() => sendTrend()}
                        chartLayout={chartLayout}
                        setChartLayout={setChartLayout}
                        validChartLayouts={['count', 'percent']}
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
