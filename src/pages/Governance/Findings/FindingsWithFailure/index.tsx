import { Card, Flex, Text } from '@tremor/react'
import { useMemo, useState } from 'react'
import {
    ICellRendererParams,
    RowClickedEvent,
    ValueFormatterParams,
} from 'ag-grid-community'
import { useAtomValue, useSetAtom } from 'jotai'
import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { isDemoAtom, notificationAtom } from '../../../../store'
import Table, { IColumn } from '../../../../components/Table'
import { dateTimeDisplay } from '../../../../utilities/dateDisplay'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
    SourceType,
    TypesFindingSeverity,
} from '../../../../api/api'
import AxiosAPI from '../../../../api/ApiConfig'
import FindingDetail from './Detail'
import { severityBadge, statusBadge } from '../../Controls'
import { getConnectorIcon } from '../../../../components/Cards/ConnectorCard'
import { DateRange } from '../../../../utilities/urlstate'

export const columns = (isDemo: boolean) => {
    const temp: IColumn<any, any>[] = [
        {
            field: 'providerConnectionName',
            headerName: 'Cloud Account',
            sortable: false,
            filter: true,
            hide: true,
            enableRowGroup: true,
            type: 'string',
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    justifyContent="start"
                    className={`h-full gap-3 group relative ${
                        isDemo ? 'blur-sm' : ''
                    }`}
                >
                    {getConnectorIcon(param.data.connector)}
                    <Flex flexDirection="col" alignItems="start">
                        <Text className="text-gray-800">{param.value}</Text>
                        <Text>{param.data.providerConnectionID}</Text>
                    </Flex>
                    <Card className="cursor-pointer absolute w-fit h-fit z-40 right-1 scale-0 transition-all py-1 px-4 group-hover:scale-100">
                        <Text color="blue">Open</Text>
                    </Card>
                </Flex>
            ),
        },
        {
            field: 'resourceName',
            headerName: 'Resource Name',
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
                    justifyContent="center"
                    className={isDemo ? 'h-full' : 'h-full'}
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text>{param.data.resourceTypeName}</Text>
                </Flex>
            ),
        },
        {
            field: 'resourceType',
            headerName: 'Resource Info',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">{param.value}</Text>
                    <Text className={isDemo ? 'blur-sm' : ''}>
                        {param.data.resourceID}
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'benchmarkID',
            headerName: 'Benchmark',
            type: 'string',
            enableRowGroup: false,
            sortable: false,
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">
                        {param.data.parentBenchmarkNames[0]}
                    </Text>
                    <Text>
                        {
                            param.data.parentBenchmarkNames[
                                param.data.parentBenchmarkNames.length - 1
                            ]
                        }
                    </Text>
                </Flex>
            ),
        },
        {
            field: 'controlID',
            headerName: 'Control',
            type: 'string',
            enableRowGroup: true,
            sortable: false,
            hide: false,
            filter: true,
            resizable: true,
            width: 200,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    <Text className="text-gray-800">
                        {param.data.parentBenchmarkNames[0]}
                    </Text>
                    <Text>{param.data.controlTitle}</Text>
                </Flex>
            ),
        },
        {
            field: 'conformanceStatus',
            headerName: 'Status',
            type: 'string',
            hide: false,
            enableRowGroup: true,
            sortable: false,
            filter: true,
            resizable: true,
            width: 100,
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {statusBadge(param.value)}
                </Flex>
            ),
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
            field: 'evaluatedAt',
            headerName: 'Last Evaluation',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {dateTimeDisplay(param.value)}
                </Flex>
            ),
            hide: true,
        },
        {
            field: 'lastEvent',
            headerName: 'Last Event',
            type: 'datetime',
            sortable: false,
            filter: true,
            resizable: true,
            flex: 1,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            cellRenderer: (param: ICellRendererParams) => (
                <Flex
                    flexDirection="col"
                    alignItems="start"
                    justifyContent="center"
                    className="h-full"
                >
                    {dateTimeDisplay(param.value)}
                </Flex>
            ),
            hide: true,
        },
    ]
    return temp
}

let sortKey = ''

interface ICount {
    query: {
        connector: SourceType
        conformanceStatus:
            | GithubComKaytuIoKaytuEnginePkgComplianceApiConformanceStatus[]
            | undefined
        severity: TypesFindingSeverity[] | undefined
        connectionID: string[] | undefined
        controlID: string[] | undefined
        benchmarkID: string[] | undefined
        resourceTypeID: string[] | undefined
        lifecycle: boolean[] | undefined
        activeTimeRange: DateRange | undefined
        eventTimeRange: DateRange | undefined
    }
}

export default function FindingsWithFailure({ query }: ICount) {
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)

    const isDemo = useAtomValue(isDemoAtom)

    const ssr = () => {
        return {
            getRows: (params: IServerSideGetRowsParams) => {
                const api = new Api()
                api.instance = AxiosAPI
                api.compliance
                    .apiV1FindingsCreate({
                        filters: {
                            connector: query.connector.length
                                ? [query.connector]
                                : [],
                            controlID: query.controlID,
                            connectionID: query.connectionID,
                            benchmarkID: query.benchmarkID,
                            severity: query.severity,
                            resourceTypeID: query.resourceTypeID,
                            conformanceStatus: query.conformanceStatus,
                            stateActive: query.lifecycle,
                            ...(query.eventTimeRange && {
                                lastEvent: {
                                    from: query.eventTimeRange.start.unix(),
                                    to: query.eventTimeRange.end.unix(),
                                },
                            }),
                            ...(query.activeTimeRange && {
                                evaluatedAt: {
                                    from: query.activeTimeRange.start.unix(),
                                    to: query.activeTimeRange.end.unix(),
                                },
                            }),
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
                        // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        afterSortKey:
                            params.request.startRow === 0 ||
                            sortKey.length < 1 ||
                            sortKey === 'none'
                                ? []
                                : sortKey,
                    })
                    .then((resp) => {
                        params.success({
                            rowData: resp.data.findings || [],
                            rowCount: resp.data.totalCount || 0,
                        })
                        console.log(resp.data)
                        // eslint-disable-next-line prefer-destructuring,@typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        sortKey =
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            // eslint-disable-next-line no-unsafe-optional-chaining
                            resp.data.findings[
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line no-unsafe-optional-chaining
                                resp.data.findings?.length - 1
                            ].sortKey
                    })
                    .catch((err) => {
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(() => ssr(), [query])

    return (
        <>
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
                onSortChange={() => {
                    sortKey = ''
                }}
                serverSideDatasource={serverSideRows}
                options={{
                    rowModelType: 'serverSide',
                    serverSideDatasource: serverSideRows,
                }}
                rowHeight="lg"
            />
            <FindingDetail
                type="finding"
                finding={finding}
                open={open}
                onClose={() => setOpen(false)}
                onRefresh={() => window.location.reload()}
            />
        </>
    )
}
