import { Badge, Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/solid'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'
import OrganizationInfo from './OrganizationInfo'
import NewOrganization from './NewOrganization'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import { AWSIcon } from '../../../../../../icons/icons'

interface IOrganizations {
    accounts: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    organizations: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
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
                    <AWSIcon id="org" />
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

export default function Organizations({
    organizations,
    accounts,
}: IOrganizations) {
    const gridRef = useRef<AgGridReact>(null)
    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [orgData, setOrgData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiCredential | undefined
    >(undefined)
    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onRowClicked: (
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiCredential>
        ) => {
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
        <>
            <Card>
                <Flex flexDirection="row">
                    <Title>Organizations</Title>
                    <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                        Create New Organization
                    </Button>
                </Flex>
                <div className="ag-theme-alpine mt-6">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={organizations}
                    />
                </div>
            </Card>
            <OrganizationInfo
                open={openInfo}
                onClose={() => {
                    setOpenInfo(false)
                }}
                data={orgData}
            />
            <NewOrganization
                accounts={accounts}
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    )
}
