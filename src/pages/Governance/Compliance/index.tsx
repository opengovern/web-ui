import { Badge, Button, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useState } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Layout from '../../../components/Layout'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import Spinner from '../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import ComplianceCard, {
    benchmarkChecks,
} from '../../../components/Cards/ComplianceCard'
import { IColumn } from '../../../components/Table'
import { numberDisplay } from '../../../utilities/numericDisplay'
import ComplianceListCard from '../../../components/Cards/ComplianceListCard'

export const benchmarkList = (ben: any) => {
    const connected: any[] = []
    const notConnected: any[] = []
    const serviceAdvisor = []

    if (ben) {
        for (let i = 0; i < ben.length; i += 1) {
            if (
                ben[i].tags?.kaytu_benchmark_type &&
                ben[i].tags?.kaytu_benchmark_type.includes('compliance')
            ) {
                if (
                    (ben[i].checks?.criticalCount || 0) +
                    (ben[i].checks?.highCount || 0) +
                    (ben[i].checks?.mediumCount || 0) +
                    (ben[i].checks?.lowCount || 0) +
                    (ben[i].checks?.unknownCount || 0)
                ) {
                    const b = ben[i]
                    b.isAssigned = 'Assigned'
                    connected.push(b)
                } else {
                    const b = ben[i]
                    b.isAssigned = 'Not assigned'
                    notConnected.push(ben[i])
                }
            } else {
                serviceAdvisor.push(ben[i])
            }
        }
    }
    const all = [...connected, ...notConnected]

    return { connected, notConnected, serviceAdvisor, all }
}

export const activeColumns: IColumn<any, any>[] = [
    {
        width: 140,
        field: 'connectors',
        headerName: 'Cloud provider',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        field: 'title',
        headerName: 'Benchmark title',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
        cellRenderer: (
            param: ICellRendererParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) =>
            param.value && (
                <Flex flexDirection="col" alignItems="start">
                    <Text>{param.value}</Text>
                    <Flex justifyContent="start" className="mt-1 gap-2">
                        {param.data?.tags?.category?.map((cat) => (
                            <Badge color="slate" size="xs">
                                {cat}
                            </Badge>
                        ))}
                        {param.data?.tags?.kaytu_category?.map((cat) => (
                            <Badge color="emerald" size="xs">
                                {cat}
                            </Badge>
                        ))}
                        {!!param.data?.tags?.cis && (
                            <Badge color="sky" size="xs">
                                CIS
                            </Badge>
                        )}
                        {!!param.data?.tags?.hipaa && (
                            <Badge color="blue" size="xs">
                                Hipaa
                            </Badge>
                        )}
                    </Flex>
                </Flex>
            ),
    },
    {
        headerName: 'Security score',
        width: 150,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'number',
        cellRenderer: (
            param: ICellRendererParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) =>
            param.data &&
            `${(
                ((param.data?.conformanceStatusSummary?.okCount || 0) /
                    benchmarkChecks(param.data).total) *
                100
            ).toFixed(2)} %`,
    },
    {
        headerName: 'Policy fail',
        width: 200,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'number',
        cellRenderer: (
            param: ICellRendererParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) =>
            param.data && (
                <Flex flexDirection="col" alignItems="start">
                    <Text>{benchmarkChecks(param.data).failed}</Text>
                    <Text className="!text-sm text-gray-400">{`of ${numberDisplay(
                        benchmarkChecks(param.data).total,
                        0
                    )} checks failed`}</Text>
                </Flex>
            ),
    },
]

const notActiveColumns: IColumn<any, any>[] = [
    {
        width: 140,
        field: 'connectors',
        headerName: 'Cloud provider',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
    },
    {
        field: 'title',
        headerName: 'Compliance',
        type: 'string',
        cellRenderer: (
            param: ICellRendererParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) => (
            <Flex flexDirection="col" alignItems="start">
                <Text>{param.value}</Text>
                <Flex justifyContent="start" className="mt-1 gap-2">
                    {param.data?.tags?.category?.map((cat) => (
                        <Badge color="slate" size="xs">
                            {cat}
                        </Badge>
                    ))}
                    {!!param.data?.tags?.cis && (
                        <Badge color="sky" size="xs">
                            CIS
                        </Badge>
                    )}
                    {!!param.data?.tags?.hipaa && (
                        <Badge color="blue" size="xs">
                            Hipaa
                        </Badge>
                    )}
                </Flex>
            </Flex>
        ),
    },
    {
        headerName: 'Status',
        width: 150,
        type: 'string',
        valueFormatter: (
            param: ValueFormatterParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) => 'Disable',
    },
    {
        width: 150,
        type: 'string',
        resizable: false,
        cellRenderer: (
            param: ICellRendererParams<
                | GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                | undefined
            >
        ) => (
            <Flex justifyContent="end" className="h-full">
                <Text color="blue">Assign cloud account</Text>
                <Icon
                    icon={ChevronRightIcon}
                    color="blue"
                    size="md"
                    className="p-0"
                />
            </Flex>
        ),
    },
]

export default function Compliance() {
    const [selectedProvider, setSelectedProvider] = useState('')
    const [index, setIndex] = useState(1)

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()
    const [selectedState, setSelectedState] = useState('')
    // const [stateIndex, setStateIndex] = useState(0)
    //
    // useEffect(() => {
    //     switch (selectedState) {
    //         case '':
    //             setStateIndex(0)
    //             break
    //         case 'active':
    //             setStateIndex(1)
    //             break
    //         case 'not-active':
    //             setStateIndex(2)
    //             break
    //         default:
    //             setStateIndex(0)
    //             break
    //     }
    // }, [selectedState])

    return (
        <Layout currentPage="compliance">
            <Flex className="mb-4">
                <Flex className="gap-3 w-fit">
                    <Icon icon={ShieldCheckIcon} variant="shadow" />
                    <Title>Benchmark list</Title>
                </Flex>
                {/* <TabGroup index={stateIndex} className="w-fit">
                    <TabList variant="solid" className="px-0">
                        <Tab
                            className="px-4 py-2"
                            onClick={() => setSelectedState('')}
                        >
                            All
                        </Tab>
                        <Tab
                            className="px-4 py-2"
                            onClick={() => setSelectedState('active')}
                        >
                            Active
                        </Tab>
                        <Tab
                            className="px-4 py-2"
                            onClick={() => setSelectedState('not-active')}
                        >
                            Not active
                        </Tab>
                    </TabList>
                </TabGroup> */}
            </Flex>
            {(selectedState === '' || selectedState === 'active') && (
                <div className="mb-6">
                    <Text className="mb-3">Active</Text>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {isLoading ? (
                        <Spinner className="my-56" />
                    ) : // eslint-disable-next-line no-nested-ternary
                    error === undefined ? (
                        index === 1 ? (
                            <Grid className="w-full gap-4">
                                {benchmarkList(benchmarks?.benchmarkSummary)
                                    .connected.filter((bm) =>
                                        selectedProvider.length
                                            ? bm?.tags?.service?.includes(
                                                  selectedProvider
                                              )
                                            : bm
                                    )
                                    .map(
                                        (
                                            bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                        ) => (
                                            <ComplianceListCard
                                                benchmark={bm}
                                            />
                                        )
                                    )}
                            </Grid>
                        ) : (
                            <Grid numItems={3} className="w-full gap-4">
                                {benchmarkList(benchmarks?.benchmarkSummary)
                                    .connected.filter((bm) =>
                                        selectedProvider.length
                                            ? bm?.tags?.service?.includes(
                                                  selectedProvider
                                              )
                                            : bm
                                    )
                                    .map(
                                        (
                                            bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                        ) => (
                                            <ComplianceCard benchmark={bm} />
                                        )
                                    )}
                            </Grid>
                        )
                    ) : (
                        <Button onClick={() => sendNow()}>Retry</Button>
                    )}
                </div>
            )}
            {(selectedState === '' || selectedState === 'not-active') && (
                <>
                    <Text className="mb-3">Not active</Text>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {isLoading ? (
                        <Spinner className="mt-56" />
                    ) : // eslint-disable-next-line no-nested-ternary
                    error === undefined ? (
                        index === 1 ? (
                            <Grid className="w-full gap-4">
                                {benchmarkList(benchmarks?.benchmarkSummary)
                                    .notConnected?.sort(
                                        (a, b) =>
                                            (b?.checks?.passedCount || 0) -
                                            (a?.checks?.passedCount || 0)
                                    )
                                    .filter((bm) =>
                                        selectedProvider.length
                                            ? bm?.tags?.service?.includes(
                                                  selectedProvider
                                              )
                                            : bm
                                    )
                                    .map(
                                        (
                                            bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                        ) => (
                                            <ComplianceListCard
                                                benchmark={bm}
                                            />
                                        )
                                    )}
                            </Grid>
                        ) : (
                            <Grid numItems={3} className="w-full gap-4">
                                {benchmarkList(benchmarks?.benchmarkSummary)
                                    .notConnected?.sort(
                                        (a, b) =>
                                            (b?.checks?.passedCount || 0) -
                                            (a?.checks?.passedCount || 0)
                                    )
                                    .filter((bm) =>
                                        selectedProvider.length
                                            ? bm?.tags?.service?.includes(
                                                  selectedProvider
                                              )
                                            : bm
                                    )
                                    .map(
                                        (
                                            bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                        ) => (
                                            <ComplianceCard benchmark={bm} />
                                        )
                                    )}
                            </Grid>
                        )
                    ) : (
                        <Button onClick={() => sendNow()}>Retry</Button>
                    )}
                </>
            )}
        </Layout>
    )
}
