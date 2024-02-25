import {
    Flex,
    Text,
    Title,
    Subtitle,
    Metric,
    Badge,
    ProgressCircle,
} from '@tremor/react'
import ScoreCategoryCard from '../../../components/Cards/ScoreCategoryCard'
import TopHeader from '../../../components/Layout/Header'
import BadgeDeltaSimple from '../../../components/ChangeDeltaSimple'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult } from '../../../api/api'

const severityColor = [
    {
        name: 'critical',
        title: 'Critical Risk',
        color: 'rose',
    },
    {
        name: 'high',
        title: 'High Risk',
        color: 'orange',
    },
    {
        name: 'medium',
        title: 'Medium Risk',
        color: 'amber',
    },
    {
        name: 'low',
        title: 'Low Risk',
        color: 'yellow',
    },
    {
        name: 'none',
        title: 'None',
        color: 'gray',
    },
    {
        name: 'passed',
        title: 'Passed',
        color: 'emerald',
    },
]

function SecurityScore(
    v:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkStatusResult
        | undefined
) {
    if ((v?.total || 0) === 0) {
        return 0
    }
    return ((v?.passed || 0) / (v?.total || 0)) * 100
}

export default function ScoreOverview() {
    const { response, isLoading } = useComplianceApiV1BenchmarksSummaryList({
        tag: ['type=SCORE'],
    })
    const controlTotal =
        response?.benchmarkSummary?.map(
            (i) => i.controlsSeverityStatus?.total
        ) || []
    const total = controlTotal
        .map((i) => i?.total || 0)
        .reduce((prev, curr) => prev + curr, 0)
    const passed = controlTotal
        .map((i) => i?.passed || 0)
        .reduce((prev, curr) => prev + curr, 0)

    const securityScore = (passed / total) * 100

    const severityMap = response?.benchmarkSummary
        ?.map((v) => v.checks)
        .reduce(
            (prev, curr) => {
                return {
                    critical: prev.critical + (curr?.criticalCount || 0),
                    high: prev.high + (curr?.highCount || 0),
                    medium: prev.medium + (curr?.mediumCount || 0),
                    low: prev.low + (curr?.lowCount || 0),
                    none: prev.none + (curr?.noneCount || 0),
                }
            },
            {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                none: 0,
            }
        )

    return (
        <>
            <TopHeader />

            <Flex alignItems="start" className="gap-20">
                <Flex flexDirection="col" className="h-full">
                    <Flex
                        flexDirection="col"
                        alignItems="start"
                        className="p-10 border border-gray-300 rounded-xl gap-8"
                    >
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-3"
                        >
                            <Metric>What is SCORE?</Metric>
                            <Subtitle className="text-gray-500">
                                SCORE is a comprehensive evaluation suite that
                                assesses your infrastructure against leading
                                cloud vendor recommendations, ensuring optimal
                                alignment with industry standards and best
                                practices.
                            </Subtitle>
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="center"
                            className="gap-2"
                        >
                            <ProgressCircle
                                value={securityScore}
                                size="xl"
                                className="relative"
                            >
                                <Flex flexDirection="col">
                                    {isLoading ? (
                                        <div className="animate-pulse h-3 w-16 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    ) : (
                                        <Title>
                                            {securityScore.toFixed(1)}%
                                        </Title>
                                    )}

                                    <Text>Compliant</Text>
                                </Flex>
                            </ProgressCircle>
                            {/* <BadgeDeltaSimple change={20}>
                                from previous month
                            </BadgeDeltaSimple> */}
                        </Flex>
                        <hr className="w-full border border-gray-200" />
                        <Flex
                            flexDirection="col"
                            alignItems="start"
                            className="gap-8"
                        >
                            <Flex justifyContent="start">
                                <Title className="mr-1.5 font-bold">
                                    {isLoading ? (
                                        <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    ) : (
                                        response?.benchmarkSummary
                                            ?.map(
                                                (i) =>
                                                    (i?.conformanceStatusSummary
                                                        ?.passed || 0) +
                                                    (i?.conformanceStatusSummary
                                                        ?.failed || 0)
                                            )
                                            .reduce(
                                                (prev, curr) => prev + curr,
                                                0
                                            )
                                    )}
                                </Title>
                                insight evaluations performed across
                                <Title className="mx-1.5 font-bold">
                                    {isLoading ? (
                                        <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    ) : (
                                        response?.benchmarkSummary
                                            ?.map(
                                                (i) =>
                                                    i?.connectionsStatus
                                                        ?.total || 0
                                            )
                                            .reduce(
                                                (prev, curr) => prev + curr,
                                                0
                                            )
                                    )}
                                </Title>
                                cloud accounts
                            </Flex>
                            <Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="rose">
                                            {isLoading ? (
                                                <div className="animate-pulse h-3 w-16 my-0 bg-slate-200 dark:bg-slate-700 rounded" />
                                            ) : (
                                                response?.benchmarkSummary
                                                    ?.map(
                                                        (i) =>
                                                            i
                                                                ?.conformanceStatusSummary
                                                                ?.failed || 0
                                                    )
                                                    .reduce(
                                                        (prev, curr) =>
                                                            prev + curr,
                                                        0
                                                    )
                                            )}
                                        </Metric>

                                        <Subtitle className="text-gray-500 mt-2">
                                            Failed Checks
                                        </Subtitle>
                                    </Flex>

                                    {/* <BadgeDeltaSimple change={-7}>
                                        from previous time period
                                    </BadgeDeltaSimple> */}
                                </Flex>
                                <Flex
                                    justifyContent="start"
                                    alignItems="start"
                                    flexDirection="col"
                                    className="gap-1"
                                >
                                    <Flex
                                        justifyContent="start"
                                        alignItems="baseline"
                                        className="gap-3"
                                    >
                                        <Metric color="emerald">
                                            {isLoading ? (
                                                <div className="animate-pulse h-3 w-16 my-0 bg-slate-200 dark:bg-slate-700 rounded" />
                                            ) : (
                                                response?.benchmarkSummary
                                                    ?.map(
                                                        (i) =>
                                                            i
                                                                ?.conformanceStatusSummary
                                                                ?.passed || 0
                                                    )
                                                    .reduce(
                                                        (prev, curr) =>
                                                            prev + curr,
                                                        0
                                                    )
                                            )}
                                        </Metric>
                                        <Subtitle className="text-gray-500">
                                            Passed Checks
                                        </Subtitle>
                                    </Flex>

                                    {/* <BadgeDeltaSimple change={6}>
                                        from previous time period
                                    </BadgeDeltaSimple> */}
                                </Flex>
                            </Flex>
                            <Flex justifyContent="start" className="gap-2">
                                {Object.entries(severityMap || {}).map(
                                    (item) => (
                                        <Flex
                                            flexDirection="col"
                                            className="gap-2"
                                        >
                                            <Badge
                                                color={
                                                    severityColor
                                                        .filter(
                                                            (v) =>
                                                                v.name ===
                                                                item[0]
                                                        )
                                                        .at(0)?.color
                                                }
                                                className="w-full"
                                            >
                                                {item[1]}
                                            </Badge>
                                            <Text>{item[0]}</Text>
                                        </Flex>
                                    )
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>

                <Flex flexDirection="col" className="gap-6">
                    {isLoading
                        ? [1, 2, 3, 4, 5].map((i) => (
                              <Flex className="gap-6 px-8 py-8 bg-white rounded-xl shadow-sm hover:shadow-md hover:cursor-pointer">
                                  <Flex className="relative w-fit">
                                      <ProgressCircle value={0} size="md">
                                          <div className="animate-pulse h-3 w-8 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                      </ProgressCircle>
                                  </Flex>

                                  <Flex
                                      alignItems="start"
                                      flexDirection="col"
                                      className="gap-1"
                                  >
                                      <div className="animate-pulse h-3 w-56 my-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                  </Flex>
                              </Flex>
                          ))
                        : response?.benchmarkSummary
                              ?.map((i) => i)
                              .map((item) => {
                                  return (
                                      <ScoreCategoryCard
                                          title={item.title || ''}
                                          value={SecurityScore(
                                              item.controlsSeverityStatus?.total
                                          )}
                                          change={0}
                                          category={item.id || ''}
                                      />
                                  )
                              })}
                </Flex>
            </Flex>
        </>
    )
}
