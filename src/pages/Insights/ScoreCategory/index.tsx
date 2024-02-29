import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Flex,
    Tab,
    TabGroup,
    TabList,
    Text,
    Icon,
    Badge,
    Switch,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import {
    CheckCircleIcon,
    XCircleIcon,
    CommandLineIcon,
    BookOpenIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
} from '@heroicons/react/24/outline'
import {
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary } from '../../../api/api'
import TopHeader from '../../../components/Layout/Header'
import { searchAtom, useFilterState } from '../../../utilities/urlstate'
import Table, { IColumn } from '../../../components/Table'
import { getConnectorIcon } from '../../../components/Cards/ConnectorCard'
import { severityBadge } from '../../Governance/Controls'

const columns: IColumn<
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
    any
>[] = [
    {
        headerName: 'Title',
        field: 'control.title',
        type: 'custom',
        sortable: false,
        isBold: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="start"
                className="gap-2 h-full"
            >
                {getConnectorIcon(params.data?.control?.connector)}
                <Text className="text-gray-800 mb-0.5 font-bold">
                    {params.value}
                </Text>
            </Flex>
        ),
    },
    {
        headerName: 'Service Name',
        type: 'custom',
        sortable: false,
        isBold: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex
                flexDirection="col"
                alignItems="start"
                justifyContent="center"
                className="gap-2 h-full"
            >
                <Text className="text-gray-800 mb-0.5 font-bold">
                    {Object.entries(params.data?.control?.tags || {})
                        .filter((v) => v[0] === 'score_service_name')
                        .map((v) => v[1].join(','))
                        .join('\n')}
                </Text>
            </Flex>
        ),
    },
    {
        field: 'control.severity',
        headerName: 'Risk',
        type: 'custom',
        sortable: true,
        width: 100,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => <Flex className="h-full">{severityBadge(params.value)}</Flex>,
    },

    {
        field: 'failedResourcesCount',
        headerName: 'Failed',
        type: 'custom',
        width: 160,
        cellRenderer: (
            param: ValueFormatterParams<
                GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
                any
            >
        ) => (
            <Flex
                justifyContent="start"
                alignItems="center"
                className="h-full gap-1"
            >
                <Icon className="w-4" icon={XCircleIcon} color="rose" />
                <Text>Failed:</Text>
                <Text className="font-bold ">
                    {param.data?.failedResourcesCount || 0}
                </Text>
            </Flex>
        ),
    },
    {
        headerName: 'Passed',
        type: 'string',
        width: 160,
        sortable: true,
        comparator: (
            valueA:
                | GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary
                | undefined,
            valueB:
                | GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary
                | undefined,
            isDescending: boolean
        ) => {
            const passedA =
                (valueA?.totalResourcesCount || 0) -
                (valueA?.failedResourcesCount || 0)
            const passedB =
                (valueB?.totalResourcesCount || 0) -
                (valueB?.failedResourcesCount || 0)
            const z = isDescending ? 1 : -1
            return passedA > passedB ? 1 * z : -1 * z
        },
        cellRenderer: (
            param: ValueFormatterParams<
                GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
                any
            >
        ) => (
            <Flex
                justifyContent="start"
                alignItems="center"
                className="h-full gap-1"
            >
                <Icon className="w-4" icon={CheckCircleIcon} color="emerald" />
                <Text>Passed:</Text>
                <Text className="font-bold">
                    {(param.data?.totalResourcesCount || 0) -
                        (param.data?.failedResourcesCount || 0)}
                </Text>
            </Flex>
        ),
    },
    {
        field: 'control.query.parameters',
        headerName: 'Customizable',
        type: 'string',
        sortable: true,
        hide: true,
        width: 200,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex>
                {(params.data?.control?.query?.parameters?.length || 0) > 0
                    ? 'True'
                    : 'False'}
            </Flex>
        ),
    },
    {
        headerName: 'Fix It',
        type: 'custom',
        sortable: true,
        hide: true,
        width: 200,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex justifyContent="start" className="gap-3">
                {params.data?.control?.cliRemediation && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <CommandLineIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Command line (CLI)</Text>
                        </Card>
                    </div>
                )}
                {params.data?.control?.manualRemediation && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <BookOpenIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Manual</Text>
                        </Card>
                    </div>
                )}
                {params.data?.control?.programmaticRemediation && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <CodeBracketIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Programmatic</Text>
                        </Card>
                    </div>
                )}
                {params.data?.control?.guardrailRemediation && (
                    <div className="group relative flex justify-center cursor-pointer">
                        <Cog8ToothIcon className="text-kaytu-500 w-5" />
                        <Card className="absolute -top-2.5 left-6 w-fit z-40 scale-0 transition-all rounded p-2 group-hover:scale-100">
                            <Text>Guard rail</Text>
                        </Card>
                    </div>
                )}
            </Flex>
        ),
    },
]

const options: GridOptions = {
    // eslint-disable-next-line consistent-return
    isRowSelectable: (param) =>
        param.data?.totalResultValue || param.data?.oldTotalResultValue,
}

export default function ScoreCategory() {
    const { value: selectedConnections } = useFilterState()
    const { category } = useParams()
    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const [hideZero, setHideZero] = useState(true)
    const categories = [
        'security',
        'cost_optimization',
        'operational_excellence',
        'reliability',
        'performance_efficiency',
    ]
    const [tabIndex, setTabIndex] = useState<number>(
        categories.indexOf(category || '') + 1
    )

    const {
        response: responseS,
        isLoading: isLoadingS,
        error: errorS,
        sendNow: sendNowS,
    } = useComplianceApiV1BenchmarksControlsDetail('security', {
        connectionId: selectedConnections.connections,
    })

    const {
        response: responseC,
        isLoading: isLoadingC,
        error: errorC,
        sendNow: sendNowC,
    } = useComplianceApiV1BenchmarksControlsDetail('cost_optimization', {
        connectionId: selectedConnections.connections,
    })

    const {
        response: responseO,
        isLoading: isLoadingO,
        error: errorO,
        sendNow: sendNowO,
    } = useComplianceApiV1BenchmarksControlsDetail('operational_excellence', {
        connectionId: selectedConnections.connections,
    })

    const {
        response: responseR,
        isLoading: isLoadingR,
        error: errorR,
        sendNow: sendNowR,
    } = useComplianceApiV1BenchmarksControlsDetail('reliability', {
        connectionId: selectedConnections.connections,
    })

    const {
        response: responseE,
        isLoading: isLoadingE,
        error: errorE,
        sendNow: sendNowE,
    } = useComplianceApiV1BenchmarksControlsDetail('performance_efficiency', {
        connectionId: selectedConnections.connections,
    })

    const navigateToInsightsDetails = (id: string) => {
        navigate(`${id}?${searchParams}`)
    }

    const responseControls = (idx: number) => {
        const controls: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[] =
            []

        if (idx === 0 || idx === 1) {
            responseS?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 2) {
            responseC?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 3) {
            responseO?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 4) {
            responseR?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 5) {
            responseE?.control?.forEach((v) => controls.push(v))
        }

        return controls
    }

    useEffect(() => {
        console.log(tabIndex)
    }, [tabIndex])

    return (
        <>
            <TopHeader filter filterList={['cloud-account']} />

            <Flex alignItems="start" className="gap-4">
                {errorS === undefined &&
                errorC === undefined &&
                errorO === undefined &&
                errorR === undefined &&
                errorE === undefined ? (
                    <Flex className="flex flex-col">
                        <Flex
                            flexDirection="row"
                            justifyContent="between"
                            className="mb-2"
                        >
                            <div className="w-fit">
                                <TabGroup
                                    className="mb-6 m-0"
                                    defaultIndex={tabIndex}
                                    tabIndex={tabIndex}
                                    onIndexChange={(i) => setTabIndex(i)}
                                >
                                    <TabList>
                                        <Tab>All SCORE Insights</Tab>
                                        <Tab>Security</Tab>
                                        <Tab>Cost Optimization</Tab>
                                        <Tab>Operational Excellence</Tab>
                                        <Tab>Reliability</Tab>
                                        <Tab>Efficiency</Tab>
                                    </TabList>
                                </TabGroup>
                            </div>
                            <Flex flexDirection="row" className="w-fit">
                                <Text className="mr-2">Hide zero results</Text>
                                <Switch
                                    id="switch"
                                    name="switch"
                                    checked={hideZero}
                                    onChange={setHideZero}
                                />
                            </Flex>
                        </Flex>
                        <Table
                            key={`insight_list_${tabIndex}`}
                            id={`insight_list_${tabIndex}`}
                            columns={columns}
                            rowData={responseControls(tabIndex)?.filter((v) => {
                                return hideZero
                                    ? (v.totalResourcesCount || 0) !== 0
                                    : true
                            })}
                            options={options}
                            onRowClicked={(
                                event: RowClickedEvent<
                                    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
                                    any
                                >
                            ) => {
                                navigateToInsightsDetails(
                                    event.data?.control?.id || ''
                                )
                            }}
                            loading={
                                isLoadingS ||
                                isLoadingC ||
                                isLoadingO ||
                                isLoadingR ||
                                isLoadingE
                            }
                            rowHeight="xl"
                        />
                    </Flex>
                ) : (
                    <Button
                        onClick={() => {
                            sendNowS()
                            sendNowC()
                            sendNowO()
                            sendNowR()
                            sendNowE()
                        }}
                    >
                        Retry
                    </Button>
                )}
            </Flex>
        </>
    )
}
