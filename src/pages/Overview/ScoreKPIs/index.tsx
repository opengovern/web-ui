import {
    Flex,
    Text,
    Title,
    ProgressCircle,
    Button,
    Grid,
    Subtitle,
    Card,
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
import KPICard from './KPICard'
import { useParams } from 'react-router-dom'

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
    const { ws } = useParams()

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
        titleMap.set('performance_efficiency', 'Efficiency')
        titleMap.set('operational_excellence', 'Operational Excellence')
        // titleMap.set('cost_optimization', 'Cost Optimization')

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
            <Card>
                <div className="flex items-center justify-start">
                    <svg
                        id="Arrow Up MD"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M11.4697 4.46967C11.7626 4.17678 12.2374 4.17678 12.5303 4.46967L18.5303 10.4697C18.8232 10.7626 18.8232 11.2374 18.5303 11.5303C18.2374 11.8232 17.7626 11.8232 17.4697 11.5303L12.75 6.81066L12.75 19C12.75 19.4142 12.4142 19.75 12 19.75C11.5858 19.75 11.25 19.4142 11.25 19L11.25 6.81066L6.53033 11.5303C6.23744 11.8232 5.76256 11.8232 5.46967 11.5303C5.17678 11.2374 5.17678 10.7626 5.46967 10.4697L11.4697 4.46967Z"
                            fill="#2970BC"
                        ></path>
                    </svg>
                    <Title className="font-semibold">
                       SRE
                    </Title>
                </div>
                <div
                    className={'h-fit'}
                    style={{
                        transitionDuration: '300ms',
                        animationFillMode: 'backwards',
                    }}
                >
                    <Grid
                        numItems={3}
                        className="mt-6 grid grid-cols-1 gap-4 rounded-md bg-gray-50 py-4 dark:bg-gray-900 md:grid-cols-3 md:divide-x md:divide-gray-200 md:dark:divide-gray-800"
                    >
                        {isLoading ? (
                            <>
                                {/* <Flex
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
                        </Flex> */}

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
                                {/* <Flex
                            flexDirection="col"
                            className="border px-8 py-6 rounded-lg"
                            alignItems="start"
                        >
                            <Text className="text-gray-500">
                                <span className="font-bold text-gray-800 dark:text-gray-100 mr-1.5">
                                    SCORE
                                </span>
                                evaluates cloud environments for alignment with
                                internal policies, vendor recommendations, and
                                industry standards
                            </Text>
                        </Flex> */}

                                {categories()
                                    .filter((item) => {
                                        if (
                                            item.category !==
                                                'cost_optimization' &&
                                            item.category !==
                                                'operational_excellence'
                                        ) {
                                            return item
                                        }
                                    })
                                    .map((item) => {
                                        return (
                                            <KPICard
                                                link={`/ws/${ws}/score/categories?score_category=${item.category}`}
                                                name={item.title}
                                                number={item.summary
                                                    .map(
                                                        (c) =>
                                                            c
                                                                .controlsSeverityStatus
                                                                ?.total
                                                                ?.passed || 0
                                                    )
                                                    .reduce<number>(
                                                        (prev, curr) =>
                                                            prev + curr,
                                                        0
                                                    )}
                                                percentage={SecurityScore(
                                                    item.summary.map(
                                                        (c) =>
                                                            c
                                                                .controlsSeverityStatus
                                                                ?.total || {}
                                                    )
                                                )}
                                            />
                                        )
                                    })}
                            </>
                        )}
                    </Grid>
                </div>
            </Card>

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

{
    /* <ScoreCategoryCard
                                    title={item.title || ''}
                                    percentage={SecurityScore(
                                        item.summary.map(
                                            (c) =>
                                                c.controlsSeverityStatus
                                                    ?.total || {}
                                        )
                                    )}
                                    costOptimization={
                                        item.category === 'cost_optimization'
                                            ? item.summary
                                                  .map(
                                                      (b) =>
                                                          b.costOptimization ||
                                                          0
                                                  )
                                                  .reduce<number>(
                                                      (prev, curr) =>
                                                          prev + curr,
                                                      0
                                                  )
                                            : 0
                                    }
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
                                /> */
}
