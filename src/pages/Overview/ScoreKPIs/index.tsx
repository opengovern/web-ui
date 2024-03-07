import {
    Flex,
    Text,
    Title,
    ProgressCircle,
    Button,
    Grid,
    Subtitle,
} from '@tremor/react'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useScheduleApiV1ComplianceTriggerUpdate } from '../../../api/schedule.gen'
import { notificationAtom } from '../../../store'
import ScoreCategoryCard from '../../../components/Cards/ScoreCategoryCard'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import {
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary,
    GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult,
    SourceType,
} from '../../../api/api'
import { useFilterState } from '../../../utilities/urlstate'
import { getErrorMessage, toErrorMessage } from '../../../types/apierror'

function SecurityScore(
    v:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult[]
        | undefined
) {
    const total =
        v?.map((t) => t.total || 0).reduce((prev, curr) => prev + curr, 0) || 0
    const passed =
        v?.map((t) => t.passed || 0).reduce((prev, curr) => prev + curr, 0) || 0

    if (total === 0) {
        return 0
    }
    return (passed / total) * 100
}

function fixSort(t: string) {
    return t
        .replaceAll('s', 'a')
        .replaceAll('S', 'a')
        .replaceAll('c', 'b')
        .replaceAll('C', 'b')
        .replaceAll('o', 'c')
        .replaceAll('O', 'c')
        .replaceAll('r', 'd')
        .replaceAll('R', 'd')
        .replaceAll('E', 'e')
}

interface MR {
    category: string
    title: string
    summary: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary[]
}

export default function ScoreKPIs() {
    const { value: selectedConnections } = useFilterState()
    const setNotification = useSetAtom(notificationAtom)

    const query = {
        ...{ tag: ['type=SCORE'] },
        ...(selectedConnections.connections.length > 0 && {
            connectionId: selectedConnections.connections,
        }),
        ...(selectedConnections.provider !== SourceType.Nil && {
            connector: [selectedConnections.provider],
        }),
    }
    const {
        response,
        error: summaryListError,
        isLoading,
        sendNow: refresh,
    } = useComplianceApiV1BenchmarksSummaryList(query)

    const {
        sendNowWithParams: triggerEvaluate,
        isExecuted,
        error,
        isLoading: triggerIsLoading,
    } = useScheduleApiV1ComplianceTriggerUpdate(
        {
            benchmark_id: [],
        },
        {},
        false
    )

    useEffect(() => {
        if (isExecuted && !triggerIsLoading) {
            const err = getErrorMessage(error)
            if (err === '') {
                setNotification({
                    text: 'Evaluation triggered',
                    type: 'success',
                    position: 'bottomLeft',
                })
            } else {
                setNotification({
                    text: `Evaluation trigger failed due to ${err}`,
                    type: 'error',
                    position: 'bottomLeft',
                })
            }
        }
    }, [triggerIsLoading])

    const responseSorted = response?.benchmarkSummary?.sort((a, b) => {
        const aTitle = fixSort(a.title || '')
        const bTitle = fixSort(b.title || '')

        if (a.title === b.title) {
            return 0
        }

        return aTitle < bTitle ? -1 : 1
    })

    const categories = () => {
        const titleMap = new Map<string, string>()
        titleMap.set('reliability', 'Reliability')
        titleMap.set('security', 'Security')
        titleMap.set('performance_efficiency', 'Performance Efficiency')
        titleMap.set('operational_excellence', 'Operational Excellence')
        titleMap.set('cost_optimization', 'Cost Optimization')

        return (
            responseSorted
                ?.map((i) => {
                    const category =
                        Object.entries(i.tags || {})
                            .filter((t) => t[0] === 'score_category')
                            .flatMap((t) => t[1])
                            .at(0) || ''
                    return {
                        category,
                        summary: i,
                    }
                })
                .reduce<MR[]>((prev, curr) => {
                    if (
                        prev.filter((p) => p.category === curr.category)
                            .length > 0
                    ) {
                        return prev.map((v) => {
                            if (v.category === curr.category) {
                                return {
                                    category: curr.category,
                                    title: titleMap.get(curr.category) || '',
                                    summary: [curr.summary, ...v.summary],
                                }
                            }
                            return v
                        })
                    }
                    return [
                        ...prev,
                        {
                            category: curr.category,
                            title: titleMap.get(curr.category) || '',
                            summary: [curr.summary],
                        },
                    ]
                }, []) || []
        )
    }

    return (
        <>
            <Grid numItems={3} className="gap-4">
                {isLoading ? (
                    <>
                        <Flex
                            flexDirection="col"
                            className="border px-8 py-6 rounded-lg"
                            alignItems="start"
                        >
                            <Text className="text-gray-500">
                                <span className="font-bold text-gray-800 mr-1.5">
                                    SCORE
                                </span>
                                evaluates cloud environments for alignment with
                                internal policies, vendor recommendations, and
                                industry standards
                            </Text>
                        </Flex>

                        {[1, 2, 3, 4, 5].map((i) => (
                            <Flex
                                alignItems="start"
                                justifyContent="start"
                                className="pl-5 pr-8 py-6 rounded-lg bg-white gap-5 shadow-sm hover:shadow-md"
                            >
                                <Flex className="relative w-fit">
                                    <ProgressCircle value={0} size="md">
                                        <div className="animate-pulse h-8 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                    </ProgressCircle>
                                </Flex>

                                <Flex
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1.5"
                                >
                                    <div className="animate-pulse h-3 w-full my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="animate-pulse h-3 w-full my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                </Flex>
                            </Flex>
                        ))}
                    </>
                ) : (
                    <>
                        <Flex
                            flexDirection="col"
                            className="border px-8 py-6 rounded-lg"
                            alignItems="start"
                        >
                            <Text className="text-gray-500">
                                <span className="font-bold text-gray-800 mr-1.5">
                                    SCORE
                                </span>
                                evaluates cloud environments for alignment with
                                internal policies, vendor recommendations, and
                                industry standards
                            </Text>
                        </Flex>

                        {categories().map((item) => {
                            return (
                                <ScoreCategoryCard
                                    title={item.title || ''}
                                    percentage={SecurityScore(
                                        item.summary.map(
                                            (c) =>
                                                c.controlsSeverityStatus
                                                    ?.total || {}
                                        )
                                    )}
                                    costOptimization={item.summary
                                        .map((b) => b.costOptimization || 0)
                                        .reduce<number>(
                                            (prev, curr) => prev + curr,
                                            0
                                        )}
                                    value={item.summary
                                        .map(
                                            (c) =>
                                                c.controlsSeverityStatus?.total
                                                    ?.passed || 0
                                        )
                                        .reduce<number>(
                                            (prev, curr) => prev + curr,
                                            0
                                        )}
                                    kpiText="Issues"
                                    varient="minimized"
                                    category={item.category}
                                />
                            )
                        })}
                    </>
                )}
            </Grid>

            {toErrorMessage(summaryListError) && (
                <Flex
                    flexDirection="col"
                    justifyContent="between"
                    className="absolute top-0 w-full left-0 h-full backdrop-blur"
                >
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Title className="mt-6">Failed to load component</Title>
                        <Text className="mt-2">
                            {toErrorMessage(summaryListError)}
                        </Text>
                    </Flex>
                    <Button
                        variant="secondary"
                        className="mb-6"
                        color="slate"
                        onClick={() => {
                            refresh()
                        }}
                    >
                        Try Again
                    </Button>
                </Flex>
            )}
        </>
    )
}
