import { Badge, Button, Flex, Grid, Icon, Text, Title } from '@tremor/react'
import { useState } from 'react'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { useComplianceApiV1BenchmarksSummaryList } from '../../../api/compliance.gen'
import Spinner from '../../../components/Spinner'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary } from '../../../api/api'
import ComplianceCard, {
    benchmarkChecks,
} from '../../../components/Cards/ComplianceCard'
import { IColumn } from '../../../components/Table'
import { numberDisplay } from '../../../utilities/numericDisplay'
import ComplianceListCard from '../../../components/Cards/ComplianceListCard'
import TopHeader from '../../../components/Layout/Header'
import FilterGroup, { IFilter } from '../../../components/FilterGroup'
import { useURLParam, useURLState } from '../../../utilities/urlstate'
import {
    BenchmarkAuditTrackingFilter,
    BenchmarkFrameworkFilter,
    BenchmarkStateFilter,
    ConnectorFilter,
    ScoreCategory,
    ServiceNameFilter,
} from '../../../components/FilterGroup/FilterTypes'
import {
    errorHandling,
    errorHandlingWithErrorMessage,
    toErrorMessage,
} from '../../../types/apierror'

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
                ((param.data?.conformanceStatusSummary?.passed || 0) /
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
    // New filter variables :
    const defaultSelectedConnectors = ''
    const [selectedConnectors, setSelectedConnectors] = useURLParam<
        '' | 'AWS' | 'Azure' | 'EntraID'
    >('provider', defaultSelectedConnectors)
    const parseConnector = (v: string) => {
        switch (v) {
            case 'AWS':
                return 'AWS'
            case 'Azure':
                return 'Azure'
            case 'EntraID':
                return 'EntraID'
            default:
                return ''
        }
    }

    const defaultSelectedBenchmarkState = ''
    const [selectedBenchmarkState, setSelectedBenchmarkState] = useURLParam<
        '' | 'active' | 'notactive'
    >('benchmarkstate', defaultSelectedBenchmarkState)
    const parseState = (v: string) => {
        switch (v) {
            case 'active':
                return 'active'
            case 'notactive':
                return 'notactive'
            default:
                return ''
        }
    }

    const defaultSelectedAuditTracking = 'enabled'
    const [selectedAuditTracking, setSelectedAuditTracking] = useURLParam<
        'enabled' | 'disabled'
    >('audittracking', defaultSelectedAuditTracking)
    const parseAuditTracking = (v: string) => {
        switch (v) {
            case 'disabled':
                return 'disabled'
            default:
                return 'enabled'
        }
    }

    const defaultSelectedScoreCategory = ''
    const [selectedScoreCategory, setSelectedScoreCategory] =
        useURLState<string>(
            defaultSelectedScoreCategory,
            (v) => {
                const res = new Map<string, string[]>()
                res.set('category', [v])
                return res
            },
            (v) => {
                return (v.get('category') || []).at(0) || ''
            }
        )

    const defaultSelectedFramework: string[] = []
    const [selectedFrameworks, setSelectedFrameworks] = useURLState<string[]>(
        defaultSelectedFramework,
        (v) => {
            const res = new Map<string, string[]>()
            res.set('frameworks', v)
            return res
        },
        (v) => {
            return v.get('frameworks') || []
        }
    )

    const defaultSelectedServiceNames: string[] = []
    const [selectedServiceNames, setSelectedServiceNames] = useURLState<
        string[]
    >(
        defaultSelectedServiceNames,
        (v) => {
            const res = new Map<string, string[]>()
            res.set('serviceNames', v)
            return res
        },
        (v) => {
            return v.get('serviceNames') || []
        }
    )
    const serviceNames: string[] = []

    const calcInitialFilters = () => {
        const resp = ['State', 'Connector', 'Score Category']

        if (selectedAuditTracking !== defaultSelectedAuditTracking) {
            resp.push('Audit Tracking')
        }
        if (selectedFrameworks !== defaultSelectedFramework) {
            resp.push('Framework')
        }
        return resp
    }
    const [addedFilters, setAddedFilters] = useState<string[]>(
        calcInitialFilters()
    )

    const filters: IFilter[] = [
        ConnectorFilter(
            selectedConnectors,
            selectedConnectors !== '',
            (sv) => setSelectedConnectors(parseConnector(sv)),
            () => {
                setAddedFilters(addedFilters.filter((a) => a !== 'Connector'))
                setSelectedConnectors(defaultSelectedConnectors)
            },
            () => setSelectedConnectors(defaultSelectedConnectors)
        ),

        ScoreCategory(
            selectedScoreCategory,
            selectedScoreCategory.length > 0,
            setSelectedScoreCategory,
            () => {
                setAddedFilters(
                    addedFilters.filter((a) => a !== 'Score Category')
                )
                setSelectedScoreCategory(defaultSelectedScoreCategory)
            },
            () => setSelectedScoreCategory(defaultSelectedScoreCategory)
        ),

        BenchmarkStateFilter(
            selectedBenchmarkState,
            selectedBenchmarkState !== defaultSelectedBenchmarkState,
            (sv) => setSelectedBenchmarkState(parseState(sv)),
            () => setSelectedBenchmarkState(defaultSelectedBenchmarkState)
        ),

        BenchmarkAuditTrackingFilter(
            selectedAuditTracking,
            selectedAuditTracking !== defaultSelectedAuditTracking,
            (sv) => setSelectedAuditTracking(parseAuditTracking(sv)),
            () => {
                setAddedFilters(
                    addedFilters.filter((a) => a !== 'Audit Tracking')
                )
                setSelectedAuditTracking(defaultSelectedAuditTracking)
            },
            () => setSelectedAuditTracking(defaultSelectedAuditTracking)
        ),

        BenchmarkFrameworkFilter(
            selectedFrameworks,
            selectedFrameworks.length > 0,
            (sv) => {
                if (selectedFrameworks.includes(sv)) {
                    setSelectedFrameworks(
                        selectedFrameworks.filter((i) => i !== sv)
                    )
                } else setSelectedFrameworks([...selectedFrameworks, sv])
            },
            () => {
                setAddedFilters(addedFilters.filter((a) => a !== 'Framework'))
                setSelectedFrameworks(defaultSelectedFramework)
            },
            () => setSelectedFrameworks(defaultSelectedFramework)
        ),

        ServiceNameFilter(
            serviceNames?.map((i) => {
                return {
                    title: i,
                    value: i,
                }
            }) || [],
            (sv) => {
                if (selectedServiceNames.includes(sv)) {
                    setSelectedServiceNames(
                        selectedServiceNames.filter((i) => i !== sv)
                    )
                } else setSelectedServiceNames([...selectedServiceNames, sv])
            },
            selectedServiceNames,
            selectedServiceNames.length > 0,
            () => {
                setAddedFilters(
                    addedFilters.filter((a) => a !== 'Service Name')
                )
                setSelectedServiceNames(defaultSelectedServiceNames)
            },
            () => setSelectedServiceNames(defaultSelectedServiceNames)
        ),
    ]
    // End of new filter variables

    const [selectedProvider, setSelectedProvider] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [index, setIndex] = useState(1)

    const {
        response: benchmarks,
        isLoading,
        error,
        sendNow,
    } = useComplianceApiV1BenchmarksSummaryList()

    const active = benchmarkList(benchmarks?.benchmarkSummary).connected.filter(
        (bm) =>
            selectedProvider.length
                ? bm?.tags?.service?.includes(selectedProvider)
                : bm
    )

    const inactive = benchmarkList(benchmarks?.benchmarkSummary)
        .notConnected?.sort(
            (a, b) =>
                (b?.checks?.passedCount || 0) - (a?.checks?.passedCount || 0)
        )
        .filter((bm) =>
            selectedProvider.length
                ? bm?.tags?.service?.includes(selectedProvider)
                : bm
        )

    return (
        <>
            <TopHeader />
            <Flex className="mb-4">
                <Flex className="gap-2 w-fit">
                    <Icon icon={ShieldCheckIcon} />
                    <Title>Benchmark list</Title>
                </Flex>
            </Flex>
            <Flex className="mb-6">
                <FilterGroup
                    filterList={filters}
                    addedFilters={addedFilters}
                    onFilterAdded={(i) => setAddedFilters([...addedFilters, i])}
                    alignment="left"
                />
            </Flex>

            {(selectedState === '' || selectedState === 'active') && (
                <div className="mb-6">
                    {/* <Text className="mb-3">Active ({active.length})</Text> */}
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {isLoading ? (
                        <Spinner className="my-56" />
                    ) : // eslint-disable-next-line no-nested-ternary
                    index === 1 ? (
                        <Grid className="w-full gap-4">
                            {active.map(
                                (
                                    bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                ) => (
                                    <ComplianceListCard benchmark={bm} />
                                )
                            )}
                        </Grid>
                    ) : (
                        <Grid numItems={3} className="w-full gap-4">
                            {active.map(
                                (
                                    bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                                ) => (
                                    <ComplianceCard benchmark={bm} />
                                )
                            )}
                        </Grid>
                    )}
                </div>
            )}
            {(selectedState === '' || selectedState === 'not-active') &&
                (index === 1 ? (
                    <Grid className="w-full gap-4">
                        {inactive.map(
                            (
                                bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                            ) => (
                                <ComplianceListCard benchmark={bm} />
                            )
                        )}
                    </Grid>
                ) : (
                    <Grid numItems={3} className="w-full gap-4">
                        {inactive.map(
                            (
                                bm: GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkEvaluationSummary
                            ) => (
                                <ComplianceCard benchmark={bm} />
                            )
                        )}
                    </Grid>
                ))}

            {errorHandling(sendNow, error)}
        </>
    )
}
