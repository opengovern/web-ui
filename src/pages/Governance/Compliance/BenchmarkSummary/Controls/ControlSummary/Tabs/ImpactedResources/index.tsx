import { IServerSideGetRowsParams } from 'ag-grid-community/dist/lib/interfaces/iServerSideDatasource'
import { useMemo, useState } from 'react'
import { useAtomValue, useSetAtom } from 'jotai/index'
import { RowClickedEvent, ValueFormatterParams } from 'ag-grid-community'
import { Flex, Text } from '@tremor/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import Table, { IColumn } from '../../../../../../../../components/Table'
import FindingDetail from '../../../../../../Findings/Detail'
import { isDemoAtom, notificationAtom } from '../../../../../../../../store'
import {
    Api,
    GithubComKaytuIoKaytuEnginePkgComplianceApiFinding,
} from '../../../../../../../../api/api'
import AxiosAPI from '../../../../../../../../api/ApiConfig'
import { statusBadge } from '../../../index'
import { dateTimeDisplay } from '../../../../../../../../utilities/dateDisplay'

let sortKey = ''

interface IImpactedResources {
    controlId: string | undefined
}

const columns = (isDemo: boolean) => {
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
            hide: true,
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
            hide: true,
            filter: true,
            resizable: true,
            flex: 1,
        },
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
            field: 'conformanceStatus',
            headerName: 'Conformance status',
            type: 'string',
            sortable: true,
            filter: true,
            hide: false,
            resizable: true,
            width: 180,
            cellRenderer: (param: ValueFormatterParams) => (
                <Flex className="h-full">{statusBadge(param.value)}</Flex>
            ),
        },
        {
            field: 'noOfOccurrences',
            headerName: '# of issues',
            type: 'number',
            hide: true,
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
            width: 260,
            valueFormatter: (param: ValueFormatterParams) => {
                return param.value ? dateTimeDisplay(param.value) : ''
            },
            hide: false,
        },
    ]
    return temp
}

export default function ImpactedResources({ controlId }: IImpactedResources) {
    const isDemo = useAtomValue(isDemoAtom)
    const setNotification = useSetAtom(notificationAtom)

    const [open, setOpen] = useState(false)
    const [finding, setFinding] = useState<
        GithubComKaytuIoKaytuEnginePkgComplianceApiFinding | undefined
    >(undefined)
    const [error, setError] = useState('')

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
                            controlID: [controlId || ''],
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
                        if (
                            err.message !==
                            "Cannot read properties of null (reading 'NaN')"
                        ) {
                            setError(err.message)
                        }
                        params.fail()
                    })
            },
        }
    }

    const serverSideRows = useMemo(() => ssr(), [])

    return (
        <>
            {error.length > 0 && (
                <Flex className="w-fit mb-3 gap-1">
                    <ExclamationCircleIcon className="text-rose-600 h-5" />
                    <Text color="rose">{error}</Text>
                </Flex>
            )}
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
        </>
    )
}
