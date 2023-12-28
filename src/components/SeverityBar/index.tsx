import { Flex, Text } from '@tremor/react'
import { useEffect, useMemo } from 'react'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../api/api'
import { benchmarkChecks } from '../Cards/ComplianceCard'
import { numberDisplay } from '../../utilities/numericDisplay'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../api/compliance.gen'
import { treeRows } from '../../pages/Governance/Compliance/BenchmarkSummary/Controls'
import Spinner from '../Spinner'

interface ISeverityBar {
    benchmark:
        | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
        | undefined
    control?: boolean
}

export default function SeverityBar({
    benchmark,
    control = false,
}: ISeverityBar) {
    const {
        response: controls,
        isLoading,
        sendNow,
    } = useComplianceApiV1BenchmarksControlsDetail(
        String(benchmark?.id),
        {},
        {},
        false
    )
    useEffect(() => {
        if (control) {
            sendNow()
        }
    }, [control])
    const controlData = useMemo(() => treeRows(controls), [controls])
    const controlCount = (severity: string) => {
        return controlData.filter((c: any) => c?.control?.severity === severity)
            .length
    }

    const severity = [
        {
            name: 'Critical',
            color: '#6E120B',
            percent:
                (benchmarkChecks(benchmark).critical /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).critical,
            controlPercent: control
                ? (controlCount('critical') / (controlData.length || 1)) * 100
                : 0,
            controlCount: control ? controlCount('critical') : 0,
        },
        {
            name: 'High',
            color: '#CA2B1D',
            percent:
                (benchmarkChecks(benchmark).high /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).high,
            controlPercent: control
                ? (controlCount('high') / (controlData.length || 1)) * 100
                : 0,
            controlCount: control ? controlCount('high') : 0,
        },
        {
            name: 'Medium',
            color: '#EE9235',
            percent:
                (benchmarkChecks(benchmark).medium /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).medium,
            controlPercent: control
                ? (controlCount('medium') / (controlData.length || 1)) * 100
                : 0,
            controlCount: control ? controlCount('medium') : 0,
        },
        {
            name: 'Low',
            color: '#F4C744',
            percent:
                (benchmarkChecks(benchmark).low /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).low,
            controlPercent: control
                ? (controlCount('low') / (controlData.length || 1)) * 100
                : 0,
            controlCount: control ? controlCount('low') : 0,
        },
        {
            name: 'None',
            color: '#6B7280',
            percent:
                (benchmarkChecks(benchmark).none /
                    (benchmarkChecks(benchmark).failed || 1)) *
                    100 || 0,
            count: benchmarkChecks(benchmark).none,
            controlPercent: control
                ? ((controlCount('none') + controlCount('')) /
                      (controlData.length || 1)) *
                  100
                : 0,
            controlCount: control ? controlCount('none') + controlCount('') : 0,
        },
    ]

    return control && isLoading ? (
        <Spinner className="-mt-16" />
    ) : (
        <Flex flexDirection="col" alignItems="start">
            <Text className="mb-2">{`${
                control
                    ? numberDisplay(
                          controlCount('critical') +
                              controlCount('high') +
                              controlCount('medium') +
                              controlCount('low') +
                              controlCount('none') +
                              controlCount(''),
                          0
                      )
                    : numberDisplay(benchmarkChecks(benchmark).failed, 0)
            } out of ${
                control
                    ? controlData.length
                    : numberDisplay(benchmarkChecks(benchmark).total, 0)
            } ${control ? 'controls' : 'resources'} failed`}</Text>
            {benchmarkChecks(benchmark).total > 0 ? (
                <Flex alignItems="start" style={{ gap: '3px' }}>
                    <Flex flexDirection="col">
                        <Flex className="h-5" style={{ gap: '3px' }}>
                            {severity.map(
                                (s, i) =>
                                    (s.percent > 0 || s.controlPercent > 0) && (
                                        <div
                                            className="group h-full relative"
                                            style={{
                                                width: `${
                                                    control
                                                        ? s.controlPercent
                                                        : s.percent
                                                }%`,
                                                minWidth: '2.5%',
                                            }}
                                        >
                                            <div
                                                className={`h-full w-full ${
                                                    i === 0 ? '' : ''
                                                }`}
                                                style={{
                                                    backgroundColor: s.color,
                                                }}
                                            />
                                            <div
                                                className="absolute w-56 z-10 top-7 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100"
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
                                                    {control && (
                                                        <Flex>
                                                            <Text>
                                                                Controls
                                                            </Text>
                                                            <Text>
                                                                {`${numberDisplay(
                                                                    s.controlCount,
                                                                    0
                                                                )} (${s.controlPercent.toFixed(
                                                                    2
                                                                )}%)`}
                                                            </Text>
                                                        </Flex>
                                                    )}
                                                    <Flex>
                                                        <Text>Issues</Text>
                                                        <Text>
                                                            {`${numberDisplay(
                                                                s.count,
                                                                0
                                                            )} (${s.percent.toFixed(
                                                                2
                                                            )}%)`}
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
                            <Text className="mt-1 text-xs">{`${
                                control
                                    ? (
                                          ((controlCount('critical') +
                                              controlCount('high') +
                                              controlCount('medium') +
                                              controlCount('low') +
                                              controlCount('none') +
                                              controlCount('')) /
                                              controlData.length) *
                                          100
                                      ).toFixed(2)
                                    : (
                                          (benchmarkChecks(benchmark).failed /
                                              (benchmarkChecks(benchmark)
                                                  .total || 1)) *
                                          100
                                      ).toFixed(2)
                            }% failed`}</Text>
                        </Flex>
                    </Flex>
                    {(((benchmark?.conformanceStatusSummary?.okCount || 0) /
                        benchmarkChecks(benchmark).total) *
                        100 >
                        0 ||
                        ((controlData.length -
                            (controlCount('critical') +
                                controlCount('high') +
                                controlCount('medium') +
                                controlCount('low') +
                                controlCount('none') +
                                controlCount(''))) /
                            controlData.length) *
                            100 >
                            0) && (
                        <div
                            className="group h-5 relative"
                            style={{
                                width: `${
                                    control
                                        ? ((controlData.length -
                                              (controlCount('critical') +
                                                  controlCount('high') +
                                                  controlCount('medium') +
                                                  controlCount('low') +
                                                  controlCount('none') +
                                                  controlCount(''))) /
                                              controlData.length) *
                                          100
                                        : ((benchmark?.conformanceStatusSummary
                                              ?.okCount || 0) /
                                              benchmarkChecks(benchmark)
                                                  .total) *
                                          100
                                }%`,
                                minWidth: '2.5%',
                            }}
                        >
                            <div
                                className="h-full w-full"
                                style={{
                                    backgroundColor: '#54B584',
                                }}
                            />
                            <div
                                className="absolute w-56 z-10 top-7 scale-0 transition-all rounded p-2 shadow-md bg-white group-hover:scale-100"
                                style={{
                                    border: '1px solid #54B584',
                                }}
                            >
                                <Flex flexDirection="col" alignItems="start">
                                    <Text className="text-[#54B584] font-semibold mb-1">
                                        Passed
                                    </Text>
                                    {control && (
                                        <Flex>
                                            <Text>Controls</Text>
                                            <Text>
                                                {`${numberDisplay(
                                                    controlData.length -
                                                        (controlCount(
                                                            'critical'
                                                        ) +
                                                            controlCount(
                                                                'high'
                                                            ) +
                                                            controlCount(
                                                                'medium'
                                                            ) +
                                                            controlCount(
                                                                'low'
                                                            ) +
                                                            controlCount(
                                                                'none'
                                                            ) +
                                                            controlCount('')),
                                                    0
                                                )} (${(
                                                    ((controlData.length -
                                                        (controlCount(
                                                            'critical'
                                                        ) +
                                                            controlCount(
                                                                'high'
                                                            ) +
                                                            controlCount(
                                                                'medium'
                                                            ) +
                                                            controlCount(
                                                                'low'
                                                            ) +
                                                            controlCount(
                                                                'none'
                                                            ) +
                                                            controlCount(''))) /
                                                        controlData.length) *
                                                    100
                                                ).toFixed(2)}%)`}
                                            </Text>
                                        </Flex>
                                    )}
                                    <Flex>
                                        <Text>Issues</Text>
                                        <Text>
                                            {`${numberDisplay(
                                                benchmark
                                                    ?.conformanceStatusSummary
                                                    ?.okCount || 0,
                                                0
                                            )} (${(
                                                ((benchmark
                                                    ?.conformanceStatusSummary
                                                    ?.okCount || 0) /
                                                    benchmarkChecks(benchmark)
                                                        .total) *
                                                100
                                            ).toFixed(2)}%)`}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </div>
                        </div>
                    )}
                </Flex>
            ) : (
                <div className="bg-gray-200 h-5 rounded-md" />
            )}
        </Flex>
    )
}
