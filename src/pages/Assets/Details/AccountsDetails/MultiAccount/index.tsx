import dayjs from 'dayjs'
import {
    CellClickedEvent,
    ColDef,
    GridOptions,
    ICellRendererParams,
} from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { Flex } from '@tremor/react'
import { useRef, useState } from 'react'
import { useOnboardApiV1ConnectionsSummaryList } from '../../../../../api/onboard.gen'
import {
    numberGroupedDisplay,
    priceDisplay,
} from '../../../../../utilities/numericDisplay'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import Summary from './Summary'
import DrawerPanel from '../../../../../components/DrawerPanel'
import { ConnectionDetails } from './ConnectionDetails'
import { ReactComponent as AzureIcon } from '../../../../../assets/icons/elements-supplemental-provider-logo-azure-new.svg'
import { ReactComponent as AWSIcon } from '../../../../../assets/icons/elements-supplemental-provider-logo-aws-original.svg'

interface IMultiAccount {
    topAccounts: any
    topAccountLoading: boolean
    selectedConnections: any
    activeTimeRange: any
}

interface IAccount {
    connector: string
    providerConnectionName: string
    providerConnectionID: string
    id: string
    lifecycleState: string
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
        cellRenderer: (params: ICellRendererParams<IAccount>) => (
            <Flex className="w-full h-full">
                {params.data?.connector === 'Azure' ? (
                    <AzureIcon />
                ) : (
                    <AWSIcon />
                )}
            </Flex>
        ),
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
        field: 'lifecycleState',
        headerName: 'State',
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

export default function MultiAccount({
    topAccounts,
    topAccountLoading,
    selectedConnections,
    activeTimeRange,
}: IMultiAccount) {
    const gridRef = useRef<AgGridReact>(null)

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [selectedAccountIndex, setSelectedAccountIndex] = useState(0)

    const { response: accounts, isLoading: isAccountsLoading } =
        useOnboardApiV1ConnectionsSummaryList({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            connector: selectedConnections?.provider,
            connectionId: selectedConnections?.connections,
            startTime: dayjs(activeTimeRange.from).unix(),
            endTime: dayjs(activeTimeRange.to).unix(),
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
            if (topAccountLoading) {
                params.api.showLoadingOverlay()
            }
        },
        onCellClicked(event: CellClickedEvent<any>) {
            if (event.rowIndex !== null) {
                setSelectedAccountIndex(event.rowIndex)
                setDrawerOpen(true)
            }
        },
    }

    const conns = (accounts?.connections || []).map((data) => {
        const newData: IAccount = {
            connector: data.connector || '',
            providerConnectionName: data.providerConnectionName || '',
            providerConnectionID: data.providerConnectionID || '',
            id: data.id || '',
            lifecycleState: data.lifecycleState || '',
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
        <>
            <div className="mt-5">
                <Summary
                    accounts={topAccounts?.connections}
                    loading={topAccountLoading}
                />
                <div className="ag-theme-alpine mt-10">
                    <AgGridReact
                        ref={gridRef}
                        domLayout="autoHeight"
                        gridOptions={gridOptions}
                        rowData={conns}
                    />
                </div>
            </div>
            <DrawerPanel
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Connection Details"
            >
                <ConnectionDetails
                    connection={accounts?.connections}
                    index={selectedAccountIndex}
                />
            </DrawerPanel>
        </>
    )
}
