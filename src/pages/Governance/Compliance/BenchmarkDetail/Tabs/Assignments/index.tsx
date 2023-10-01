import { useEffect, useState } from 'react'
import { CellClickedEvent, ICellRendererParams } from 'ag-grid-community'
import { Button, Flex } from '@tremor/react'
import {
    useComplianceApiV1AssignmentsBenchmarkDetail,
    useComplianceApiV1AssignmentsConnectionCreate,
    useComplianceApiV1AssignmentsConnectionDelete,
} from '../../../../../../api/compliance.gen'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource } from '../../../../../../api/api'
import Table, { IColumn } from '../../../../../../components/Table'

interface IAssignments {
    id: string | undefined
}

const columns: IColumn<any, any>[] = [
    {
        width: 120,
        sortable: true,
        filter: true,
        enableRowGroup: true,
        type: 'string',
        field: 'connector',
    },
    {
        field: 'providerConnectionName',
        headerName: 'Connection Name',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'connectionID',
        headerName: 'Connection ID',
        type: 'string',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        headerName: 'Enable',
        sortable: true,
        type: 'string',
        filter: true,
        resizable: true,
        flex: 0.5,
        cellRenderer: (
            params: ICellRendererParams<GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource>
        ) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="h-full w-full"
                >
                    <label
                        htmlFor="status"
                        className="relative inline-flex items-center cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            value=""
                            className="sr-only peer"
                            checked={params.data?.status}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-kaytu-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                    </label>
                </Flex>
            )
        },
    },
]

export default function Assignments({ id }: IAssignments) {
    const [connection, setConnection] = useState<any>(null)
    const [status, setStatus] = useState<any>(null)
    const [flag, setFlag] = useState(false)

    const {
        response: assignments,
        isLoading,
        sendNow: getData,
    } = useComplianceApiV1AssignmentsBenchmarkDetail(String(id))
    const {
        response: enable,
        sendNow: sendEnable,
        isLoading: enableLoading,
        isExecuted: enableExecuted,
    } = useComplianceApiV1AssignmentsConnectionCreate(
        String(id),
        connection,
        {},
        false
    )
    const {
        response: disable,
        sendNow: sendDisable,
        isLoading: disableLoading,
        isExecuted: disableExecuted,
    } = useComplianceApiV1AssignmentsConnectionDelete(
        String(id),
        connection,
        {},
        false
    )

    const callApi = (s: string | null, callback: any) => {
        if (s === 'enable') {
            sendDisable()
        }
        if (s === 'disable') {
            sendEnable()
        }
        callback()
    }

    useEffect(() => {
        if (connection && status === 'enable') {
            callApi('enable', getData)
        }
        if (connection && status === 'disable') {
            callApi('disable', getData)
        }
    }, [connection, status])

    useEffect(() => {
        if (enableExecuted && enableLoading) {
            setConnection(null)
            setStatus(null)
            // getData()
        }
        if (disableExecuted && disableLoading) {
            setConnection(null)
            setStatus(null)
            // getData()
        }
    }, [enableExecuted, disableExecuted, enableLoading, disableLoading])

    return (
        <Table
            title="Assignmnets"
            id="compliance_assignments"
            columns={columns}
            onCellClicked={(
                event: CellClickedEvent<GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource>
            ) => {
                if (event.colDef.headerName === 'Enable') {
                    setConnection(event.data?.connectionID)
                    if (event.data?.status) {
                        setStatus('enable')
                    } else {
                        setStatus('disable')
                    }
                }
            }}
            onGridReady={(params) => {
                if (isLoading) {
                    params.api.showLoadingOverlay()
                }
            }}
            rowData={
                assignments?.sort(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    (a, b) => b.status - a.status
                ) || []
            }
        >
            <Flex justifyContent="end" className="gap-x-2">
                <Button
                    variant="secondary"
                    onClick={() => {
                        setConnection('all')
                        setStatus('enable')
                    }}
                >
                    Disable All
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setConnection('all')
                        setStatus('disable')
                    }}
                >
                    Enable All
                </Button>
            </Flex>
        </Table>
    )
}
