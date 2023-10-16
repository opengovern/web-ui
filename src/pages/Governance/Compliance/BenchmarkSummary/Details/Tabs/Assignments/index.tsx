import { useEffect, useState } from 'react'
import { Button, Flex } from '@tremor/react'
import {
    useComplianceApiV1AssignmentsBenchmarkDetail,
    useComplianceApiV1AssignmentsConnectionCreate,
    useComplianceApiV1AssignmentsConnectionDelete,
} from '../../../../../../../api/compliance.gen'
import Table, { IColumn } from '../../../../../../../components/Table'

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
        cellRenderer: (params: any) => {
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

interface ITransferState {
    connectionID: string
    status: boolean
}

export default function Assignments({ id }: IAssignments) {
    const [firstLoading, setFirstLoading] = useState<boolean>(true)
    const [transfer, setTransfer] = useState<ITransferState>({
        connectionID: '',
        status: false,
    })

    const {
        sendNow: sendEnable,
        isLoading: enableLoading,
        isExecuted: enableExecuted,
    } = useComplianceApiV1AssignmentsConnectionCreate(
        String(id),
        { connectionId: [transfer.connectionID] },
        {},
        false
    )
    const {
        sendNow: sendDisable,
        isLoading: disableLoading,
        isExecuted: disableExecuted,
    } = useComplianceApiV1AssignmentsConnectionDelete(
        String(id),
        { connectionId: [transfer.connectionID] },
        {},
        false
    )

    const {
        response: assignments,
        isLoading,
        sendNow: refreshList,
    } = useComplianceApiV1AssignmentsBenchmarkDetail(String(id), {}, false)
    console.log(assignments)

    useEffect(() => {
        if (transfer.connectionID !== '') {
            if (transfer.status) {
                sendEnable()
            } else {
                sendDisable()
            }
        }
    }, [transfer])

    useEffect(() => {
        if (firstLoading) {
            refreshList()
        }
        setFirstLoading(false)
    }, [])

    useEffect(() => {
        if (enableExecuted && !enableLoading) {
            setTransfer({ connectionID: '', status: false })
            refreshList()
        }
        if (disableExecuted && !disableLoading) {
            setTransfer({ connectionID: '', status: false })
            refreshList()
        }
    }, [enableExecuted, disableExecuted, enableLoading, disableLoading])

    return (
        <Table
            title="Assignmnets"
            id="compliance_assignments"
            columns={columns}
            onCellClicked={(event) => {
                if (event.colDef.headerName === 'Enable') {
                    setTransfer({
                        connectionID: event.data?.connectionID || '',
                        status: !(event.data?.status || false),
                    })
                }
            }}
            loading={isLoading}
            rowData={
                assignments?.connections?.sort(
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
                        setTransfer({ connectionID: 'all', status: false })
                    }}
                >
                    Disable All
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setTransfer({ connectionID: 'all', status: true })
                    }}
                >
                    Enable All
                </Button>
            </Flex>
        </Table>
    )
}
