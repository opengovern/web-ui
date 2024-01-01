import {
    Card,
    Flex,
    Icon,
    Legend,
    ProgressCircle,
    Text,
    Title,
} from '@tremor/react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import { exactPriceDisplay } from '../../../utilities/numericDisplay'

const colors = [
    'fuchsia',
    'indigo',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'violet',
    'purple',
    'pink',
    'rose',
]

const radiuses = [25, 34, 43, 52, 61, 70, 79, 88, 97]
interface IBenchmarkProgress {
    idx: number
    totalCount: number
    summaries: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary[]
    centerValue?: number
    isLoading: boolean
}
function BenchmarkProgress({
    idx,
    totalCount,
    summaries,
    centerValue,
    isLoading,
}: IBenchmarkProgress) {
    if (isLoading) {
        return (
            <ProgressCircle value={0} radius={radiuses[0]} color={colors[0]}>
                <ProgressCircle
                    value={0}
                    radius={radiuses[1]}
                    color={colors[1]}
                />
            </ProgressCircle>
        )
    }

    if (summaries.length === 0) {
        if (centerValue !== undefined) {
            return <Text>{`${centerValue?.toFixed(1)}%`}</Text>
        }
        return null
    }

    const benchmark = summaries.at(0)
    const securityScore =
        ((benchmark?.controlsSeverityStatus?.total?.passed || 0) /
            (benchmark?.controlsSeverityStatus?.total?.total || 1)) *
            100 || 0

    return (
        <ProgressCircle
            value={securityScore}
            radius={radiuses[idx]}
            color={colors[idx]}
        >
            <BenchmarkProgress
                idx={idx + 1}
                totalCount={totalCount}
                summaries={summaries.slice(1)}
                centerValue={centerValue}
                isLoading={isLoading}
            />
        </ProgressCircle>
    )
}

export default function Compliance() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    const benchmarkSummaries = benchmarks?.benchmarkSummary?.filter(
        (benchmark) => (benchmark.controlsSeverityStatus?.total?.total || 0) > 0
    )

    return (
        <Card className="pb-8">
            <Flex flexDirection="row" justifyContent="start">
                <Icon
                    variant="light"
                    icon={ShieldCheckIcon}
                    size="lg"
                    color="blue"
                    className="mr-2"
                />
                <Title>Benchmarks</Title>
            </Flex>

            <Flex
                flexDirection="row"
                className={`mt-6 ${isLoading ? 'animate-pulse' : ''}`}
            >
                <BenchmarkProgress
                    idx={0}
                    totalCount={benchmarkSummaries?.length || 0}
                    summaries={benchmarkSummaries || []}
                    isLoading={isLoading}
                />
                <Flex flexDirection="col" alignItems="start">
                    {isLoading &&
                        [1, 2, 3].map((bs, idx) => {
                            return (
                                <Flex
                                    flexDirection="row"
                                    justifyContent="between"
                                    className="ml-4 my-1 animate-pulse"
                                >
                                    <div className="h-2 w-24 my-2 bg-slate-200 rounded" />
                                    <div className="h-2 w-24 my-2 bg-slate-200 rounded" />
                                </Flex>
                            )
                        })}

                    {!isLoading && (
                        <>
                            <Flex
                                flexDirection="row"
                                justifyContent="between"
                                className="ml-6 my-1"
                            >
                                <Text className="font-bold">Benchmark</Text>
                                <Text className="font-bold mr-2">
                                    Security Score
                                </Text>
                            </Flex>
                            {benchmarkSummaries?.map((bs, idx) => {
                                const securityScore =
                                    ((bs?.controlsSeverityStatus?.total
                                        ?.passed || 0) /
                                        (bs?.controlsSeverityStatus?.total
                                            ?.total || 1)) *
                                        100 || 0

                                return (
                                    <Flex
                                        flexDirection="row"
                                        justifyContent="between"
                                        className="ml-4 my-1"
                                    >
                                        <Legend
                                            categories={[bs.title || '']}
                                            colors={[colors[idx]]}
                                            className=""
                                            onClickLegendItem={(v) =>
                                                navigate(
                                                    `/${workspace}/compliance/${bs.id}`
                                                )
                                            }
                                        />
                                        <Text>{securityScore.toFixed(1)}%</Text>
                                    </Flex>
                                )
                            })}
                        </>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}
