import { Flex, Text } from '@tremor/react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../api/api'
import { benchmarkChecks } from '../Cards/ComplianceCard'
import { numberDisplay } from '../../utilities/numericDisplay'

interface ISeverityBar {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
}

export default function SeverityBar({ benchmark }: ISeverityBar) {
    const severity = [
        {
            name: 'Critical',
            color: '#6E120B',
            percent:
                (benchmarkChecks(benchmark).critical /
                    (benchmarkChecks(benchmark).failed || 1)) *
                100,
        },
        {
            name: 'High',
            color: '#CA2B1D',
            percent:
                (benchmarkChecks(benchmark).high /
                    (benchmarkChecks(benchmark).failed || 1)) *
                100,
        },
        {
            name: 'Medium',
            color: '#EE9235',
            percent:
                (benchmarkChecks(benchmark).medium /
                    (benchmarkChecks(benchmark).failed || 1)) *
                100,
        },
        {
            name: 'Low',
            color: '#F4C744',
            percent:
                (benchmarkChecks(benchmark).low /
                    (benchmarkChecks(benchmark).failed || 1)) *
                100,
        },
        {
            name: 'None',
            color: '#6B7280',
            percent:
                (benchmarkChecks(benchmark).none /
                    (benchmarkChecks(benchmark).failed || 1)) *
                100,
        },
    ]

    return (
        <Flex flexDirection="col" alignItems="start">
            <Text className="mb-2">{`${numberDisplay(
                benchmarkChecks(benchmark).failed,
                0
            )} out of ${numberDisplay(
                benchmarkChecks(benchmark).total,
                0
            )} failed`}</Text>
            {benchmarkChecks(benchmark).total > 0 ? (
                <Flex alignItems="start" className="gap-0.5">
                    <Flex flexDirection="col">
                        <Flex className="h-5 rounded-l-sm overflow-hidden gap-0.5">
                            {severity.map((s) => (
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${s.percent}%`,
                                        backgroundColor: s.color,
                                    }}
                                />
                            ))}
                        </Flex>
                        <Flex flexDirection="col" className="mt-2">
                            <Flex className="border-x-2 h-1.5 border-x-gray-400">
                                <div className="w-full h-0.5 bg-gray-400" />
                            </Flex>
                            <Text className="mt-1 text-xs">{`${(
                                (benchmarkChecks(benchmark).failed /
                                    (benchmarkChecks(benchmark).total || 1)) *
                                100
                            ).toFixed(2)}% failed`}</Text>
                        </Flex>
                    </Flex>
                    <div
                        className="h-5 rounded-r-sm overflow-hidden"
                        style={{
                            width: `${
                                ((benchmark?.conformanceStatusSummary
                                    ?.okCount || 0) /
                                    benchmarkChecks(benchmark).total) *
                                100
                            }%`,
                            backgroundColor: '#54B584',
                        }}
                    />
                </Flex>
            ) : (
                <div className="bg-gray-200 h-5 rounded-md" />
            )}
        </Flex>
    )
}
