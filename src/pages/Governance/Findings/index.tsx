import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Divider,
    Flex,
    Icon,
    Text,
    TextInput,
} from '@tremor/react'
import { useMemo, useState } from 'react'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import { useAtomValue, useSetAtom } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Checkbox, Radio, useCheckboxState } from 'pretty-checkbox-react'
import {
    CheckCircleIcon,
    MagnifyingGlassIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import { isDemoAtom, notificationAtom } from '../../../store'
import Table, { IColumn } from '../../../components/Table'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import {
    useComplianceApiV1BenchmarksSummaryList,
    useComplianceApiV1FindingsFiltersCreate,
} from '../../../api/compliance.gen'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import Spinner from '../../../components/Spinner'
import { benchmarkList } from '../Compliance'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    SourceType,
} from '../../../api/api'
import AxiosAPI from '../../../api/ApiConfig'
import FindingDetail from './Detail'
import { AWSIcon, AzureIcon } from '../../../icons/icons'
import { compareArrays } from '../../../components/Filter'
import { severityBadge } from '../Compliance/BenchmarkSummary/Controls'

export const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            width: 140,
            field: 'connector',
            headerName: 'Cloud provider',
            sortable: true,
            filter: true,
            hide: true,
            enableRowGroup: true,
            type: 'string',
        },
        {
            field: 'resourceName',
            headerName: 'Resource name',
            hide: false,
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'resourceType',
            headerName: 'Resource type',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'resourceTypeName',
            headerName: 'Resource type label',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
        },
        // {
        //     field: 'controlID',
        //     headerName: 'Control ID',
        //     type: 'string',
        //     enableRowGroup: true,
        //     sortable: true,
        //     filter: true,
        //     hide: true,
        //     resizable: true,
        //     flex: 1,
        // },
        {
            field: 'benchmarkID',
            headerName: 'Benchmark ID',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        // {
        //     field: 'controlTitle',
        //     headerName: 'Control title',
        //     type: 'string',
        //     enableRowGroup: true,
        //     sortable: false,
        //     filter: true,
        //     resizable: true,
        //     flex: 1,
        // },
        {
            field: 'providerConnectionName',
            headerName: 'Cloud provider name',
            type: 'string',
            enableRowGroup: true,
            hide: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionID',
            headerName: 'Cloud provider ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu connection ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'severity',
            headerName: 'Severity',
            type: 'string',
            sortable: true,
            // rowGroup: true,
            filter: true,
            hide: true,
            resizable: true,
            width: 100,
            cellRenderer: (param: ValueFormatterParams) => (
                <Flex className="h-full">{severityBadge(param.value)}</Flex>
            ),
        },
        {
            field: 'noOfOccurrences',
            headerName: '# of issues',
            type: 'number',
            hide: false,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            width: 115,
        },
        {
            field: 'evaluatedAt',
            headerName: 'Last checked',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            hide: true,
        },
    ]
    return temp
}

const severity = [
    { name: 'Critical', color: '#6E120B' },
    { name: 'High', color: '#CA2B1D' },
    { name: 'Medium', color: '#EE9235' },
    { name: 'Low', color: '#F4C744' },
    { name: 'None', color: '#9BA2AE' },
]
const status = [
    { name: 'Passed', color: 'emerald', icon: CheckCircleIcon },
    { name: 'Failed', color: 'rose', icon: XCircleIcon },
]

const filteredConnectionsList = (
    connection:
        | GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
        | undefined,
    filter: string
) => {
    const result = connection?.filter(
        (c) =>
            c?.providerConnectionName
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
            c?.providerConnectionID
                ?.toLowerCase()
                .includes(filter.toLowerCase())
    )
    const count = result?.length || 0
    return {
        result,
        count,
    }
}
let sortKey = ''

export default function Findings() {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)
    const [connectionSearch, setConnectionSearch] = useState('')
    const [resourceSearch, setResourceSearch] = useState('')

    const [provider, setProvider] = useState('')
    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const connectionCheckbox = useCheckboxState({ state: [] })
    const [connectionFilter, setConnectionFilter] = useState([])
    const benchmarkCheckbox = useCheckboxState({ state: [] })
    const [benchmarkFilter, setBenchmarkFilter] = useState([])
    const resourceCheckbox = useCheckboxState({ state: [] })
    const [resourceFilter, setResourceFilter] = useState([])
    const severityCheckbox = useCheckboxState({
        state: ['critical', 'high', 'medium', 'low', 'none'],
    })
    const statusCheckbox = useCheckboxState({
        state: ['failed'],
    })
    const [severityFilter, setSeverityFilter] = useState([
        'critical',
        'high',
        'medium',
        'low',
        'none',
    ])
    const applyFilters = () => {
        sortKey = ''
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setProviderFilter(provider.length ? [provider] : [])
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setConnectionFilter(connectionCheckbox.state)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setBenchmarkFilter(benchmarkCheckbox.state)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setResourceFilter(resourceCheckbox.state)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setSeverityFilter(severityCheckbox.state)
    }
    const showApply = () => {
        return (
            !compareArrays(
                providerFilter,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                provider.length ? [provider] : []
            ) ||
            !compareArrays(
                connectionFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                connectionCheckbox.state.sort()
            ) ||
            !compareArrays(
                benchmarkFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                benchmarkCheckbox.state.sort()
            ) ||
            !compareArrays(
                resourceFilter.sort(),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                resourceCheckbox.state.sort()
            ) ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !compareArrays(severityFilter.sort(), severityCheckbox.state.sort())
        )
    }

    const resetFilters = () => {
        sortKey = ''
        setProviderFilter([])
        setProvider('')
        setConnectionFilter([])
        connectionCheckbox.setState([])
        setBenchmarkFilter([])
        benchmarkCheckbox.setState([])
        setResourceFilter([])
        resourceCheckbox.setState([])
        setSeverityFilter(['critical', 'high', 'medium', 'low', 'none'])
        severityCheckbox.setState(['critical', 'high', 'medium', 'low', 'none'])
    }
    const showReset = () => {
        return (
            providerFilter.length ||
            connectionFilter.length ||
            benchmarkFilter.length ||
            resourceFilter.length ||
            !compareArrays(
                severityFilter.sort(),
                ['critical', 'high', 'medium', 'low', 'none'].sort()
            )
        )
    }

    const isDemo = useAtomValue(isDemoAtom)

    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: providerFilter,
            pageNumber: 1,
            pageSize: 2000,
            needCost: false,
            needResourceCount: false,
        })
    const { response: benchmarks, isLoading: benchmarksLoading } =
        useComplianceApiV1BenchmarksSummaryList({
            connector: providerFilter,
            connectionId: connectionFilter,
        })
    const { response: filters, isLoading: filtersLoading } =
        useComplianceApiV1FindingsFiltersCreate({})

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                if (params.request.sortModel.length) {
                    sortKey = ''
                }
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1FindingsCreate({
                        filters: {
                            connector: providerFilter,
                            connectionID: connectionFilter,
                            benchmarkID: benchmarkFilter,
                            resourceTypeID: resourceFilter,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            severity: severityFilter,
                            // conformanceStatus
                        },
                        // sort: params.request.sortModel.length
                        //     ? {
                        //           [params.request.sortModel[0].colId]:
                        //               params.request.sortModel[0].sort,
                        //       }
                        //     : {},
                        limit: 100,
                        afterSortKey:
                            params.request.startRow === 0 ||
                            sortKey.length < 1 ||
                            sortKey === 'none'
                                ? []
                                : [sortKey],
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.findings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        // eslint-disable-next-line prefer-destructuring
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.findings[resp.data.findings?.length - 1]
                                .sortKey[0]
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(
        () => ssr(),
        [
            providerFilter,
            connectionFilter,
            benchmarkFilter,
            resourceFilter,
            severityFilter,
        ]
    )

    return (
        <Layout currentPage="findings">
            <Header />
            <Flex alignItems="start">
                <Card className="sticky top-6 min-w-[300px] max-w-[300px]">
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Cloud provider
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('')}
                                    checked={provider === ''}
                                >
                                    All
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('AWS')}
                                    checked={provider === 'AWS'}
                                >
                                    <Flex className="gap-1">
                                        <img
                                            src={AWSIcon}
                                            className="w-6"
                                            alt="aws"
                                        />
                                        <Text>AWS</Text>
                                    </Flex>
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('Azure')}
                                    checked={provider === 'Azure'}
                                >
                                    <Flex className="gap-1">
                                        <img
                                            src={AzureIcon}
                                            className="w-6"
                                            alt="azure"
                                        />
                                        <Text>Azure</Text>
                                    </Flex>
                                </Radio>
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Conformance status
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                {status.map((s) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        shape="curve"
                                        className="!items-start"
                                        value={s.name.toLowerCase()}
                                        {...statusCheckbox}
                                    >
                                        <Flex className="gap-1">
                                            <Icon
                                                icon={s.icon}
                                                size="sm"
                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                // @ts-ignore
                                                color={s.color}
                                                className="h-3 p-0 -ml-0.5"
                                            />
                                            <Text>{s.name}</Text>
                                        </Flex>
                                    </Checkbox>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion
                        defaultOpen
                        className="border-0 rounded-none bg-transparent mb-1"
                    >
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Severity
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                {severity.map((s) => (
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    <Checkbox
                                        shape="curve"
                                        className="!items-start"
                                        value={s.name.toLowerCase()}
                                        {...severityCheckbox}
                                    >
                                        <Flex className="gap-1.5">
                                            <div
                                                className="h-4 w-1.5 rounded-sm"
                                                style={{
                                                    backgroundColor: s.color,
                                                }}
                                            />
                                            <Text>{s.name}</Text>
                                        </Flex>
                                    </Checkbox>
                                ))}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Cloud accounts
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search cloud accounts..."
                                value={connectionSearch}
                                onChange={(e) =>
                                    setConnectionSearch(e.target.value)
                                }
                                className="mb-4"
                            />
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="px-0.5 gap-2.5 max-h-[200px] overflow-y-scroll overflow-x-hidden"
                            >
                                {connectionsLoading ? (
                                    <Spinner />
                                ) : (
                                    <>
                                        {filteredConnectionsList(
                                            connections?.connections,
                                            connectionSearch
                                        ).result?.map(
                                            (con, i) =>
                                                i < 100 && (
                                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                    // @ts-ignore
                                                    <Checkbox
                                                        shape="curve"
                                                        className="!items-start"
                                                        value={con.id}
                                                        {...connectionCheckbox}
                                                    >
                                                        <Flex
                                                            flexDirection="col"
                                                            alignItems="start"
                                                            className="-mt-0.5"
                                                        >
                                                            <Text className="text-gray-800 truncate">
                                                                {
                                                                    con.providerConnectionName
                                                                }
                                                            </Text>
                                                            <Text className="text-xs truncate">
                                                                {
                                                                    con.providerConnectionID
                                                                }
                                                            </Text>
                                                        </Flex>
                                                    </Checkbox>
                                                )
                                        )}
                                        <Flex justifyContent="end">
                                            <Text>
                                                {filteredConnectionsList(
                                                    connections?.connections,
                                                    connectionSearch
                                                ).count > 100
                                                    ? `+ ${
                                                          filteredConnectionsList(
                                                              connections?.connections,
                                                              connectionSearch
                                                          ).count - 100
                                                      } more`
                                                    : ''}
                                            </Text>
                                        </Flex>
                                    </>
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800 font-semibold">
                                Benchmarks
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            {benchmarksLoading ? (
                                <Spinner />
                            ) : (
                                <Flex
                                    flexDirection="col"
                                    alignItems="start"
                                    className="px-0.5 gap-2.5"
                                >
                                    {benchmarkList(
                                        benchmarks?.benchmarkSummary
                                    ).connected?.map((ben) => (
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        <Checkbox
                                            shape="curve"
                                            className="!items-start"
                                            value={ben.id}
                                            {...benchmarkCheckbox}
                                        >
                                            {ben.title}
                                        </Checkbox>
                                    ))}
                                </Flex>
                            )}
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800 font-semibold">
                                Resource types
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="pt-3 pb-1 px-0.5 w-full cursor-default bg-transparent">
                            <TextInput
                                icon={MagnifyingGlassIcon}
                                placeholder="Search resource types..."
                                value={resourceSearch}
                                onChange={(e) =>
                                    setResourceSearch(e.target.value)
                                }
                                className="mb-4"
                            />
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="px-0.5 gap-2.5 max-h-[200px] overflow-y-scroll overflow-x-hidden"
                            >
                                {filtersLoading ? (
                                    <Spinner />
                                ) : (
                                    filters?.resourceTypeID
                                        ?.filter(
                                            (p) =>
                                                p.displayName
                                                    ?.toLowerCase()
                                                    .includes(
                                                        resourceSearch.toLowerCase()
                                                    ) ||
                                                p.key
                                                    ?.toLowerCase()
                                                    .includes(
                                                        resourceSearch.toLowerCase()
                                                    )
                                        )
                                        .map((p, i) => (
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            <Checkbox
                                                shape="curve"
                                                className="!items-start"
                                                value={p.key}
                                                {...resourceCheckbox}
                                            >
                                                <Flex
                                                    flexDirection="col"
                                                    alignItems="start"
                                                    className="-mt-0.5"
                                                >
                                                    <Text className="text-gray-800 truncate">
                                                        {p.displayName}
                                                    </Text>
                                                    <Text className="text-xs truncate">
                                                        {p.key}
                                                    </Text>
                                                </Flex>
                                            </Checkbox>
                                        ))
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Flex flexDirection="row-reverse">
                        {showApply() && (
                            <Button onClick={applyFilters} className="mt-4">
                                Apply
                            </Button>
                        )}
                        {showReset() && (
                            <Button
                                variant="light"
                                onClick={resetFilters}
                                className="mt-4"
                            >
                                Reset filters
                            </Button>
                        )}
                    </Flex>
                </Card>
                <Flex className="pl-4">
                    <Table
                        fullWidth
                        id="compliance_findings"
                        columns={columns(isDemo)}
                        onCellClicked={(event: RowClickedEvent) => {
                            if (
                                event.data.kaytuResourceID &&
                                event.data.kaytuResourceID.length > 0
                            ) {
                                setFinding(event.data)
                                setOpen(true)
                            } else {
                                setNotification({
                                    text: 'Detail for this finding is currently not available',
                                    type: 'warning',
                                })
                            }
                        }}
                        serverSideDatasource={serverSideRows}
                        options={{
                            rowModelType: 'serverSide',
                            serverSideDatasource: serverSideRows,
                        }}
                    />
                    <FindingDetail
                        finding={finding}
                        open={open}
                        onClose={() => setOpen(false)}
                    />
                </Flex>
            </Flex>
        </Layout>
    )
}
