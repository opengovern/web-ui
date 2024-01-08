import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { Flex, Text } from '@tremor/react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import { isDemoAtom, notificationAtom } from '../../../../store'
import FindingFilters from '../FindingsWithFailure/Filters'
import Table, { IColumn } from '../../../../components/Table'
import FindingDetail from '../FindingsWithFailure/Detail'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'

const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
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
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.kaytuResourceID}</Text>
                </Flex>
            ),
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
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.resourceTypeLabel}</Text>
                </Flex>
            ),
        },
        {
            field: 'resourceLocation',
            headerName: 'Resource location',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
        {
            field: 'providerConnectionName',
            headerName: 'Account info',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    className={isDemo ? 'blur-md' : ''}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.providerConnectionID}</Text>
                </Flex>
            ),
        },
        {
            field: 'totalCount',
            headerName: 'Findings',
            type: 'number',
            hide: false,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            width: 140,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex flexDirection="col" alignItems="start">
                    <Text className="text-gray-800">{`${param.value} issues`}</Text>
                    <Text>{`${
                        param.value - param.data.failedCount
                    } passed`}</Text>
                </Flex>
            ),
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

interface ICount {
    count: (x: number | undefined) => void
}

export default function ResourcesWithFailure({ count }: ICount) {
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
                    .apiV1ResourceFindingsCreate({
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
                            rowData: resp.data.resourceFindings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        count(resp.data.totalCount || 0)
                        // eslint-disable-next-line prefer-destructuring
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.resourceFindings[
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                resp.data.resourceFindings?.length - 1
                            ].sortKey[0]
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
                type="resources"
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
                    setBenchmarkFilter(obj.benchmark)
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
