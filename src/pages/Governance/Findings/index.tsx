import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Card,
    Divider,
    Flex,
    Text,
    TextInput,
    Title,
} from '@tremor/react'
import { useState } from 'react'
import {
    IServerSideDatasource,
    RowClickedEvent,
    SortModelItem,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Checkbox, Radio, useCheckboxState } from 'pretty-checkbox-react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import { isDemoAtom } from '../../../store'
import Table, { IColumn } from '../../../components/Table'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import {
    useComplianceApiV1BenchmarksSummaryList,
    useComplianceApiV1FindingsCreate,
} from '../../../api/compliance.gen'
import DrawerPanel from '../../../components/DrawerPanel'
import { RenderObject } from '../../../components/RenderObject'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../api/onboard.gen'
import Spinner from '../../../components/Spinner'
import { benchmarkList } from '../Compliance'
import Tag from '../../../components/Tag'

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            width: 120,
            field: 'connector',
            headerName: 'Connector',
            sortable: true,
            filter: true,
            enableRowGroup: true,
            type: 'string',
        },
        {
            field: 'policyID',
            headerName: 'Policy ID',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            hide: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'policyTitle',
            headerName: 'Policy Title',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'providerConnectionID',
            headerName: 'Account ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'providerConnectionName',
            headerName: 'Account Name',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ValueFormatterParams) => (
                <span className={isDemo ? 'blur-md' : ''}>{param.value}</span>
            ),
        },
        {
            field: 'connectionID',
            headerName: 'Kaytu Connection ID',
            type: 'string',
            hide: true,
            enableRowGroup: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'resourceID',
            headerName: 'Resource ID',
            type: 'string',
            enableRowGroup: true,
            sortable: true,
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
            flex: 0.5,
        },
        {
            field: 'reason',
            headerName: 'Reason',
            type: 'string',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'evaluatedAt',
            headerName: 'Last checked',
            type: 'date',
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
        },
    ]
    return temp
}

export default function Findings() {
    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<any>(undefined)
    const [sortModel, setSortModel] = useState<SortModelItem[]>([])
    const [provider, setProvider] = useState('')
    const [connectionSearch, setConnectionSearch] = useState('')

    const connectionCheckbox = useCheckboxState({ state: [] })
    const benchmarkCheckbox = useCheckboxState({ state: [] })

    const isDemo = useAtomValue(isDemoAtom)

    const {
        response: findings,
        isLoading,
        sendNow,
    } = useComplianceApiV1FindingsCreate({
        filters: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: connectionCheckbox.state,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            benchmarkID: benchmarkCheckbox.state,
            activeOnly: true,
        },
        sort: sortModel.length
            ? { [sortModel[0].colId]: sortModel[0].sort }
            : {},
    })
    const { response: connections, isLoading: connectionsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            pageNumber: 1,
            pageSize: 10000,
            needCost: false,
            needResourceCount: false,
        })
    const { response: benchmarks, isLoading: benchmarksLoading } =
        useComplianceApiV1BenchmarksSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connectionID: connectionCheckbox.state,
        })

    const getData = (sort: SortModelItem[]) => {
        setSortModel(sort)
        sendNow()
    }

    const datasource: IServerSideDatasource = {
        getRows: (params: IServerSideGetRowsParams) => {
            if (params.request.sortModel.length > 0) {
                if (sortModel.length > 0) {
                    if (
                        params.request.sortModel[0].colId !==
                            sortModel[0].colId ||
                        params.request.sortModel[0].sort !== sortModel[0].sort
                    ) {
                        getData([params.request.sortModel[0]])
                    }
                } else {
                    getData([params.request.sortModel[0]])
                }
            } else if (sortModel.length > 0) {
                getData([])
            }
            if (findings) {
                params.success({
                    rowData: findings?.findings || [],
                    rowCount: findings?.totalCount || 0,
                })
            } else {
                params.fail()
            }
        },
    }

    return (
        <Layout currentPage="findings">
            <Header />
            <Flex alignItems="start">
                <Card className="sticky w-fit">
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Provider
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="py-1 px-0.5 w-full cursor-default bg-transparent">
                            <Flex
                                flexDirection="col"
                                alignItems="start"
                                className="gap-1.5"
                            >
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('')}
                                    defaultChecked={provider === ''}
                                >
                                    All
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('AWS')}
                                    defaultChecked={provider === 'AWS'}
                                >
                                    AWS
                                </Radio>
                                <Radio
                                    name="provider"
                                    onClick={() => setProvider('Azure')}
                                    defaultChecked={provider === 'Azure'}
                                >
                                    Azure
                                </Radio>
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="font-semibold text-gray-800">
                                Cloud accounts
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="py-1 px-0.5 w-full cursor-default bg-transparent">
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
                                className="px-0.5 gap-2.5 overflow-y-scroll overflow-x-hidden"
                            >
                                {connectionsLoading ? (
                                    <Spinner />
                                ) : (
                                    connections?.connections
                                        ?.filter(
                                            (c) =>
                                                c?.providerConnectionName
                                                    ?.toLowerCase()
                                                    .includes(
                                                        connectionSearch.toLowerCase()
                                                    ) ||
                                                c?.providerConnectionID
                                                    ?.toLowerCase()
                                                    .includes(
                                                        connectionSearch.toLowerCase()
                                                    )
                                        )
                                        .map(
                                            (con, i) =>
                                                i < 5 && (
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
                                        )
                                )}
                            </Flex>
                        </AccordionBody>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800 font-semibold">
                                Benchmarks
                            </Text>
                        </AccordionHeader>
                        <AccordionBody className="py-1 px-0.5 w-full cursor-default bg-transparent">
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
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Cloud services
                            </Text>
                        </AccordionHeader>
                    </Accordion>
                    <Divider className="my-3" />
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Resource types
                            </Text>
                        </AccordionHeader>
                    </Accordion>
                </Card>
                <Flex className="w-full pl-6">
                    <Table
                        fullWidth
                        downloadable
                        id="compliance_findings"
                        columns={columns(isDemo)}
                        onCellClicked={(event: RowClickedEvent) => {
                            setFinding(event.data)
                            setOpen(true)
                        }}
                        onGridReady={(e) => {
                            if (isLoading) {
                                e.api.showLoadingOverlay()
                            }
                        }}
                        serverSideDatasource={datasource}
                        loading={isLoading}
                    >
                        <Flex
                            className="flex-wrap gap-3"
                            alignItems="start"
                            justifyContent="start"
                        >
                            {provider.length > 0 && (
                                <Tag
                                    text={provider}
                                    onClick={() => setProvider('')}
                                />
                            )}
                        </Flex>
                    </Table>
                    <DrawerPanel
                        open={open}
                        onClose={() => setOpen(false)}
                        title="Finding Detail"
                    >
                        <Title>Summary</Title>
                        <RenderObject obj={finding} />
                    </DrawerPanel>
                </Flex>
            </Flex>
        </Layout>
    )
}
