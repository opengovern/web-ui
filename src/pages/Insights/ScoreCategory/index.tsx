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
    IAggFuncParams,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useNavigate, useParams } from 'react-router-dom'
import { useComplianceApiV1BenchmarksControlsDetail } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary } from '../../../api/api'
import TopHeader from '../../../components/Layout/Header'
import {
    searchAtom,
    useFilterState,
    useURLParam,
} from '../../../utilities/urlstate'
import Table, { IColumn } from '../../../components/Table'
import { getConnectorIcon } from '../../../components/Cards/ConnectorCard'
import { severityBadge } from '../../Governance/Controls'

interface IRecord
    extends GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary {
    serviceName: string
    passedResourcesCount?: number
}

const columns: IColumn<IRecord, any>[] = [
    {
        headerName: 'Title',
        field: 'control.title',
        type: 'custom',
        flex: 1,
        sortable: true,
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
        field: 'serviceName',
        headerName: 'Service Name',
        type: 'string',
        width: 150,
        sortable: true,
        enableRowGroup: true,
        isBold: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => {
            return params.data ? (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="gap-2 h-full"
                >
                    <Text className="text-gray-800 mb-0.5 font-bold">
                        {params.data
                            ? Object.entries(params.data?.control?.tags || {})
                                  .filter((v) => v[0] === 'score_service_name')
                                  .map((v) => v[1].join(','))
                                  .join('\n')
                            : params.value}
                    </Text>
                </Flex>
            ) : (
                params.value
            )
        },
    },
    {
        field: 'control.severity',
        headerName: 'Risk',
        type: 'string',
        sortable: true,
        aggFunc: (p: IAggFuncParams<IRecord>) => {
            return 'grouped'
        },
        width: 100,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) =>
            params.value !== 'grouped' && (
                <Flex className="h-full min-h-[40px]">
                    {severityBadge(params.value)}
                </Flex>
            ),
    },

    {
        field: 'failedResourcesCount',
        headerName: 'Failed',
        type: 'custom',
        aggFunc: 'sum',
        sortable: true,
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
                <Text className="font-bold ">{param.value}</Text>
            </Flex>
        ),
    },
    {
        field: 'passedResourcesCount',
        headerName: 'Passed',
        type: 'string',
        width: 160,
        aggFunc: 'sum',
        sortable: true,
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
                <Text className="font-bold ">{param.value}</Text>
            </Flex>
        ),
    },
    {
        field: 'control.query.parameters',
        headerName: 'Customizable',
        type: 'string',
        sortable: true,
        hide: true,
        width: 150,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) =>
            params.data && (
                <Flex
                    flexDirection="col"
                    className="h-full"
                    justifyContent="center"
                    alignItems="start"
                >
                    {(params.data?.control?.query?.parameters?.length || 0) > 0
                        ? 'True'
                        : 'False'}
                </Flex>
            ),
    },
    {
        headerName: 'Fix It',
        type: 'custom',
        hide: true,
        width: 200,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) =>
            params.data && (
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
    rowGroupPanelShow: 'always',
    // enableGroupEdit: true,
    // groupAllowUnbalanced: true,
    // autoGroupColumnDef: {
    //     width: 200,
    //     sortable: true,
    //     filter: true,
    //     resizable: true,
    // },

    // eslint-disable-next-line consistent-return
    isRowSelectable: (param) =>
        param.data?.totalResultValue || param.data?.oldTotalResultValue,
}

export default function ScoreCategory() {
    const { value: selectedConnections } = useFilterState()
    const [category, setCategory] = useURLParam('category', '')
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

    const tabIndex = category === '' ? 0 : categories.indexOf(category) + 1
    const setTabIndex = (i: number) => {
        if (i === 0) {
            setCategory('')
        } else {
            setCategory(categories[i - 1])
        }
    }

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

        return controls.map((item) => {
            const r: IRecord = {
                serviceName: Object.entries(item.control?.tags || {})
                    .filter((v) => v[0] === 'score_service_name')
                    .map((v) => v[1].join(','))
                    .join('\n'),
                passedResourcesCount:
                    (item.totalResourcesCount || 0) -
                    (item.failedResourcesCount || 0),
                ...item,
            }
            return r
        })
    }

    const isLoading = (idx: number) => {
        switch (idx) {
            case 1:
                return isLoadingS
            case 2:
                return isLoadingC
            case 3:
                return isLoadingO
            case 4:
                return isLoadingR
            case 5:
                return isLoadingE
            default:
                return (
                    isLoadingS ||
                    isLoadingC ||
                    isLoadingR ||
                    isLoadingO ||
                    isLoadingE
                )
        }
    }

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
                                event: RowClickedEvent<IRecord, any>
                            ) => {
                                navigateToInsightsDetails(
                                    event.data?.control?.id || ''
                                )
                            }}
                            loading={isLoading(tabIndex)}
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
