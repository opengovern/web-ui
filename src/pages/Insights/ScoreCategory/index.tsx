import { useCallback, useState } from 'react'
import {
    Button,
    Card,
    Flex,
    Text,
    Switch,
    TextInput,
    Badge,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@tremor/react'
import { useAtomValue } from 'jotai'
import {
    CommandLineIcon,
    BookOpenIcon,
    CodeBracketIcon,
    Cog8ToothIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    FunnelIcon,
} from '@heroicons/react/24/outline'
import {
    GridOptions,
    IAggFuncParams,
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { Link, useNavigate } from 'react-router-dom'
import { useComplianceApiV1BenchmarksControlsDetail, useInventoryApiV3AllBenchmarksControls } from '../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary } from '../../../api/api'
import TopHeader from '../../../components/Layout/Header'
import {
    searchAtom,
    useFilterState,
    useURLParam,
    useURLState,
} from '../../../utilities/urlstate'
import Table, { IColumn } from '../../../components/Table'
import { getConnectorIcon } from '../../../components/Cards/ConnectorCard'
import { severityBadge } from '../../Governance/Controls'
import {
    exactPriceDisplay,
    numberDisplay,
} from '../../../utilities/numericDisplay'
import { useInventoryApiV3AllQueryCategory } from '../../../api/inventory.gen'

interface IRecord
    extends GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary {
    serviceName: string
    tags: string[]
    passedResourcesCount?: number
}

interface IDetailCellRenderer {
    data: IRecord
}

const DetailCellRenderer = ({ data }: IDetailCellRenderer) => {
    const searchParams = useAtomValue(searchAtom)
    return (
        <Flex
            flexDirection="row"
            className="w-full h-full"
            alignItems="center"
            justifyContent="between"
        >
            <Text className="ml-12 truncate">{data.control?.description}</Text>
            <Link
                className="mr-2"
                to={`${data?.control?.id || ''}?${searchParams}`}
            >
                <Button size="xs">Open</Button>
            </Link>
        </Flex>
    )
}

const columns: (
    category: string,
    groupByServiceName: boolean,
    addTagFilter: (tag: string) => void
) => IColumn<IRecord, any>[] = (category, groupByServiceName, addTagFilter) => {
    const fixedColumns: IColumn<IRecord, any>[] = [
        {
            headerName: 'Title',
            field: 'control.title',
            type: 'custom',
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                suppressDoubleClickExpand: true,
                innerRenderer: (
                    params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
                ) => (
                    <Flex
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="start"
                        className="gap-2 h-full"
                    >
                        {getConnectorIcon(params.data?.control?.connector)}
                        <Text className="text-gray-800 mb-0.5 font-bold truncate">
                            {params.value}
                        </Text>
                    </Flex>
                ),
            },
            flex: 1,
            sortable: true,
            isBold: true,
        },
        {
            field: 'serviceName',
            headerName: 'Service Name',
            type: 'string',
            width: 150,
            sortable: true,
            enableRowGroup: true,
            rowGroup: groupByServiceName,
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
                                ? Object.entries(
                                      params.data?.control?.tags || {}
                                  )
                                      .filter(
                                          (v) => v[0] === 'score_service_name'
                                      )
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
            headerName: 'Failing Resources',
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
                    <Text className="font-bold ">
                        {numberDisplay(param.value, 0)} resources
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'passedResourcesCount',
            headerName: 'Passing Resources',
            type: 'string',
            width: 160,
            hide: true,
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
                    <Text className="font-bold ">
                        {numberDisplay(param.value, 0)} resources
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'control.tags',
            headerName: 'Tags',
            type: 'string',
            sortable: false,
            hide: false,
            width: 200,
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
                        {Object.entries(params.data?.control?.tags || {})
                            .filter((i) => i[0] === 'score_tags')
                            .map((item) =>
                                item[1].map((i) => {
                                    return (
                                        <Badge
                                            className="cursor-pointer"
                                            onClick={() => addTagFilter(i)}
                                        >
                                            {i}
                                        </Badge>
                                    )
                                })
                            )}
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
                        {(params.data?.control?.query?.parameters?.length ||
                            0) > 0
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

    if (category === 'cost_optimization') {
        fixedColumns.push({
            field: 'costOptimization',
            headerName: 'Cost Optimization',
            type: 'number',
            aggFunc: 'sum',
            sortable: true,
            hide: false,
            width: 150,
            cellRenderer: (
                params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary>
            ) => (
                <Flex
                    flexDirection="col"
                    className="h-full text-gray-900"
                    justifyContent="center"
                    alignItems="start"
                >
                    {exactPriceDisplay(params.value, 0)}
                </Flex>
            ),
        })
    }

    return fixedColumns
}

const options: GridOptions = {
    rowGroupPanelShow: 'always',
    // eslint-disable-next-line consistent-return
    isRowSelectable: (param) =>
        param.data?.totalResultValue || param.data?.oldTotalResultValue,
}

export default function ScoreCategory() {
    const { value: selectedConnections } = useFilterState()
    const [category, setCategory] = useURLParam('score_category', '')
    const detailCellRenderer = useCallback(DetailCellRenderer, [])
    const [selectedServiceNames, setSelectedServiceNames] = useURLState<
        string[]
    >(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('serviceNames', v)
            return res
        },
        (v) => {
            return v.get('serviceNames') || []
        }
    )
    const [selectedScoreTags, setSelectedScoreTags] = useURLState<string[]>(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('tags', v)
            return res
        },
        (v) => {
            return v.get('tags') || []
        }
    )
    const [selectedSeverities, setSelectedSeverities] = useURLState<string[]>(
        [],
        (v) => {
            const res = new Map<string, string[]>()
            res.set('severities', v)
            return res
        },
        (v) => {
            return v.get('severities') || []
        }
    )

    const navigate = useNavigate()
    const searchParams = useAtomValue(searchAtom)
    const [hideZero, setHideZero] = useState(true)
    const [quickFilterValue, setQuickFilterValue] = useState<string>('')
    const [openSearch, setOpenSearch] = useState(true)
    const [searchCategory, setSearchCategory] = useState('')

    const [isGrouped, setIsGrouped] = useState<boolean>(false)
    const categories = [
        'security',
        'cost_optimization',
        'operational_excellence',
        'reliability',
        'performance_efficiency',
    ]

    const tabIndex = category === '' ? 0 : categories.indexOf(category) + 1

    const {
        response: responseWS,
        isLoading: isLoadingWS,
        error: errorWS,
        sendNow: sendNowWS,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'aws_score_security',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 1
    )

    const {
        response: responseZS,
        isLoading: isLoadingZS,
        error: errorZS,
        sendNow: sendNowZS,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'azure_score_security',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 1
    )

    const {
        response: responseWC,
        isLoading: isLoadingWC,
        error: errorWC,
        sendNow: sendNowWC,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'aws_score_cost_optimization',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 2
    )

    const {
        response: responseZC,
        isLoading: isLoadingZC,
        error: errorZC,
        sendNow: sendNowZC,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'azure_score_cost_optimization',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 2
    )

    const {
        response: responseWO,
        isLoading: isLoadingWO,
        error: errorWO,
        sendNow: sendNowWO,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'aws_score_operational_excellence',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 3
    )

    const {
        response: responseZO,
        isLoading: isLoadingZO,
        error: errorZO,
        sendNow: sendNowZO,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'azure_score_operational_excellence',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 3
    )

    const {
        response: responseWR,
        isLoading: isLoadingWR,
        error: errorWR,
        sendNow: sendNowWR,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'aws_score_reliability',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 4
    )

    const {
        response: responseZR,
        isLoading: isLoadingZR,
        error: errorZR,
        sendNow: sendNowZR,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'azure_score_reliability',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 4
    )

    const {
        response: responseWE,
        isLoading: isLoadingWE,
        error: errorWE,
        sendNow: sendNowWE,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'aws_score_performance_efficiency',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 5
    )

    const {
        response: responseZE,
        isLoading: isLoadingZE,
        error: errorZE,
        sendNow: sendNowZE,
    } = useComplianceApiV1BenchmarksControlsDetail(
        'azure_score_performance_efficiency',
        {
            connectionId: selectedConnections.connections,
        },
        {},
        tabIndex === 0 || tabIndex === 5
    )

    const navigateToInsightsDetails = (id: string) => {
        navigate(`${id}?${searchParams}`)
    }

    const responseControls = (idx: number) => {
        const controls: GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[] =
            []

        if (idx === 0 || idx === 1) {
            responseWS?.control?.forEach((v) => controls.push(v))
            responseZS?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 2) {
            responseWC?.control?.forEach((v) => controls.push(v))
            responseZC?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 3) {
            responseWO?.control?.forEach((v) => controls.push(v))
            responseZO?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 4) {
            responseWR?.control?.forEach((v) => controls.push(v))
            responseZR?.control?.forEach((v) => controls.push(v))
        }
        if (idx === 0 || idx === 5) {
            responseWE?.control?.forEach((v) => controls.push(v))
            responseZE?.control?.forEach((v) => controls.push(v))
        }

        return controls
            .reduce<
                GithubComKaytuIoKaytuEnginePkgComplianceApiControlSummary[]
            >((prev, curr) => {
                if (
                    prev.filter((i) => i.control?.id === curr.control?.id)
                        .length > 0
                ) {
                    return prev
                }
                return [...prev, curr]
            }, [])
            .map((item) => {
                const r: IRecord = {
                    serviceName: Object.entries(item.control?.tags || {})
                        .filter((v) => v[0] === 'score_service_name')
                        .map((v) => v[1].join(','))
                        .join('\n'),
                    tags: Object.entries(item?.control?.tags || {})
                        .filter((i) => i[0] === 'score_tags')
                        .flatMap((i) => i[1]),
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
                return isLoadingWS || isLoadingZS
            case 2:
                return isLoadingWC || isLoadingZC
            case 3:
                return isLoadingWO || isLoadingZO
            case 4:
                return isLoadingWR || isLoadingZR
            case 5:
                return isLoadingWE || isLoadingZE
            default:
                return (
                    isLoadingWS ||
                    isLoadingWC ||
                    isLoadingWR ||
                    isLoadingWO ||
                    isLoadingWE ||
                    isLoadingZS ||
                    isLoadingZC ||
                    isLoadingZR ||
                    isLoadingZO ||
                    isLoadingZE
                )
        }
    }

    const res = responseControls(tabIndex)
    const resFiltered = res.filter((item) => {
        if (selectedServiceNames.length > 0) {
            if (!selectedServiceNames.includes(item.serviceName)) {
                return false
            }
        }
        if (selectedScoreTags.length > 0) {
            if (
                item.tags.filter((t) => selectedScoreTags.includes(t))
                    .length === 0
            ) {
                return false
            }
        }
        if (selectedSeverities.length > 0) {
            if (!selectedSeverities.includes(item.control?.severity || '')) {
                return false
            }
        }
        return true
    })
    const serviceNames = res
        .map((v) => v.serviceName)
        .reduce<string[]>((prev, curr) => {
            if (prev.includes(curr)) {
                return prev
            }
            return [...prev, curr]
        }, [])
    const tags = res
        .flatMap((v) =>
            Object.entries(v?.control?.tags || {})
                .filter((i) => i[0] === 'score_tags')
                .flatMap((item) => item[1])
        )
        .reduce<string[]>((prev, curr) => {
            if (prev.includes(curr)) {
                return prev
            }
            return [...prev, curr]
        }, [])

    const { response: categoriesAll, isLoading: categoryLoading } =
        useInventoryApiV3AllBenchmarksControls()

    return (
        <>
            <TopHeader
                serviceNames={serviceNames}
                tags={tags}
                supportedFilters={[
                    // 'Environment',
                    // 'Product',
                    'Cloud Account',
                    'Service Name',
                    'Severity',
                    'Tag',
                    'Score Category',
                ]}
                initialFilters={[
                    'Score Category',
                    'Cloud Account',
                    // 'Product',
                    'Tag',
                ]}
            />

            <Flex alignItems="start" className="gap-4">
                {openSearch ? (
                    <Card className="sticky w-fit">
                        <TextInput
                            className="w-56 mb-6"
                            icon={MagnifyingGlassIcon}
                            placeholder="Search..."
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        />
                        {categoriesAll?.categories.map(
                            (cat) =>
                                !!cat.tables?.filter((catt) =>
                                    catt.name
                                        .toLowerCase()
                                        .includes(searchCategory.toLowerCase())
                                ).length && (
                                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                                            <Text className="text-gray-800 text-left">
                                                {cat.category}
                                            </Text>
                                        </AccordionHeader>
                                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                                            <Flex
                                                flexDirection="col"
                                                justifyContent="start"
                                            >
                                                {cat.tables
                                                    ?.filter((catt) =>
                                                        catt.name
                                                            .toLowerCase()
                                                            .includes(
                                                                searchCategory.toLowerCase()
                                                            )
                                                    )
                                                    .map((subCat) => (
                                                        <Flex
                                                            justifyContent="start"
                                                            onClick={() =>{}
                                                                // setCode(
                                                                //     `select * from kaytu_resources where resource_type = '${subCat}'`
                                                                // )
                                                            }
                                                        >
                                                            <Text className="ml-4 w-full truncate text-start py-2 cursor-pointer hover:text-kaytu-600">
                                                                {subCat.name}
                                                            </Text>
                                                        </Flex>
                                                    ))}
                                            </Flex>
                                        </AccordionBody>
                                    </Accordion>
                                )
                        )}
                        <Flex justifyContent="end" className="mt-12">
                            <Button
                                variant="light"
                                onClick={() => setOpenSearch(false)}
                            >
                                <ChevronDoubleLeftIcon className="h-4" />
                            </Button>
                        </Flex>
                    </Card>
                ) : (
                    <Flex
                        flexDirection="col"
                        justifyContent="center"
                        className="min-h-full w-fit"
                    >
                        <Button
                            variant="light"
                            onClick={() => setOpenSearch(true)}
                        >
                            <Flex flexDirection="col" className="gap-4 w-4">
                                <FunnelIcon />
                                <Text className="rotate-90">Options</Text>
                            </Flex>
                        </Button>
                    </Flex>
                )}
                {errorWS === undefined &&
                errorWC === undefined &&
                errorWO === undefined &&
                errorWR === undefined &&
                errorWE === undefined &&
                errorZS === undefined &&
                errorZC === undefined &&
                errorZO === undefined &&
                errorZR === undefined &&
                errorZE === undefined ? (
                    <Flex className="flex flex-col space-y-2">
                        <Flex flexDirection="row" justifyContent="between">
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                value={quickFilterValue}
                                onValueChange={setQuickFilterValue}
                                placeholder="Search here..."
                                className="w-72"
                            />
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
                            key="insight_list"
                            id="insight_list"
                            masterDetail
                            detailCellRenderer={detailCellRenderer}
                            columns={columns(category, isGrouped, (tag) => {
                                setSelectedScoreTags([
                                    ...selectedScoreTags,
                                    tag,
                                ])
                            })}
                            rowData={resFiltered?.filter((v) => {
                                return hideZero
                                    ? (v.totalResourcesCount || 0) !== 0
                                    : true
                            })}
                            options={options}
                            onColumnRowGroupChanged={(e) => {
                                if (
                                    e.column?.isRowGroupActive() !== undefined
                                ) {
                                    setIsGrouped(e.column?.isRowGroupActive())
                                }
                            }}
                            onRowClicked={(
                                event: RowClickedEvent<IRecord, any>
                            ) => {
                                if (!event.node.expanded) {
                                    event.api.forEachNode((node) =>
                                        node.setExpanded(false)
                                    )
                                }
                                event.node.setExpanded(!event.node.expanded)
                            }}
                            loading={isLoading(tabIndex)}
                            // rowHeight="lg"
                            quickFilter={quickFilterValue}
                        />
                    </Flex>
                ) : (
                    <Button
                        onClick={() => {
                            sendNowWS()
                            sendNowWC()
                            sendNowWO()
                            sendNowWR()
                            sendNowWE()
                            sendNowZS()
                            sendNowZC()
                            sendNowZO()
                            sendNowZR()
                            sendNowZE()
                        }}
                    >
                        Retry
                    </Button>
                )}
            </Flex>
        </>
    )
}
