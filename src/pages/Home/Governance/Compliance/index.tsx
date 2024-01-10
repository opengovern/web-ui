import { Button, Card, Flex, ProgressCircle, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../../api/api'
import { getErrorMessage } from '../../../../types/apierror'

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
        sendNow: refresh,
    } = useComplianceApiV1BenchmarksSummaryList()

    const benchmarkSummaries = benchmarks?.benchmarkSummary?.filter(
        (benchmark) => (benchmark.controlsSeverityStatus?.total?.total || 0) > 0
    )

    return (
        <Flex flexDirection="col" alignItems="start" justifyContent="start">
            <Title className="mb-4">Benchmarks</Title>
            {isLoading || getErrorMessage(error).length > 0 ? (
                <Flex flexDirection="col" className="gap-4">
                    {[1, 2].map((i) => {
                        return (
                            <Card className="p-3 dark:ring-gray-500">
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    justifyContent="start"
                                    className="animate-pulse"
                                >
                                    <div className="h-5 w-24 mb-2 bg-slate-200 rounded" />
                                    <div className="h-5 w-24 mb-1 bg-slate-200 rounded" />
                                    <div className="h-6 w-24 bg-slate-200 rounded" />
                                </Flex>
                            </Card>
                        )
                    })}
                </Flex>
            ) : (
                <Flex flexDirection="col" className="gap-4">
                    {benchmarkSummaries?.map(
                        (bs, i) =>
                            i < 2 && (
                                <Card
                                    onClick={() =>
                                        navigate(
                                            `/${workspace}/compliance/${bs.id}`
                                        )
                                    }
                                    className="p-3 cursor-pointer dark:ring-gray-500"
                                >
                                    <Flex
                                        flexDirection="col"
                                        alignItems="start"
                                    >
                                        <Text className="font-semibold text-gray-800 mb-2">
                                            {bs.title}
                                        </Text>
                                        <Text>Security score</Text>
                                        <Title>
                                            {(
                                                ((bs?.controlsSeverityStatus
                                                    ?.total?.passed || 0) /
                                                    (bs?.controlsSeverityStatus
                                                        ?.total?.total || 1)) *
                                                    100 || 0
                                            ).toFixed(1)}
                                            %
                                        </Title>
                                    </Flex>
                                </Card>
                            )
                    )}
                    {error && (
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
                                <Title className="mt-6">
                                    Failed to load component
                                </Title>
                                <Text className="mt-2">
                                    {getErrorMessage(error)}
                                </Text>
                            </Flex>
                            <Button
                                variant="secondary"
                                className="mb-6"
                                color="slate"
                                onClick={refresh}
                            >
                                Try Again
                            </Button>
                        </Flex>
                    )}
                </Flex>
            )}
        </Flex>
    )
}
