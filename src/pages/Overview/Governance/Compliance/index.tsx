import { Button, Card, Flex, Subtitle, Text, Title } from '@tremor/react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useAtomValue } from 'jotai'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../../api/compliance.gen'
import { getErrorMessage } from '../../../../types/apierror'
import { searchAtom } from '../../../../utilities/urlstate'

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

export default function Compliance() {
    const workspace = useParams<{ ws: string }>().ws
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow: refresh,
    } = useComplianceApiV1BenchmarksSummaryList()

    const sorted = [...(benchmarks?.benchmarkSummary || [])].filter((b) => {
        const ent = Object.entries(b.tags || {})
        return (
            ent.filter(
                (v) =>
                    v[0] === 'kaytu_benchmark_type' && v[1][0] === 'compliance'
            ).length > 0
        )
    })
    sorted.sort((a, b) => {
        const bScore =
            (b?.controlsSeverityStatus?.total?.passed || 0) /
            (b?.controlsSeverityStatus?.total?.total || 1)
        const aScore =
            (a?.controlsSeverityStatus?.total?.passed || 0) /
            (a?.controlsSeverityStatus?.total?.total || 1)

        const aZero = (a?.controlsSeverityStatus?.total?.total || 0) === 0
        const bZero = (b?.controlsSeverityStatus?.total?.total || 0) === 0

        if ((aZero && bZero) || aScore === bScore) {
            return 0
        }
        if (aZero) {
            return 1
        }
        if (bZero) {
            return -1
        }
        return aScore > bScore ? 1 : -1
    })

    return (
        <Flex flexDirection="col" alignItems="start" justifyContent="start">
            <Flex className="mb-8">
                <Title className="text-gray-500">Benchmarks</Title>
                <Button
                    variant="light"
                    icon={ChevronRightIcon}
                    iconPosition="right"
                    onClick={() =>
                        navigate(`/ws/${workspace}/compliance?${searchParams}`)
                    }
                >
                    Show all
                </Button>
            </Flex>
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
                                    <div className="h-5 w-24 mb-2 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-5 w-24 mb-1 bg-slate-200 dark:bg-slate-700 rounded" />
                                    <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                                </Flex>
                            </Card>
                        )
                    })}
                </Flex>
            ) : (
                <Flex flexDirection="col" className="gap-4">
                    {sorted?.map(
                        (bs, i) =>
                            i < 2 && (
                                <Card
                                    onClick={() =>
                                        navigate(
                                            `/ws/${workspace}/compliance/${bs.id}?${searchParams}`
                                        )
                                    }
                                    className="p-3 cursor-pointer dark:ring-gray-500 hover:shadow-md"
                                >
                                    <Subtitle className="font-semibold text-gray-800 mb-2">
                                        {bs.title}
                                    </Subtitle>
                                    {(bs.controlsSeverityStatus?.total?.total ||
                                        0) > 0 ? (
                                        <>
                                            <Text>Security score</Text>
                                            <Title>
                                                {(
                                                    ((bs?.controlsSeverityStatus
                                                        ?.total?.passed || 0) /
                                                        (bs
                                                            ?.controlsSeverityStatus
                                                            ?.total?.total ||
                                                            1)) *
                                                        100 || 0
                                                ).toFixed(1)}
                                                %
                                            </Title>
                                        </>
                                    ) : (
                                        <Button
                                            variant="light"
                                            icon={ChevronRightIcon}
                                            iconPosition="right"
                                        >
                                            Assign
                                        </Button>
                                    )}
                                </Card>
                            )
                    )}
                    {/* {benchmarkList(benchmarks?.benchmarkSummary).connected
                        .length < 2 &&
                        benchmarkList(
                            benchmarks?.benchmarkSummary
                        ).notConnected.map(
                            (bs, i) =>
                                i <
                                    4 -
                                        benchmarkList(
                                            benchmarks?.benchmarkSummary
                                        ).connected.length *
                                            2 && (
                                    <Card
                                        onClick={() =>
                                            navigate(
                                                `/ws/${workspace}/policies/${bs.id}?${searchParams}`
                                            )
                                        }
                                        className="p-3 cursor-pointer dark:ring-gray-500"
                                    >
                                        <Flex>
                                            <Text className="font-semibold line-clamp-1 text-gray-800">
                                                {bs.title}
                                            </Text>
                                            <Button
                                                variant="light"
                                                icon={ChevronRightIcon}
                                                iconPosition="right"
                                            >
                                                Assign
                                            </Button>
                                        </Flex>
                                    </Card>
                                )
                        )} */}
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
