import { Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { ReactComponent as AzureIcon } from '../../../../../../icons/elements-supplemental-provider-logo-azure-new.svg'

interface IPrincipals {
    principals: any
}

const columns: ColDef[] = [
    {
        field: 'connectortype',
        headerName: 'Connector',
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
                    <AzureIcon />
                </Flex>
            )
        },
    },
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

export default function Principals({ principals }: IPrincipals) {
    const gridRef = useRef<AgGridReact>(null)
    console.log(principals)
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [orgData, setOrgData] = useState(null)
    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onRowClicked: (event: RowClickedEvent<any>) => {
            setOrgData(event.data)
            setOpenInfo(true)
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
        <Card>
            <Flex flexDirection="row">
                <Title>Service Principals</Title>
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Add New SPN
                </Button>
            </Flex>
            <div className="ag-theme-alpine mt-6">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={principals?.credentials || []}
                />
            </div>
        </Card>
    )
}
