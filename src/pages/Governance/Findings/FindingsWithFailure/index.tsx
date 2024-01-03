import { Flex } from '@tremor/react'
import { useMemo, useState } from 'react'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import { useAtomValue, useSetAtom } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import Layout from '../../../../components/Layout'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import FindingDetail from './Detail'
import { severityBadge } from '../../Compliance/BenchmarkSummary/Controls'
import FindingFilters from './Filters'

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

let sortKey = ''

export default function FindingsWithFailure() {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const isDemo = useAtomValue(isDemoAtom)

    const [providerFilter, setProviderFilter] = useState<SourceType[]>([])
    const [connectionFilter, setConnectionFilter] = useState<string[]>([])
    const [benchmarkFilter, setBenchmarkFilter] = useState<string[]>([])
    const [resourceFilter, setResourceFilter] = useState<string[]>([])
    const [severityFilter, setSeverityFilter] = useState([
        'critical',
        'high',
        'medium',
        'low',
        'none',
    ])
    const [statusFilter, setStatusFilter] = useState([
        'alarm',
        'info',
        'skip',
        'error',
    ])

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
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            conformanceStatus: statusFilter,
                        },

                        sort: params.request.sortModel.length
                            ? [
                                  {
                                      [params.request.sortModel[0].colId]:
                                          params.request.sortModel[0].sort,
                                  },
                              ]
                            : [],
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
            statusFilter,
            connectionFilter,
            benchmarkFilter,
            resourceFilter,
            severityFilter,
        ]
    )

    return (
        <Flex alignItems="start">
            <FindingFilters
                providerFilter={providerFilter}
                statusFilter={statusFilter}
                connectionFilter={connectionFilter}
                benchmarkFilter={benchmarkFilter}
                resourceFilter={resourceFilter}
                severityFilter={severityFilter}
                onApply={(obj) => {
                    setProviderFilter(obj.provider)
                    setStatusFilter(obj.status)
                    setConnectionFilter(obj.connection)
                    setBenchmarkFilter(obj.connection)
                    setResourceFilter(obj.resource)
                    setSeverityFilter(obj.severity)
                }}
            />
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
    )
}
