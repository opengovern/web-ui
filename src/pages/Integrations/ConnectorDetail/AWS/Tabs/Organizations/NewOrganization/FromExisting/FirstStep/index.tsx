import { Bold, Button, Flex } from '@tremor/react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import React, { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiConnection } from '../../../../../../../../../api/api'
import { AWSIcon } from '../../../../../../../../../icons/icons'

interface IStep {
    onNext: (connectionID: string) => void
    onPrevious: () => void
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
}

const columns: ColDef[] = [
    {
        field: 'connector',
        headerName: 'Connector',
        width: 50,
        sortable: true,
        filter: true,
        type: 'connector',
    },
    {
        field: 'providerConnectionName',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lifecycleState',
        headerName: 'State',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        headerName: 'Kaytu Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export default function FirstStep({ onNext, onPrevious, accounts }: IStep) {
    const gridRef = useRef<AgGridReact>(null)

    const [selectedCredentialID, setSelectedCredentialID] = useState<string>('')

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        paginationPageSize: 10,
        getRowHeight: (params) => 50,
        onRowClicked(
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
        ) {
            setSelectedCredentialID(event.data?.credentialID || '')
        },
        sideBar: {
            toolPanels: [
                {
                    id: 'columns',
                    labelDefault: 'Columns',
                    labelKey: 'columns',
                    iconKey: 'columns',
                    toolPanel: 'agColumnsToolPanel',
                },
                {
                    id: 'filters',
                    labelDefault: 'Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }
    return (
        <Flex flexDirection="col" className="h-full ">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Select AWS Account</Bold>
                <div className="ag-theme-alpine w-full">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={accounts}
                    />
                </div>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => onNext(selectedCredentialID)}
                    disabled={selectedCredentialID === ''}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
