import { useState } from 'react'
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

const columns: IColumn<
    GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
    any
>[] = [
    {
        headerName: 'Provider',
        field: 'control.connector',
        type: 'connector',
        sortable: true,
        width: 200,
        enableRowGroup: true,
    },
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
                flexDirection="col"
                alignItems="start"
                justifyContent="center"
                className="gap-2 h-full"
            >
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
                        .filter((v) => v[0] === 'score-service-name')
                        .map((v) => v[1].join(','))
                        .join('\n')}
                </Text>
            </Flex>
        ),
    },
    {
        headerName: 'Categories',
        type: 'custom',
        sortable: true,
        width: 120,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex
                justifyContent="center"
                className="gap-1.5"
                flexDirection="col"
            >
                {Object.entries(params.data?.control?.tags || {})
                    .filter((v) => v[0] === 'score_category')
                    .map((v) =>
                        v[1].map((b) => (
                            <Badge size="xs" color="gray">
                                {b}
                            </Badge>
                        ))
                    )}
            </Flex>
        ),
    },
    {
        headerName: 'Risk',
        type: 'custom',
        sortable: true,
        width: 100,
        enableRowGroup: true,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
        ) => (
            <Flex justifyContent="start" className="gap-1">
                {Object.entries(params.data?.control?.tags || {})
                    .filter((v) => v[0] === 'score_risk')
                    .map((v) =>
                        v[1].map((b) => (
                            <Badge size="xs" color="emerald">
                                {b}
                            </Badge>
                        ))
                    )}
            </Flex>
        ),
    },

    {
        headerName: 'Result',
        type: 'custom',
        width: 160,
        cellRenderer: (
            param: ValueFormatterParams<
                GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary,
                any
            >
        ) => (
            <Flex className="mt-1" flexDirection="col" justifyContent="center">
                <Flex justifyContent="start" className="gap-1">
                    <Icon
                        className="w-4"
                        icon={CheckCircleIcon}
                        color="emerald"
                    />
                    <Text>Passed:</Text>
                    <Text className="font-bold">
                        {(param.data?.totalResourcesCount || 0) -
                            (param.data?.failedResourcesCount || 0)}
                    </Text>
                </Flex>
                <Flex justifyContent="start" className="gap-1">
                    <Icon className="w-4" icon={XCircleIcon} color="rose" />
                    <Text>Failed:</Text>
                    <Text className="font-bold ">
                        {param.data?.failedResourcesCount || 0}
                    </Text>
                </Flex>
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

    const { response, isLoading, error, sendNow } =
        useComplianceApiV1BenchmarksControlsDetail(category || '', {
            connectionId: selectedConnections.connections,
        })

    const navigateToInsightsDetails = (id: string) => {
        navigate(`${id}?${searchParams}`)
    }

    return (
        <>
            <TopHeader filter />

            <Flex alignItems="start" className="gap-4">
                {error === undefined ? (
                    <Flex className="flex flex-col">
                        <TabGroup className="mb-6">
                            <TabList>
                                <Tab>SCORE Insights</Tab>
                                <Flex flexDirection="row" justifyContent="end">
                                    <Text className="mr-2">
                                        Hide zero results
                                    </Text>
                                    <Switch
                                        id="switch"
                                        name="switch"
                                        checked={hideZero}
                                        onChange={setHideZero}
                                    />
                                </Flex>
                            </TabList>
                        </TabGroup>
                        <Table
                            id="insight_list"
                            columns={columns}
                            rowData={response?.control?.filter((v) => {
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
                            loading={isLoading}
                            rowHeight="xl"
                        />
                    </Flex>
                ) : (
                    <Button onClick={() => sendNow()}>Retry</Button>
                )}
            </Flex>
        </>
    )
}
