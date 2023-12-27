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
                    100 || 0,
            count: benchmarkChecks(benchmark).critical,
        },
        {
            name: 'High',
            color: '#CA2B1D',
            percent:
                (benchmarkChecks(benchmark).high /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).high,
        },
        {
            name: 'Medium',
            color: '#EE9235',
            percent:
                (benchmarkChecks(benchmark).medium /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).medium,
        },
        {
            name: 'Low',
            color: '#F4C744',
            percent:
                (benchmarkChecks(benchmark).low /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).low,
        },
        {
            name: 'None',
            color: '#6B7280',
            percent:
                (benchmarkChecks(benchmark).none /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).none,
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
                <Flex alignItems="start" style={{ gap: '3px' }}>
                    <Flex flexDirection="col">
                        <Flex className="h-5" style={{ gap: '3px' }}>
                            {severity.map(
                                (s, i) =>
                                    s.percent > 0 && (
                                        <div
                                            className="group h-full relative flex justify-center"
                                            style={{
                                                width: `${s.percent}%`,
                                                minWidth: '2.5%',
                                            }}
                                        >
                                            <div
                                                className={`h-full w-full ${
                                                    i === 0
                                                        ? 'rounded-l-sm'
                                                        : ''
                                                }`}
                                                style={{
                                                    backgroundColor: s.color,
                                                }}
                                            />
                                            <div
                                                className="absolute w-32 top-7 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100"
                                                style={{
                                                    border: `1px solid ${s.color}`,
                                                }}
                                            >
                                                <Flex
                                                    flexDirection="col"
                                                    alignItems="start"
                                                >
                                                    <Text
                                                        className={`text-[${s.color}] font-semibold mb-1`}
                                                    >
                                                        {s.name}
                                                    </Text>
                                                    <Flex>
                                                        <Text>Count</Text>
                                                        <Text>
                                                            {numberDisplay(
                                                                s.count,
                                                                0
                                                            )}
                                                        </Text>
                                                    </Flex>
                                                    <Flex>
                                                        <Text>Percent</Text>
                                                        <Text>
                                                            {s.percent.toFixed(
                                                                2
                                                            )}
                                                            %
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            </div>
                                        </div>
                                    )
                            )}
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
                        className="group h-5 relative flex justify-center"
                        style={{
                            width: `${
                                ((benchmark?.conformanceStatusSummary
                                    ?.okCount || 0) /
                                    benchmarkChecks(benchmark).total) *
                                100
                            }%`,
                            minWidth: '2.5%',
                        }}
                    >
                        <div
                            className="h-full w-full rounded-r-sm"
                            style={{
                                backgroundColor: '#54B584',
                            }}
                        />
                        <div
                            className="absolute w-32 top-7 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100"
                            style={{
                                border: '1px solid #54B584',
                            }}
                        >
                            <Flex flexDirection="col" alignItems="start">
                                <Text className="text-[#54B584] font-semibold mb-1">
                                    Passed
                                </Text>
                                <Flex>
                                    <Text>Count</Text>
                                    <Text>
                                        {numberDisplay(
                                            benchmark?.conformanceStatusSummary
                                                ?.okCount || 0,
                                            0
                                        )}
                                    </Text>
                                </Flex>
                                <Flex>
                                    <Text>Percent</Text>
                                    <Text>
                                        {(
                                            ((benchmark
                                                ?.conformanceStatusSummary
                                                ?.okCount || 0) /
                                                benchmarkChecks(benchmark)
                                                    .total) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </Text>
                                </Flex>
                            </Flex>
                        </div>
                    </div>
                </Flex>
            ) : (
                <div className="bg-gray-200 h-5 rounded-md" />
            )}
        </Flex>
    )
}
