import React, { useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridOptions, ICellRendererParams } from 'ag-grid-community'
import { ReactComponent as AzureIcon } from '../../../../assets/icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../assets/icons/elements-supplemental-provider-logo-aws-original.svg'
import {
    numberGroupedDisplay,
    priceDisplay,
} from '../../../../utilities/numericDisplay'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../api/onboard.gen'
import Summary from './Summary'

import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

type IProps = {
    selectedConnections: any
    timeRange: any
}

interface IAccount {
    connector: string
    providerConnectionName: string
    providerConnectionID: string
    id: string
    healthState: string
    cost: string
    resourceCount: string
    onboardDate: string
    lastInventory: string
}

const columns: ColDef[] = [
    {
        field: 'providerIcon',
        headerName: ' ',
        width: 50,
        sortable: false,
        filter: false,
        cellStyle: { padding: 0 },
        cellRenderer: (params: ICellRendererParams<IAccount>) => {
            return (
                <div className="flex justify-center items-center w-full h-full">
                    {params.data?.connector === 'Azure' ? (
                        <AzureIcon />
                    ) : (
                        <AWSIcon />
                    )}
                </div>
            )
        },
    },
    {
        field: 'providerConnectionName',
        headerName: 'Cloud Account Name',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'providerConnectionID',
        headerName: 'Cloud Account ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'id',
        headerName: 'Connection ID',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'healthState',
        headerName: 'Health',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'cost',
        headerName: 'Cost',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        cellDataType: 'text',
    },
    {
        field: 'resourceCount',
        headerName: 'Resources',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'onboardDate',
        headerName: 'Onboard Date',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
    {
        field: 'lastInventory',
        headerName: 'Last Inventory Date',
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
    },
]
export default function ServicesDetails({
    selectedConnections,
    timeRange,
}: IProps) {
    const gridRef = useRef<AgGridReact>(null)

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            startTime: timeRange[0],
            endTime: timeRange[1],
            pageSize: 10000,
            pageNumber: 1,
        })

    const gridOptions: GridOptions = {
        columnDefs: columns,
        pagination: true,
        rowSelection: 'multiple',
        animateRows: true,
        getRowHeight: (params) => 50,
        onGridReady: (params) => {
            if (isAccountsLoading) {
                params.api.showLoadingOverlay()
            }
        },
    }

    const conns = (accounts?.connections || []).map((data) => {
        const newData: IAccount = {
            connector: data.connector || '',
            providerConnectionName: data.providerConnectionName || '',
            providerConnectionID: data.providerConnectionID || '',
            id: data.id || '',
            healthState: data.healthState || '',
            cost: priceDisplay(data.cost) || '',
            resourceCount: numberGroupedDisplay(data.resourceCount) || '',
            onboardDate: data.onboardDate || '',
            lastInventory: data.lastInventory || '',
        }

        if (data.onboardDate) {
            newData.onboardDate = new Date(
                Date.parse(data.onboardDate)
            ).toLocaleDateString('en-US')
        }

        if (data.lastInventory) {
            newData.lastInventory = new Date(
                Date.parse(data.lastInventory)
            ).toLocaleDateString('en-US')
        }
        return newData
    })

    return (
        <main>
            <div className="mt-5">
                <Summary />
                <div className="ag-theme-alpine mt-10">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={conns}
                    />
                </div>
            </div>
        </main>
    )
}
