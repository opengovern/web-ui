import React, { useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { Button, Card, Flex, Title } from '@tremor/react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { ReactComponent as AzureIcon } from '../../../../../../icons/elements-supplemental-provider-logo-azure-new.svg'
import NewAzureSubscription from './NewSubscription'
import {
    GithubComKaytuIoKaytuEnginePkgOnboardApiConnection,
    GithubComKaytuIoKaytuEnginePkgOnboardApiCredential,
} from '../../../../../../api/api'

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
                    <AzureIcon />
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

export default function Subscriptions({ subscriptions, spns }: ISubscriptions) {
    const [open, setOpen] = useState(false)
    const gridRef = useRef<AgGridReact>(null)
    console.log(subscriptions)
    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
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
            <div className="ag-theme-alpine mt-6">
                <AgGridReact
                    ref={gridRef}
                    domLayout="autoHeight"
                    gridOptions={gridOptions}
                    rowData={subscriptions}
                />
            </div>
            <NewAzureSubscription
                spns={spns}
                open={open}
                onClose={() => setOpen(false)}
            />
        </Card>
    )
}
