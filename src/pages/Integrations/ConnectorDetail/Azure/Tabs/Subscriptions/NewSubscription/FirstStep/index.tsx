import { Bold, Button, Flex } from '@tremor/react'
import { ColDef, GridOptions, RowClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCredential } from '../../../../../../../../api/api'

interface IStep {
    onNext: (selectedSPNID: string) => void
    onPrevious: () => void
    spns: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

const columns: ColDef[] = [
    {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialType',
        headerName: 'Credential Type',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'enabled',
        headerName: 'Enabled',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthStatus',
        headerName: 'Health Status',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthReason',
        headerName: 'Health Reason',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'total_connections',
        headerName: 'Total Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'enabled_connections',
        headerName: 'Enabled Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
    {
        field: 'unhealthy_connections',
        headerName: 'Unhealthy Connections',
        sortable: true,
        filter: true,
        resizable: true,
        hide: true,
        flex: 1,
    },
]

export default function FirstStep({ onNext, onPrevious, spns }: IStep) {
    const gridRef = useRef<AgGridReact>(null)
    const [goingToNext, setGoingToNext] = useState<boolean>(false)

    const [selectedSPN, setSelectedSPN] = useState<string>('')

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        paginationPageSize: 10,
        getRowHeight: (params) => 50,
        onRowClicked(
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
        ) {
            setSelectedSPN(event.data?.id || '')
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
                    labelDefault: 'Table Filters',
                    labelKey: 'filters',
                    iconKey: 'filter',
                    toolPanel: 'agFiltersToolPanel',
                },
            ],
            defaultToolPanel: '',
        },
    }
    return (
        <Flex flexDirection="col" justifyContent="between" className="h-full">
            <Flex flexDirection="col" alignItems="start">
                <Bold className="my-6">Select SPN</Bold>
                <div className="ag-theme-alpine w-full">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={spns}
                    />
                </div>
            </Flex>
            <Flex flexDirection="row" justifyContent="end">
                <Button variant="secondary" onClick={() => onPrevious()}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setGoingToNext(true)
                        onNext(selectedSPN)
                    }}
                    loading={goingToNext}
                    disabled={selectedSPN === ''}
                    className="ml-3"
                >
                    Next
                </Button>
            </Flex>
        </Flex>
    )
}
