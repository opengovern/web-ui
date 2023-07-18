import React, { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
    ColDef,
    GridOptions,
    ICellRendererParams,
    RowClickedEvent,
} from 'ag-grid-community'
import { Badge, Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import NewAzureSubscription from './NewSubscription'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'
import SubscriptionInfo from './SubscriptionInfo'
import { AzureIcon } from '../../../../../../icons/icons'

interface ISubscriptions {
    subscriptions: GithubComKaytuIoKaytuEnginePkgOnboardApiConnection[]
    spns: GithubComKaytuIoKaytuEnginePkgOnboardApiCredential[]
}

const columns: ColDef[] = [
    {
        field: 'connector',
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
        field: 'credentialName',
        headerName: 'Parent SPN Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'credentialID',
        headerName: 'Parent SPN ID',
        hide: true,
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
        cellRenderer: (params: ICellRendererParams) => {
            function getBadgeColor(status: string) {
                switch (status) {
                    case 'NOT_ONBOARD':
                        return 'neutral'
                    case 'IN_PROGRESS':
                        return 'yellow'
                    case 'ONBOARD':
                        return 'emerald'
                    case 'UNHEALTHY':
                        return 'rose'
                    default:
                        return 'gray'
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

export default function Subscriptions({ subscriptions, spns }: ISubscriptions) {
    const gridRef = useRef<AgGridReact>(null)

    const [open, setOpen] = useState(false)
    const [openInfo, setOpenInfo] = useState(false)
    const [priData, setPriData] = useState<
        GithubComKaytuIoKaytuEnginePkgOnboardApiConnection | undefined
    >(undefined)
    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        paginationPageSize: 25,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onRowClicked: (
            event: RowClickedEvent<GithubComKaytuIoKaytuEnginePkgOnboardApiConnection>
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
                <Title>Azure Subscriptions</Title>
                <Button icon={PlusIcon} onClick={() => setOpen(true)}>
                    Create New Azure Subscription
                </Button>
            </Flex>
            <div className="ag-theme-alpine mt-6" key="subscriptions">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={subscriptions}
                />
            </div>
            <SubscriptionInfo
                data={priData}
                open={openInfo}
                onClose={() => setOpenInfo(false)}
            />
            <NewAzureSubscription
                spns={spns}
                open={open}
                onClose={() => setOpen(false)}
            />
        </Card>
    )
}
