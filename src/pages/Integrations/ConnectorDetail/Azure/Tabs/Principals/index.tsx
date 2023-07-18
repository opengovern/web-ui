import { Badge, Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import { AgGridReact } from 'ag-grid-react'
import React, { useRef, useState } from 'react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import PrincipalInfo from './PrincipalInfo'
import NewPrincipal from './NewPrincipal'
import { GithubComKaytuIoKaytuEnginePkgOnboardApiCredential } from '../../../../../../api/api'
import { AzureIcon } from '../../../../../../icons/icons'

interface IPrincipals {
    principals: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
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
                    <AzureIcon key={params.data.id} />
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
        cellRenderer: (params: ICellRendererParams) => {
            function getBadgeColor(status: string) {
                switch (status) {
                    case 'healthy':
                        return 'emerald'
                    case 'unhealthy':
                        return 'rose'
                    default:
                        return 'neutral'
                }
            }
            return (
                <Badge color={getBadgeColor(params.value)}>
                    {params.value}
                </Badge>
            )
        },
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

    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiCredential | undefined
    >(undefined)

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onRowClicked: (
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
        ) => {
            setPriData(event.data)
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
            <div className="ag-theme-alpine mt-6" key="principals">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={principals}
                />
            </div>
            <PrincipalInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
            />
            <NewPrincipal open={open} onClose={() => setOpen(false)} />
        </Card>
    )
}
