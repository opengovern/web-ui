import { AgGridReact } from 'ag-grid-react'
import React, { useRef, useState } from 'react'
import {
    CellClickedEvent,
    ColDef,
    GridOptions,
    ICellRendererParams,
} from 'ag-grid-community'
import { Flex } from '@tremor/react'
import {
    useComplianceApiV1AssignmentsBenchmarkDetail,
    useComplianceApiV1AssignmentsConnectionCreate,
    useComplianceApiV1AssignmentsConnectionDelete,
} from '../../../../../api/compliance.gen'
import { AWSIcon, AzureIcon } from '../../../../../icons/icons'
import { GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource } from '../../../../../api/api'

interface IAssignments {
    id: string | undefined
}

const columns: ColDef[] = [
    {
        width: 50,
        sortable: true,
        filter: true,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams) => {
            return (
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    className="w-full h-full"
                >
                    {params.data.connector === 'Azure' ? (
                        <AzureIcon />
                    ) : (
                        <AWSIcon />
                    )}
                </Flex>
            )
        },
    },
    {
        field: 'connectionName',
        headerName: 'Connection Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 2,
    },
    {
        field: 'connectionID',
        headerName: 'Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 2,
    },
    {
        headerName: 'Enable',
        sortable: true,
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
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                    </label>
                </Flex>
            )
        },
    },
]

export default function Assignments({ id }: IAssignments) {
    const gridRef = useRef<AgGridReact>(null)
    const [connection, setConnection] = useState<any>(null)

    const { response: assignments, sendNow: getData } =
        useComplianceApiV1AssignmentsBenchmarkDetail(String(id))
    const { response: enable, sendNow: sendEnable } =
        useComplianceApiV1AssignmentsConnectionCreate(
            String(id),
            connection,
            {},
            false
        )
    const { response: disable, sendNow: sendDisable } =
        useComplianceApiV1AssignmentsConnectionDelete(
            String(id),
            connection,
            {},
            false
        )

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        paginationPageSize: 25,
        async onCellClicked(
            event: CellClickedEvent<GithubComKaytuIoKaytuEnginePkgComplianceApiBenchmarkAssignedSource>
        ) {
            if (event.colDef.headerName === 'Enable') {
                // setConnection(event.data?.connectionID, () => {
                //         if (event.data?.status) {
                //             sendDisable()
                //         } else {
                //             sendEnable()
                //         }
                //         getData()
                //         // await setConnection(null)
                // })
            }
        },
        getRowHeight: (params) => 50,
    }

    return (
        <div className="ag-theme-alpine w-full">
            <AgGridReact
                ref={gridRef}
                domLayout="autoHeight"
                gridOptions={gridOptions}
                rowData={assignments || []}
            />
        </div>
    )
}
