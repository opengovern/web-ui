import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    Button,
    Card,
    Flex,
    Text,
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
import Layout from '../../../components/Layout'
import Header from '../../../components/Header'
import { isDemoAtom } from '../../../store'
import Table, { IColumn } from '../../../components/Table'
import { dateTimeDisplay } from '../../../utilities/dateDisplay'
import { useComplianceApiV1FindingsCreate } from '../../../api/compliance.gen'
import DrawerPanel from '../../../components/DrawerPanel'
import { RenderObject } from '../../../components/RenderObject'

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
    const isDemo = useAtomValue(isDemoAtom)

    const {
        response: findings,
        isLoading,
        sendNow,
    } = useComplianceApiV1FindingsCreate({
        filters: {
            // benchmarkID: [String(id)],
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: provider.length ? [provider] : [],
            // connectionID: connections.connections,
            // activeOnly: true,
        },
        sort: sortModel.length
            ? { [sortModel[0].colId]: sortModel[0].sort }
            : {},
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
                            <Text className="text-gray-800">Provider</Text>
                        </AccordionHeader>
                        <AccordionBody className="p-0 w-full pr-0.5 cursor-default bg-transparent">
                            <Button
                                variant="light"
                                onClick={() => setProvider('')}
                                className={`flex justify-start min-w-full truncate p-2 rounded-md ${
                                    provider === '' ? 'bg-kaytu-100' : ''
                                }`}
                            >
                                <Text className="truncate hover:text-kaytu-600">
                                    All
                                </Text>
                            </Button>
                            <Button
                                variant="light"
                                onClick={() => setProvider('AWS')}
                                className={`flex justify-start min-w-full truncate p-2 rounded-md ${
                                    provider === 'AWS' ? 'bg-kaytu-100' : ''
                                }`}
                            >
                                <Text className="truncate hover:text-kaytu-600">
                                    AWS
                                </Text>
                            </Button>
                            <Button
                                variant="light"
                                onClick={() => setProvider('Azure')}
                                className={`flex justify-start min-w-full truncate p-2 rounded-md ${
                                    provider === 'Azure' ? 'bg-kaytu-100' : ''
                                }`}
                            >
                                <Text className="truncate hover:text-kaytu-600">
                                    Azure
                                </Text>
                            </Button>
                        </AccordionBody>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Cloud accounts
                            </Text>
                        </AccordionHeader>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">Benchmarks</Text>
                        </AccordionHeader>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Cloud services
                            </Text>
                        </AccordionHeader>
                    </Accordion>
                    <Accordion className="w-56 border-0 rounded-none bg-transparent mb-1">
                        <AccordionHeader className="pl-0 pr-0.5 py-1 w-full bg-transparent">
                            <Text className="text-gray-800">
                                Resource types
                            </Text>
                        </AccordionHeader>
                    </Accordion>
                </Card>
                <Flex className="w-full pl-6 -mt-[50px]">
                    <Table
                        title=" "
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
                    />
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
